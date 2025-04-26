from django.db import models
from django.contrib.auth.models import User

# Category model to store medicine categories
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Medicine(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    supplier = models.ForeignKey('Supplier', on_delete=models.CASCADE)
    
    # Updated category field to ForeignKey referencing Category model
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    stock_quantity = models.IntegerField()
    
    # Updated dose field to decimal with a default value
    dose = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # Set default value to 0.0
    
    # Updated dose_measurement field with more options
    DOSE_UNITS = [
        ('mg', 'mg'),
        ('g', 'g'),
        ('mcg', 'mcg'),
        ('mL', 'mL'),
        ('L', 'L'),
        ('IU', 'IU'),
        ('U', 'U'),
        ('tsp', 'tsp'),
        ('tbsp', 'tbsp'),
        ('gtt', 'gtt'),
        ('puff', 'puff'),
    ]
    dose_measurement = models.CharField(max_length=10, choices=DOSE_UNITS, default='mg')

    def __str__(self):
        return self.name

class Supplier(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField()
    contact_number = models.CharField(max_length=20)
    username = models.CharField(max_length=256, null=True, blank=True)
    email = models.EmailField(max_length=256, null=True, blank=True)
    gst = models.CharField(max_length=20, null=True, blank=True)  # 👈 New GST field

    def save(self, *args, **kwargs):
        self.username = self.user.username
        self.email = self.user.email
        super(Supplier, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username
    
class Invoice(models.Model):
    invoice_number = models.CharField(max_length=10, unique=True, blank=True)  # e.g., INV-001
    customer_name = models.CharField(max_length=255)
    customer_contact = models.CharField(max_length=20, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # New field

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            last_invoice = Invoice.objects.order_by('-id').first()
            if last_invoice and last_invoice.invoice_number.startswith('INV-'):
                last_number = int(last_invoice.invoice_number.split('-')[1])
                new_number = last_number + 1
            else:
                new_number = 1
            self.invoice_number = f"INV-{new_number:03d}"

        super().save(*args, **kwargs)  # ✅ Always call super().save()

    def __str__(self):
        return f"{self.invoice_number} - {self.customer_name}"

# Invoice Item model to store medicines in each invoice
class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at the time of sale

    def __str__(self):
        return f"{self.medicine.name} - {self.quantity}"