from .services.mapping import geocode_city
from .services.power_api import get_climatology
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def events_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # save event here
        return JsonResponse({"status": "ok", "message": "Event saved!"})

def home(request):
    return render(request, "myapp/index.html")

def climatology_view(request):
    city = request.GET.get("city")
    month = int(request.GET.get("month", 7))
    day = int(request.GET.get("day", 15))

    if not city:
        return JsonResponse({"error": "City name is required"}, status=400)

    lat, lon = geocode_city(city)
    if not lat or not lon:
        return JsonResponse({"error": f"City '{city}' not found"}, status=404)

    data = get_climatology(lat, lon, month, day)
    data["city"] = city
    return JsonResponse(data)
 

def events_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            event_name = data.get("name")
            event_details = data.get("details", "")
            date = data.get("date")
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            probability = data.get("probability")
            user_id = data.get("user_id", "guest")

            return JsonResponse({
                "status": "success",
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

    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)