# D-Triard NASA SAC25

D-Triard Pro is a Django web application for planning outdoor events with climate-aware rain-risk guidance. A user creates an account, enters an event date and location, and the app geocodes the place, fetches historical daily weather data from NASA POWER, calculates a rain probability, and saves the plan for later review.

## Project Description

This project was built as an event-planning decision support tool. Instead of showing only a normal one-day weather forecast, it uses historical climatology for the same month/day across multiple years. That makes it useful when someone wants to plan a future event and understand whether the selected date and city are usually rainy.

The app combines:

- Django backend routes for authentication, weather analysis, and saved events.
- NASA POWER daily climate data for precipitation, temperature, humidity, and wind.
- OpenStreetMap Nominatim geocoding to convert city names into latitude/longitude.
- A Tailwind-powered frontend for signup, login, event planning, prediction display, and event history.
- SQLite for local development storage.

## Features

- User signup, login, logout, and session-based saved event history.
- City/date based rain-risk calculation using historical NASA POWER data.
- Weighted probability based on precipitation frequency, humidity, temperature, and wind.
- Saved event predictions with name, details, city, date, probability, and creation time.
- Client-side dashboard flow for planning new events and reviewing previous plans.
- Environment-based settings for safer local and hosted deployment.

## How It Works

1. The user enters an event name, event date, and location.
2. The frontend sends the city, month, and day to `/api/climatology/`.
3. The backend geocodes the city with OpenStreetMap Nominatim.
4. The backend requests historical daily data from NASA POWER for 2000-2024.
5. The app filters historical records matching the requested month/day.
6. It computes average precipitation, temperature, humidity, and wind values.
7. It estimates rain probability by combining precipitation frequency with weather-condition factors.
8. If the user is logged in, the event and probability are saved to the database.

## Tech Stack

- Python 3
- Django 5.2
- SQLite
- Pandas
- Requests
- NASA POWER API
- OpenStreetMap Nominatim
- HTML, CSS, JavaScript
- Tailwind CSS CDN

## Local Setup

```bash
git clone https://github.com/ille-amissus/D-Triard-NASA-SAC25.git
cd D-Triard-NASA-SAC25
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver
```

macOS/Linux:

```bash
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

Open the app at:

```text
http://127.0.0.1:8000/
```

## Usage Tutorial

1. Open the home page.
2. Create a new account from the signup panel.
3. Log in with the new account.
4. Select **Plan New Event & Forecast**.
5. Enter an event name, date, time, and location.
6. Click **HOW'S THE WEATHER?**.
7. Review the rain probability and recommendation.
8. Return to the dashboard and select **Review Past Plans** to see saved predictions.

## API Overview

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/` | GET | Render the frontend |
| `/api/signup/` | POST | Create a user |
| `/api/login/` | POST | Start a user session |
| `/api/logout/` | GET | End the user session |
| `/api/climatology/?city=Sakarya&month=7&day=15` | GET | Calculate historical rain probability |
| `/api/events/` | GET | List saved events for the logged-in user |
| `/api/events/` | POST | Save a forecasted event |

More details are available in [docs/API_REFERENCE.md](docs/API_REFERENCE.md).

## Deployment Notes

The project is ready for GitHub and local Django deployment. For hosted deployment, configure the environment variables in `.env.example`, set `DJANGO_DEBUG=False`, add your host to `DJANGO_ALLOWED_HOSTS`, run migrations, and serve static files through your hosting platform.

Detailed deployment steps are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Recommended GitHub Description

```text
Django event-planning app that uses NASA POWER climate data and OpenStreetMap geocoding to estimate rain risk for future events and save forecast history.
```

Recommended topics:

```text
django, nasa-power, weather, climate-data, event-planner, python, openstreetmap, hackathon
```

## Should This Project Include Visuals?

Yes. Because this is a web application, visuals will make the GitHub page much stronger. Add:

- A dashboard screenshot.
- A forecast result screenshot.
- A saved event history screenshot.
- A short GIF showing signup, forecast generation, and saved history.
- A simple architecture diagram showing Browser -> Django -> Geocoder -> NASA POWER -> SQLite.

Place images in `docs/assets/` and reference them from this README after they are created.

## License

No license file is currently included. Add one before reuse or public distribution if needed.
