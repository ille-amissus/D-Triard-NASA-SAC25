from django.urls import path
from .views import climatology_view, home
from . import views 

urlpatterns = [
    path("", home, name="home"),  # 👈 root URL shows index.html
    path("api/climatology/", climatology_view, name="climatology"),
     path('events/', views.events_view, name='events'),  # NEW
]
