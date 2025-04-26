from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, AllSupplierViewSet, SupplierRegisterViewSet,user_profile, SupplierMedicineListView, CategoryViewSet,CreateInvoiceView,list_invoices
from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'medicines', MedicineViewSet)
router.register(r'suppliers', AllSupplierViewSet)
router.register(r'supplier-register', SupplierRegisterViewSet, basename="supplier-register")
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/profile/', user_profile, name='user_profile'),
    path('api/supplier/medicines/', SupplierMedicineListView.as_view(), name='supplier_medicines'),
    path('api/invoices/create/', CreateInvoiceView.as_view(), name='create-invoice'),
     path('api/invoices/', list_invoices, name='invoice-list'),
]
