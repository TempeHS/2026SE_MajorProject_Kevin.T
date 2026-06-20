from flask import Flask
from flask import redirect
from flask import render_template
from flask import request
from flask import jsonify
from flask import session
import requests
from flask_wtf import CSRFProtect
from flask_csp.csp import csp_header
import logging

import userManagement as dbHandler
import logsManagement as logHandler

# 2fa stuff
import pyotp
import pyqrcode
import base64
from io import BytesIO

# Code snippet for logging a message
# app.logger.critical("message")

app_log = logging.getLogger(__name__)
logging.basicConfig(
    filename="security_log.log",
    encoding="utf-8",
    level=logging.DEBUG,
    format="%(asctime)s %(message)s",
)

# Generate a unique basic 16 key: https://acte.ltd/utils/randomkeygen
app = Flask(__name__)
app.secret_key = b"_53oi3uriq9pifpff;apl"
app.config["SESSION_COOKIE_NAME"] = "login_session"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
csrf = CSRFProtect(app)


# Redirect index.html to domain root for consistent UX
@app.route("/index", methods=["GET"])
@app.route("/index.htm", methods=["GET"])
@app.route("/index.asp", methods=["GET"])
@app.route("/index.php", methods=["GET"])
@app.route("/index.html", methods=["GET"])
def root():
    return redirect("/", 302)


@app.route("/", methods=["GET"])
@csp_header(
    {
        "base-uri": "'self'",
        "default-src": "'self'",
        "style-src": "'self' 'unsafe-inline' https://fonts.googleapis.com",
        "style-src-attr": "'unsafe-inline'",
        "style-src-elem": "'self' 'unsafe-inline' https://fonts.googleapis.com",
        "script-src": "'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com",
        "script-src-elem": "'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com",
        "img-src": "'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com https://*.gstatic.com",
        "media-src": "'self'",
        "font-src": "'self' https://fonts.gstatic.com data:",
        "object-src": "'none'",
        "child-src": "'self' blob:",
        "connect-src": "'self' data: blob: https://maps.googleapis.com https://maps.gstatic.com https://www.gstatic.com https://*.gstatic.com https://places.googleapis.com",
        "worker-src": "'self' blob:",
        "manifest-src": "'self'",
        "report-uri": "/csp_report",
        "frame-ancestors": "'none'",
        "form-action": "'self'",
        "frame-src": "'none'",
    }
)
def index():
    is_logged_in = bool(session.get("logged_in") and session.get("authenticated"))
    return render_template(
        "/index.html",
        is_logged_in=is_logged_in,
        user_email=session.get("email"),
    )


@app.route("/login.html", methods=["POST", "GET"])
@csp_header(
    {
        "base-uri": "'self'",
        "default-src": "'self'",
        "style-src": "'self'",
        "script-src": "'self'",
        "img-src": "'self' data:",
        "media-src": "'self'",
        "font-src": "'self'",
        "object-src": "'self'",
        "child-src": "'self'",
        "connect-src": "'self'",
        "worker-src": "'self'",
        "report-uri": "/csp_report",
        "frame-ancestors": "'none'",
        "form-action": "'self'",
        "frame-src": "'none'",
    }
)
def login():
    if session.get("logged_in"):
        return redirect("/auth.html")

    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        status, message, user_secret = dbHandler.verifyUser(email, password)

        if status:
            session["logged_in"] = True
            session["email"] = email
            session["user_secret"] = user_secret
            app.logger.info(f"User {email} logged in successfully")
            return redirect("/auth.html")
        else:
            app.logger.warning(f"Failed login attempt for {email}")
            return render_template("/login.html", error_message=message)

    return render_template("/login.html")


# Endpoint for logging CSP violations
@app.route("/csp_report", methods=["POST"])
@csrf.exempt
def csp_report():
    app.logger.critical(request.data.decode())
    return "done"


@app.route("/auth.html", methods=["POST", "GET"])
def auth():
    if not session.get("logged_in"):
        return redirect("/login.html")

    if session.get("authenticated"):
        return redirect("/index.html")

    user_secret = session.get("user_secret")
    email = session.get("email")

    # check if missing secret
    if not user_secret:
        app.logger.error(f"No 2FA secret found for {email}")
        session.clear()
        return redirect("/login.html")

    totp = pyotp.TOTP(user_secret)

    # generate qr code
    otp_uri = totp.provisioning_uri(name=email, issuer_name="Developer Log App")
    qr_code = pyqrcode.create(otp_uri)
    stream = BytesIO()
    qr_code.png(stream, scale=5)
    qr_code_b64 = base64.b64encode(stream.getvalue()).decode("utf-8")

    if request.method == "POST":
        otp_input = request.form["otp"]
        if totp.verify(otp_input):
            session["authenticated"] = True
            app.logger.info(f"User {email} completed 2FA successfully")
            return redirect("/index.html")
        else:
            app.logger.warning(f"Invalid 2FA code for {email}")
            return render_template(
                "/auth.html", error_message="Invalid OTP", qr_code=qr_code_b64
            )

    return render_template(
        "/auth.html", email=session.get("email"), qr_code=qr_code_b64
    )


