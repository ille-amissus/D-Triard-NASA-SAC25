from django.urls import path
from .views import climatology_view, home
from . import views 

urlpatterns = [
    path("", home, name="home"),  # 👈 root URL shows index.html
    path("api/climatology/", climatology_view, name="climatology"),
        path('api/signup/', views.signup_view, name='signup'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
     path('api/events/', views.events_view, name='events'),  # NEW
]
