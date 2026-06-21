from main import place_matches_all_filters


def test_no_filters_passes():
    place = {"types": ["restaurant"], "rating": 4.0}
    assert place_matches_all_filters(place, {}) is True


def test_cuisine_filter_excludes_non_match():
    place = {"types": ["cafe"]}
    filters = {"cuisine": "japanese_restaurant"}
    assert place_matches_all_filters(place, filters) is False


def test_rating_below_minimum_excluded():
    place = {"types": ["restaurant"], "rating": 3.0}
    filters = {"rating": 4.0}
    assert place_matches_all_filters(place, filters) is False


def test_price_too_expensive_excluded():
    place = {
        "types": ["restaurant"],
        "priceRange": {
            "startPrice": {"units": "80"},
            "endPrice": {"units": "120"},
        },
    }
    filters = {"priceMax": 50}
    assert place_matches_all_filters(place, filters) is False
