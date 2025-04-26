# supplier/models.py
from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=255)
    address = models.TextField()

    def __str__(self):
        return self.name
