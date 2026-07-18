import os

import requests


def geocode_city(city_name):
    url = "https://nominatim.openstreetmap.org/search"
    headers = {
        "User-Agent": os.environ.get("GEOCODER_USER_AGENT", "D-Triard-NASA-SAC25/1.0")
    }
    params = {"q": city_name, "format": "json", "limit": 1}

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        print(f"Geocoding error: {e}")

    return None, None
