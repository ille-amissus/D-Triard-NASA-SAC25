from datetime import date as date_type
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import EventPrediction
from .services.power_api import get_climatology


def home(request):
    return render(request, "myapp/index.html")


def _json_body(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return None


def climatology_view(request):
    city = (request.GET.get("city") or "").strip()

    if not city:
        return JsonResponse({"error": "City name is required"}, status=400)

    try:
        month = int(request.GET.get("month", 7))
        day = int(request.GET.get("day", 15))
        date_type(2000, month, day)
    except (TypeError, ValueError):
        return JsonResponse({"error": "Month and day must form a valid date"}, status=400)

    data = get_climatology(city, month, day)

    if "error" in data:
        return JsonResponse({"error": data["error"]}, status=502)

    return JsonResponse(data)


@csrf_exempt
def events_view(request):
    user = request.user if request.user.is_authenticated else None

    if request.method == "POST":
        try:
            if not user:
                return JsonResponse({"error": "Login required to save events."}, status=403)

            data = _json_body(request)
            if data is None:
                return JsonResponse({"error": "Invalid JSON body."}, status=400)

            event_name = data.get("name")
            event_details = data.get("details", "")
            event_date = data.get("date")
            city = data.get("city")
            probability = data.get("probability", 0)

            if not all([event_name, city, event_date]):
                return JsonResponse({"error": "Missing required fields."}, status=400)

            event = EventPrediction.objects.create(
                user=user,
                name=event_name,
                details=event_details,
                city=city,
                date=event_date,
                probability=probability,
            )

            return JsonResponse({
                "status": "success",
                "message": f"Event '{event.name}' saved successfully!",
                "event_id": event.id,
            })

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    if request.method == "GET":
        if not user:
            return JsonResponse({"error": "Not logged in"}, status=403)

        events = list(user.predictions.values(
            "id", "name", "details", "city", "date", "probability", "created_at"
        ))
        return JsonResponse({"events": events})

    return JsonResponse({"error": "Only GET and POST allowed"}, status=405)


@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        data = _json_body(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Username and password required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({"message": "Signup successful!", "user_id": user.id})

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        data = _json_body(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body."}, status=400)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Missing username or password"}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is None:
            if not User.objects.filter(username=username).exists():
                return JsonResponse({"error": "User not found. Please sign up first."}, status=404)
            return JsonResponse({"error": "Invalid password"}, status=401)

        login(request, user)
        return JsonResponse({
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})
