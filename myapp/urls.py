from django.urls import path
from .views import climatology_view

urlpatterns = [
    path("api/climatology/", climatology_view, name="climatology"),
]
