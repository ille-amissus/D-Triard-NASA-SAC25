# Project Tutorial

This guide explains how to run and use D-Triard Pro from a fresh clone.

## 1. Install The Project

```bash
git clone https://github.com/ille-amissus/D-Triard-NASA-SAC25.git
cd D-Triard-NASA-SAC25
python -m venv .venv
```

Activate the virtual environment.

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## 2. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
copy .env.example .env
```

For local development, the default values are enough. For production, set:

```text
DJANGO_SECRET_KEY=<long-random-secret>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<your-domain>,127.0.0.1
GEOCODER_USER_AGENT=<project-name-or-contact>
```

## 3. Prepare The Database

```bash
python manage.py migrate
```

Optional admin account:

```bash
python manage.py createsuperuser
```

## 4. Run The Server

```bash
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

## 5. Use The Application

1. Create a user account.
2. Log in.
3. Choose **Plan New Event & Forecast**.
4. Enter an event name, date, time, and city/location.
5. Submit the form.
6. Review the calculated rain probability.
7. Use **Review Past Plans** to view saved event forecasts.

## 6. Understand The Prediction

The backend does not call a black-box model. It uses a transparent historical scoring method:

- Looks up the city coordinates.
- Fetches historical daily NASA POWER climate records.
- Filters data for the selected month and day.
- Calculates average precipitation, temperature, humidity, and wind.
- Builds a weighted rain probability from historical rain frequency and weather factors.

This makes the result explainable and suitable for a student or hackathon presentation.
