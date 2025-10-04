import requests
import pandas as pd


def get_climatology(lat, lon, month, day, start_year=2000, end_year=2010):
    url = (
        f"https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters=PRECTOTCORR,T2M,RH2M,WS2M"
        f"&community=AG&longitude={lon}&latitude={lat}"
        f"&start={start_year}0101&end={end_year}1231&format=JSON"
    )

    resp = requests.get(url).json()
    df = pd.DataFrame(resp["properties"]["parameter"])
    df.index = pd.to_datetime(df.index)

    # Filter rows for this month/day
    mask = (df.index.month == month) & (df.index.day == day)
    daily_values = df.loc[mask]

    # Average values (climatological mean)
    daily_mean = daily_values.mean()

    # Probability of rain = fraction of years where rain > 0
    rain_prob = (daily_values["PRECTOTCORR"] > 0).sum() / len(daily_values)

    return {
        "month": month,
        "day": day,
        "rain": float(daily_mean["PRECTOTCORR"]),
        "temp": float(daily_mean["T2M"]),
        "humidity": float(daily_mean["RH2M"]),
        "wind": float(daily_mean["WS2M"]),
        "rain_prob": round(float(rain_prob), 2)  # actual probability 0–1
    }
