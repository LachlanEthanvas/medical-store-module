from rest_framework import serializers
from .models import Medicine,Supplier, Invoice, InvoiceItem
from django.contrib.auth.models import User

from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class SupplierRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Supplier
        fields = ['username', 'email', 'password', 'address', 'contact_number', 'gst']  # 👈 Added 'gst'

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create_user(username=username, email=email, password=password)
        supplier = Supplier.objects.create(user=user, **validated_data)
        return supplier



class InvoiceItemSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer()

    class Meta:
        model = InvoiceItem
        fields = ['medicine', 'quantity', 'unit_price']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'customer_contact', 'date', 'total_amount', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        total_amount = validated_data.get('total_amount', 0)

        # Create the invoice with total_amount
        invoice = Invoice.objects.create(total_amount=total_amount, **validated_data)

        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)

        return invoice
