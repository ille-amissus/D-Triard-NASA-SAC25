import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse


class ClimatologyApiTests(TestCase):
    def test_city_is_required(self):
        response = self.client.get(reverse("climatology"))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["error"], "City name is required")

    def test_month_and_day_must_be_valid(self):
        response = self.client.get(
            reverse("climatology"),
            {"city": "Sakarya", "month": "2", "day": "31"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("valid date", response.json()["error"])


class EventApiTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="planner", password="secret123")

    def test_login_is_required_to_save_events(self):
        response = self.client.post(
            reverse("events"),
            data=json.dumps({
                "name": "Campus Picnic",
                "city": "Sakarya",
                "date": "2026-08-12",
                "probability": 0.2,
            }),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 403)

    def test_authenticated_user_can_save_and_list_events(self):
        self.client.login(username="planner", password="secret123")

        save_response = self.client.post(
            reverse("events"),
            data=json.dumps({
                "name": "Campus Picnic",
                "details": "Outdoor student event",
                "city": "Sakarya",
                "date": "2026-08-12",
                "probability": 0.2,
            }),
            content_type="application/json",
        )

        self.assertEqual(save_response.status_code, 200)
        self.assertEqual(save_response.json()["status"], "success")

        list_response = self.client.get(reverse("events"))

        self.assertEqual(list_response.status_code, 200)
        events = list_response.json()["events"]
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["name"], "Campus Picnic")
