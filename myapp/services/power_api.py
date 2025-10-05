import requests
import pandas as pd
from myapp.services.mapping import geocode_city

def get_climatology(city, month, day, start_year=2000, end_year=2024):
    try:
        # 1️⃣ Get coordinates dynamically
        lat, lon = geocode_city(city)
        if not lat or not lon:
            return {"error": f"Could not find coordinates for city '{city}'"}

        # 2️⃣ Fetch NASA POWER data
        url = (
            f"https://power.larc.nasa.gov/api/temporal/daily/point"
            f"?parameters=PRECTOTCORR,T2M,RH2M,WS2M"
            f"&community=AG&longitude={lon}&latitude={lat}"
            f"&start={start_year}0101&end={end_year}1231&format=JSON"
        )

        resp = requests.get(url)
        if resp.status_code != 200:
            return {"error": f"NASA POWER API failed with {resp.status_code}"}

        data = resp.json()

        # 3️⃣ Validate response
        if "properties" not in data or "parameter" not in data["properties"]:
            return {"error": "Invalid response from NASA POWER API"}

        # 4️⃣ Build DataFrame correctly
        df = pd.DataFrame(data["properties"]["parameter"])
        if df.empty:
            return {"error": "NASA data returned empty DataFrame"}

        df.index = pd.to_datetime(df.index)

        mask = (df.index.month == month) & (df.index.day == day)
        daily_values = df.loc[mask]

        if daily_values.empty:
            return {"error": f"No climatology data found for {city} on {month}/{day}"}

        daily_mean = daily_values.mean()

        # 5️⃣ Compute weighted probability
        base_prob = (daily_values["PRECTOTCORR"] > 1.0).sum() / len(daily_values)
        temp = daily_mean["T2M"]
        humidity = daily_mean["RH2M"]
        wind = daily_mean["WS2M"]

        humidity_factor = humidity / 100
        temp_factor = 1 - abs(temp - 20) / 40
        wind_factor = min(wind / 10, 1)

        rain_prob = round(base_prob * (0.5 + 0.5 * (humidity_factor + temp_factor + wind_factor) / 3), 2)

        return {
            "city": city,
            "month": month,
            "day": day,
            "rain": float(daily_mean["PRECTOTCORR"]),
            "temp": float(daily_mean["T2M"]),
            "humidity": float(daily_mean["RH2M"]),
            "wind": float(daily_mean["WS2M"]),
            "rain_prob": rain_prob,
        }

    except Exception as e:
        return {"error": str(e)}
