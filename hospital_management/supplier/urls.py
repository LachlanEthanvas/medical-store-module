from django.urls import path
from .views import SupplierListCreateView, SupplierDetailView

urlpatterns = [
    path('api/suppliers/', SupplierListCreateView.as_view(), name='supplier-list-create'),
    path('api/suppliers/<int:pk>/', SupplierDetailView.as_view(), name='supplier-detail'),
]
