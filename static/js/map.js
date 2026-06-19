// this is like all ai or just taken from the google maps docs cos i do not know a lick of javascript

// prettier-ignore
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyADzNnIA-zf9LSniYX8Z7uAo-VmfsiKz-c",
  v: "weekly",
});
// remove the api key!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let map;
let infoWindow;
let nearbyMarkers = [];
let searchRadiusCircle = null;
let selectedCuisine = "restaurant";
let selectedServiceStyle = "restaurant";
let selectedDietary = "none";
let selectedPriceMin = null;
let selectedPriceMax = null;

function getSliderRadiusMeters() {
  const distanceSlider = document.getElementById("range-distance");
  if (!distanceSlider) return null;

  const km = Number(distanceSlider.value);
  if (!Number.isFinite(km) || km <= 0) return null; // 0 = auto radius

  return Math.min(km * 1000, 50000); // Places API max 50,000m
}

function handleLocationError(browserHasGeolocation, infoWindowInstance, pos) {
  infoWindowInstance.setPosition(pos);
  infoWindowInstance.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed. (Did you allow location access?)"
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindowInstance.open(map);
}

function clearNearbyMarkers() {
  for (const marker of nearbyMarkers) {
    marker.map = null;
  }
  nearbyMarkers = [];
}

function buildInfoContent(place) {
  const content = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = place.displayName || "Restaurant";
  content.appendChild(title);

  if (place.formattedAddress) {
    const address = document.createElement("div");
    address.textContent = place.formattedAddress;
    content.appendChild(address);
  }

  if (place.googleMapsURI) {
    const link = document.createElement("a");
    link.href = place.googleMapsURI;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on Google Maps";
    content.appendChild(link);
  }

  return content;
}

function updateSearchRadiusCircle(innerMap, center, radius) {
  if (!searchRadiusCircle) {
    searchRadiusCircle = new google.maps.Circle({
      map: innerMap,
      strokeColor: "#0d6efd",
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: "#0d6efd",
      fillOpacity: 0.05,
      clickable: false,
      zIndex: 1,
    });
  }

  searchRadiusCircle.setCenter(center);
  searchRadiusCircle.setRadius(radius); // meters
  searchRadiusCircle.setMap(innerMap);
}

async function nearbySearch(innerMap) {
  const [{ AdvancedMarkerElement }, { spherical }] = await Promise.all([
    google.maps.importLibrary("marker"),
    google.maps.importLibrary("geometry"),
  ]);

  const bounds = innerMap.getBounds();
  const center = innerMap.getCenter();
  if (!bounds || !center) return;

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const diameter = spherical.computeDistanceBetween(ne, sw);
  const autoRadius = Math.min(diameter / 2, 50000);

  const sliderRadius = getSliderRadiusMeters();
  const radius = sliderRadius ?? autoRadius;

  updateSearchRadiusCircle(innerMap, center, radius);

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: center.lat(),
        lng: center.lng(),
        radius: Math.round(radius),
        cuisine: selectedCuisine,
        serviceStyle: selectedServiceStyle,
        dietary: selectedDietary,
        priceMin: selectedPriceMin,
        priceMax: selectedPriceMax,
      }),
    });

    if (!res.ok) throw new Error(`Backend search failed: ${res.status}`);

    const data = await res.json();
    const places = data.places || [];

    clearNearbyMarkers();
    if (!places.length) return;

    const fitBounds = new google.maps.LatLngBounds();

    for (const place of places) {
      if (!place.location) continue;

      const loc = {
        lat: place.location.latitude,
        lng: place.location.longitude,
      };

      fitBounds.extend(loc);

      const marker = new AdvancedMarkerElement({
        map: innerMap,
        position: loc,
        title:
          (typeof place.displayName === "string"
            ? place.displayName
            : place.displayName?.text) || "Restaurant",
      });

      marker.addListener("gmp-click", () => {
        const content = buildInfoContent({
          displayName:
            typeof place.displayName === "string"
              ? place.displayName
              : place.displayName?.text,
          formattedAddress: place.formattedAddress,
          googleMapsURI: place.googleMapsURI || place.googleMapsUri,
        });
        infoWindow.setContent(content);
        infoWindow.open({ map: innerMap, anchor: marker });
      });

      nearbyMarkers.push(marker);
    }

    if (!fitBounds.isEmpty()) innerMap.fitBounds(fitBounds, 100);
  } catch (error) {
    console.error("Nearby search failed:", error);
  }
}

// makes the active item in the dropdown look active
function setDropdownActive(items, activeItem) {
  for (const item of items) {
    item.classList.remove("active");
    item.removeAttribute("aria-current");
  }
  activeItem.classList.add("active");
  activeItem.setAttribute("aria-current", "true");
}

function wireFilterDropdown(
  selector,
  currentValueGetter,
  currentValueSetter,
  dataKey,
) {
  const items = Array.from(document.querySelectorAll(selector));
  if (!items.length) return;

  // set initial active state from current JS variable
  const currentValue = currentValueGetter();
  const initial = items.find((item) => item.dataset[dataKey] === currentValue);
  if (initial) setDropdownActive(items, initial);

  // update state + active style on click
  for (const item of items) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const value = item.dataset[dataKey];
      currentValueSetter(value);
      setDropdownActive(items, item);
    });
  }
}

async function init() {
  const [{ event }] = await Promise.all([
    google.maps.importLibrary("core"),
    google.maps.importLibrary("maps"),
    google.maps.importLibrary("marker"),
  ]);

  const mapElement = document.querySelector("gmp-map");
  const innerMap = mapElement.innerMap;
  map = innerMap;

  innerMap.setOptions({
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },

    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    },

    streetViewControl: false,
    fullscreenControl: false,
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add(
    "custom-map-control-button",
    "btn",
    "btn-light",
    "btn-sm",
  );

  innerMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
    locationButton,
  );

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(innerMap);
          innerMap.setCenter(pos);

          await nearbySearch(innerMap);
        },
        () => {
          handleLocationError(true, infoWindow, innerMap.getCenter());
        },
      );
    } else {
      handleLocationError(false, infoWindow, innerMap.getCenter());
    }
  });

  // Hook up bottom-center Search button
  const searchBtn = document.getElementById("search-nearby-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      void nearbySearch(innerMap);
    });
  }

  // Hook up distance slider
  const distanceSlider = document.getElementById("range-distance");
  if (distanceSlider) {
    distanceSlider.addEventListener("change", () => {
      void nearbySearch(innerMap);
    });
  }

  // Initial nearby restaurant search after map is ready.
  event.addListenerOnce(innerMap, "idle", () => {
    void nearbySearch(innerMap);
  });

  // hook up the dropdowns
  wireFilterDropdown(
    "[data-cuisine]",
    () => selectedCuisine,
    (v) => (selectedCuisine = v),
    "cuisine",
  );
  wireFilterDropdown(
    "[data-service-style]",
    () => selectedServiceStyle,
    (v) => (selectedServiceStyle = v),
    "serviceStyle",
  );
  wireFilterDropdown(
    "[data-dietary]",
    () => selectedDietary,
    (v) => (selectedDietary = v),
    "dietary",
  );

  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");

  if (priceMin) {
    priceMin.addEventListener("change", () => {
      selectedPriceMin = priceMin.value ? Number(priceMin.value) : null;
    });
  }

  if (priceMax) {
    priceMax.addEventListener("change", () => {
      selectedPriceMax = priceMax.value ? Number(priceMax.value) : null;
    });
  }

  console.log({ mapElement, innerMap });
}

void init();
