from rest_framework import viewsets,status
from .models import Medicine,Supplier,Category,Invoice, InvoiceItem
from .serializers import MedicineSerializer,SupplierSerializer,StaffRegisterSerializer

from django.contrib.auth.models import User
from .serializers import SupplierRegisterSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from .serializers import CategorySerializer,InvoiceSerializer,InvoiceItemSerializer
from django.db import transaction

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer




class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

class AllSupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer    

class UserViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer    

class SupplierRegisterViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Supplier registered successfully"}, status=201)
        return Response(serializer.errors, status=400)

class CustomTokenObtainPairView(TokenObtainPairView):
    # You can customize this view if you want to add more data to the token
    pass

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def user_profile(request):
    user = request.user  # Get the current logged-in user
    profile_data = {
        "username": user.username,
        "email": user.email,
        "address": user.supplier.address if hasattr(user, 'supplier') else 'N/A',  # If Supplier model exists
    }
    return Response(profile_data)

class SupplierMedicineListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            supplier = Supplier.objects.get(user=request.user)  # Get the supplier linked to the logged-in user
            medicines = Medicine.objects.filter(supplier=supplier)  # Get medicines provided by this supplier
            serializer = MedicineSerializer(medicines, many=True)
            return Response(serializer.data)
        except Supplier.DoesNotExist:
            return Response({"error": "Supplier not found"}, status=404)
        
class CreateInvoiceView(APIView):
    def post(self, request):
        data = request.data
        try:
            with transaction.atomic():
                # Create invoice instance (but don't calculate total yet)
                invoice = Invoice.objects.create(
                    customer_name=data['customer_name'],
                    customer_contact=data.get('customer_contact', ''),
                    created_by=request.user if request.user.is_authenticated else None
                )

                total_amount = 0
                items = data['items']

                for item in items:
                    medicine = Medicine.objects.get(id=item['medicine_id'])
                    quantity = item['quantity']
                    unit_price = medicine.price

                    if medicine.stock_quantity < quantity:
                        return Response({"error": f"Insufficient stock for {medicine.name}"}, status=status.HTTP_400_BAD_REQUEST)

                    InvoiceItem.objects.create(
                        invoice=invoice,
                        medicine=medicine,
                        quantity=quantity,
                        unit_price=unit_price
                    )

                    medicine.stock_quantity -= quantity
                    medicine.save()

                    total_amount += quantity * unit_price

                # Update total amount now that items are added
                invoice.total_amount = total_amount
                invoice.save()

                print("Final invoice total in DB:", invoice.total_amount)

                # Serialize safely now (items exist, invoice is committed)
                serializer = InvoiceSerializer(invoice)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Error in view:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def list_invoices(request):
    invoices = Invoice.objects.all().order_by('-date')  # latest first
    serializer = InvoiceSerializer(invoices, many=True)
    return Response(serializer.data)


class StaffRegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = StaffRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Staff registered successfully"}, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def staff_profile(request):
    return Response({
        "username": request.user.username,
        "name": request.user.first_name  # Add this if you use first_name
    })
