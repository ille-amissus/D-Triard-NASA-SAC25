# Deployment Guide

This guide covers GitHub publishing and a practical hosted Django deployment checklist.

## GitHub Deployment

Use these commands from the project root:

```bash
git status
git add .
git commit -m "docs: add project documentation"
git push origin main
```

The remote repository is:

```text
https://github.com/ille-amissus/D-Triard-NASA-SAC25.git
```

## Required Environment Variables

For local development:

```text
DJANGO_SECRET_KEY=replace-this-with-a-long-random-secret
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
GEOCODER_USER_AGENT=D-Triard-NASA-SAC25/1.0
```

For production:

```text
DJANGO_SECRET_KEY=<long-random-production-secret>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<your-hostname>
DJANGO_CSRF_TRUSTED_ORIGINS=https://<your-hostname>
GEOCODER_USER_AGENT=<your-project-name-or-contact>
```

## Local Release Check

Run:

```bash
python manage.py check
python manage.py test
python -m compileall NasaRain myapp manage.py
```

## Generic Hosting Steps

1. Create a Python web service on your hosting provider.
2. Connect the GitHub repository.
3. Set the environment variables listed above.
4. Install dependencies with:

```bash
pip install -r requirements.txt
```

5. Run migrations:

```bash
python manage.py migrate
```

6. Collect static files if the platform needs a static directory:

```bash
python manage.py collectstatic --noinput
```

7. Start the app with a Django-compatible WSGI server.

Example command after adding a production server such as Gunicorn:

```bash
gunicorn NasaRain.wsgi:application
```

## Production Notes

- Keep `DJANGO_DEBUG=False`.
- Do not commit `.env` or production database files.
- Use a managed database for real production data.
- Add a production WSGI server dependency, such as Gunicorn, before deploying to most Linux hosts.
- Respect Nominatim usage rules by setting a descriptive `GEOCODER_USER_AGENT`.