@app.route("/signup.html", methods=["POST", "GET"])
def signup():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        success, message = dbHandler.insertUser(email, password)
        return render_template(
            "/signup.html", is_done=True, error_message=None if success else message
        )
    else:
        return render_template("/signup.html", error_message=None)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    app.logger.info(f"User {session.get('email')} logged out")
    session.clear()
    return redirect("/")


@app.route("/privacy.html", methods=["GET"])
def privacy():
    return render_template("/privacy.html")


# function for checking if the place matches all the filters
def place_matches_all_filters(place, filters):
    """
    filters is whatever the user picked e.g.
    {
        "cuisine": "japanese_restaurant",
        "service-style": "meal_takeaway",
        "dietary": "vegan_restaurant",
        "star_min": 4.0,
        and so on
    }
    """

    types = place.get("types") or []
    checks = []

    # filters
    if filters.get("cuisine") and filters["cuisine"] != "restaurant":
        checks.append(filters["cuisine"] in types)

    if filters.get("service-style") and filters["service-style"] != "any":
        checks.append(filters["service-style"] in types)

    if filters.get("dietary") and filters["dietary"] != "none":
        checks.append(filters["dietary"] in types)

    # star rating filter (only when user set > 0)
    min_rating = filters.get("rating")
    if min_rating not in (None, "", 0, "0"):  # if it aint 0
        try:
            min_rating = float(min_rating)
            place_rating = place.get("rating")
            if place_rating is None or float(place_rating) < min_rating:
                checks.append(False)
        except (TypeError, ValueError):
            checks.append(False)

    # price range filter
    price_min = filters.get("priceMin")
    price_max = filters.get("priceMax")

    # if the filter is actually chosen by the user
    if price_min != None or price_max != None:
        price_range = place.get("priceRange") or {}
        start = price_range.get("startPrice", {}).get("units")
        end = price_range.get("endPrice", {}).get("units")

        if start != None and end != None:
            start = float(start)
            end = float(end)
            if price_min != None and end < float(price_min):
                checks.append(False)  # false cos the place is too cheap
            if price_max != None and start > float(price_max):
                checks.append(False)  # too expensive

    # open now filter
    if filters.get("openNow"):
        opening = place.get("currentOpeningHours") or {}
        if not opening.get("openNow"):
            checks.append(False)

    # AND behaviour
    # - If user selected filters, all selected checks must be True.
    # - If no filters selected, checks is empty -> return True (do not exclude).
    return all(checks)


# i must say that this was mostly ai but i went through it and understood it
@app.route("/api/search", methods=["POST"])
@csrf.exempt
def search_places():
    data = request.get_json(silent=True) or {}  # read json body

    # get location and search radius
    try:
        lat = float(data.get("lat"))
        lng = float(data.get("lng"))
        radius = int(data.get("radius", 2000))  # default radius is 2km
    except:
        return (
            jsonify({"error": "Invalid lat/lng/radius"}),
            400,
        )  # if theres bad input types

    place_type = data.get("cuisine", "restaurant")

    # additional filters
    filters = {
        "cuisine": data.get("cuisine", "restaurant"),
        "service-style": data.get("serviceStyle", "any"),
        "dietary": data.get("dietary", "none"),
        "priceMin": data.get("priceMin"),
        "priceMax": data.get("priceMax"),
        "rating": data.get("rating"),
        "openNow": data.get("openNow", False),
    }

    url = "https://places.googleapis.com/v1/places:searchNearby"  # Places API endpoint
    # json thing for google api
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "AIzaSyADzNnIA-zf9LSniYX8Z7uAo-VmfsiKz-c",  # hide this api key!!!!!!!!!!!!!!!!!!!!!!!!!!!
        "X-Goog-FieldMask": ",".join(
            [
                "places.id",
                "places.displayName",
                "places.location",
                "places.formattedAddress",
                "places.googleMapsUri",
                "places.types",
                "places.priceRange",
                "places.rating",
                "places.currentOpeningHours.openNow",
            ]
        ),
    }

    payload = {
        "includedTypes": [place_type],
        "maxResultCount": 20,  # cap result count
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},  # center point
                "radius": radius,  # meters
            }
        },
    }

    try:
        resp = requests.post(
            url, headers=headers, json=payload, timeout=12
        )  # hello google
    except requests.RequestException:
        return (
            jsonify({"error": "Google Places request failed"}),
            502,
        )  # request error (error from me not from google)

    if not resp.ok:
        return jsonify({"error": "Places API error", "details": resp.text}), 502

    result = resp.json()
    places = result.get("places", [])
    result["places"] = [
        place for place in places if place_matches_all_filters(place, filters)
    ]

    return jsonify(result), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
