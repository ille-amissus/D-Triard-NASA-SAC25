from django.db import models
from django.contrib.auth.models import User

class EventPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions')
    name = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    date = models.DateField()
    probability = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.city}) - {self.probability*100:.0f}%"
