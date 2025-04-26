from rest_framework import generics
from .models import Supplier
from .serializers import SupplierSerializer

# Create (POST) and List (GET all)
class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

# Retrieve (GET one), Update (PUT/PATCH), Delete (DELETE)
class SupplierDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
