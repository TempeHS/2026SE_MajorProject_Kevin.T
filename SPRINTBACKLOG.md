# Sprint backlog

## Sprint 1: Skeleton

### Goal

Create the skeleton of the website with the general layout of all the buttons and where they'd be

### Sprint plan

- Working login and signup systems (from previous project)
- Skeleton buttons and layout of main page
- Remove old functionality from previous project

### Sprint review

- Skeleton home page created with buttons

### Sprint retrospective

- **Went well:** Home page scaffold was finished relatively quickly
- **Didn’t go well:** Sprint was started quite late, pushing back the rest of development

## Sprint 2: Map API

### Goal

Integrate Google Maps into the website and create the core features

### Sprint plan

- Working map interface on home page
- Ability to search at user's location and limit search by distance
- Ability to filter between restaurants by categories and other values (cuisine, service style, star rating, price, dietary restrictions)
- Restaurant locations are shown on map with markers

### Unit test summary table

| Test ID | Test Name                         | What It Tests                              | Input                                            | Expected Output | Actual Output | Pass / Fail |
| ------- | --------------------------------- | ------------------------------------------ | ------------------------------------------------ | --------------- | ------------- | ----------- |
| T1      | test_no_filters_passes            | A place passes when no filters are applied | place rating 4.0, empty filters                  | True            | True          | Pass        |
| T2      | test_cuisine_filter_excludes_non_match | Cuisine filter excludes non-matching types | place types ["cafe"], filter "japanese_restaurant" | False         | False         | Pass        |
| T3      | test_rating_below_minimum_excluded | Rating filter excludes low ratings         | place rating 3.0, filter 4.0                     | False           | False         | Pass        |
| T4      | test_price_too_expensive_excluded | Price filter excludes too-expensive places | place price $80–120, filter priceMax 50          | False           | False         | Pass        |

### Sprint review

- Google maps UI is integrated on the home page
- Backend flask endpoint for searching is implemented and connected to Places API
- Restaurant filtering implemented for cuisine, service style, dietary restrictions, star rating and price limits
- Distance filter slider with graphical representation on map added
- Some issues around CSP are still present

### Sprint retrospective

- **Went well:** Core map search + filtering functionality was implemented
- **Didn’t go well:** Sprint was finished quite late, and some issues with CSP are present at runtime
- **Action items for next sprint:**
  - Move Google API key to environment variable and remove hardcoded key for security
  - Align CSP policy with manifest/service worker requirements
  - Add unit tests for `place_matches_all_filters` edge cases
  - Add tests for `/api/search` and filter application
