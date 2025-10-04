import requests

def geocode_city(city_name):
    url = "https://nominatim.openstreetmap.org/search"
    headers = {"User-Agent": "HackathonApp/1.0 (contact@example.com)"}
    params = {"q": city_name, "format": "json", "limit": 1}

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10)
        resp.raise_for_status()  # raise error if not 200
        data = resp.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
        else:
            return None, None
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None, None
