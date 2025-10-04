from django.http import JsonResponse
from .services.mapping import geocode_city
from .services.power_api import get_climatology

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
