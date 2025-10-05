import requests
import pandas as pd

def get_climatology(city, month, day, start_year=2000, end_year=2010):
    CITY_COORDS = {
        "istanbul": (41.0082, 28.9784),
        "ankara": (39.9208, 32.8541),
        "izmir": (38.4192, 27.1287),
        "sakarya": (40.7731, 30.3948),
        "antalya": (36.8841, 30.7056),
        "bursa": (40.1828, 29.0669),
        "cairo": (30.0444, 31.2357),
    }

    # Normalize and validate city name
    city = city.strip().lower()
    city = city.split(",")[0]  # handle cases like "Sakarya, Turkey"
    if city not in CITY_COORDS:
        raise ValueError(f"City '{city}' not found in database")

    # ✅ Now lat/lon are properly defined
    lat, lon = CITY_COORDS[city]

    # Fetch NASA POWER data
    url = (
        f"https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters=PRECTOTCORR,T2M,RH2M,WS2M"
        f"&community=AG&longitude={lon}&latitude={lat}"
        f"&start={start_year}0101&end={end_year}1231&format=JSON"
    )

    resp = requests.get(url).json()

    # Validate NASA response
    if "properties" not in resp or "parameter" not in resp["properties"]:
        raise ValueError("Invalid response from NASA POWER API")

    # Convert to DataFrame
    df = pd.DataFrame(resp["properties"]["parameter"])
    df.index = pd.to_datetime(df.index)

    # Filter by month and day
    mask = (df.index.month == month) & (df.index.day == day)
    daily_values = df.loc[mask]

    if daily_values.empty:
        raise ValueError(f"No climatology data found for {city} on {month}/{day}")

    # Calculate averages
    daily_mean = daily_values.mean()

    # Probability of rain = fraction of days with rainfall > 0
    rain_prob = (daily_values["PRECTOTCORR"] > 0).sum() / len(daily_values)

    return {
        "city": city,
        "month": month,
        "day": day,
        "rain": float(daily_mean["PRECTOTCORR"]),
        "temp": float(daily_mean["T2M"]),
        "humidity": float(daily_mean["RH2M"]),
        "wind": float(daily_mean["WS2M"]),
        "rain_prob": round(float(rain_prob), 2),
    }
