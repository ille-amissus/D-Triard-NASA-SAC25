from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .services.power_api import get_climatology


# -------------------------
# HOME PAGE (frontend)
# -------------------------
def home(request):
    return render(request, "myapp/index.html")


# -------------------------
# CLIMATOLOGY ENDPOINT
# Example call: /api/climatology/?city=cairo&month=1&day=15
# -------------------------
def climatology_view(request):
    city = request.GET.get("city")
    month = int(request.GET.get("month", 7))
    day = int(request.GET.get("day", 15))

    if not city:
        return JsonResponse({"error": "City name is required"}, status=400)

    try:
        data = get_climatology(city, month, day)
        data["city"] = city
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# -------------------------
# EVENT SAVE ENDPOINT
# Example: POST /api/events/
# -------------------------
@csrf_exempt
def events_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract event info from frontend payload
            event_name = data.get("name")
            event_details = data.get("details", "")
            date = data.get("date")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            probability = data.get("probability")
            user_id = data.get("user_id", "guest")

            # (Optionally: you could save to DB here later)
            # For now we just echo back the data
            return JsonResponse({
                "status": "success",
                "message": f"Event '{event_name}' saved successfully!",
                "event": {
                    "user_id": user_id,
                    "name": event_name,
                    "details": event_details,
                    "date": date,
                    "latitude": latitude,
                    "longitude": longitude,
                    "probability": probability
                }
            })

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)

    return JsonResponse({"status": "error", "message": "Only POST method allowed"}, status=405)
