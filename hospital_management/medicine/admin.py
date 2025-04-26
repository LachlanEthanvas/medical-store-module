# admin.py
from django.contrib import admin
from .models import Medicine,Supplier,Category,Invoice, InvoiceItem

class MedicineAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = ('name', 'brand', 'category', 'price', 'expiry_date', 'stock_quantity', 'dose', 'dose_measurement')
    
    # Add search functionality to search by name, brand, or category
    search_fields = ('name', 'brand', 'category')
    
    # Allow filtering by category and stock quantity
    list_filter = ('category', 'stock_quantity')
    
    # Add ordering to show the medicines ordered by name
    ordering = ('name',)

# Register the model with the custom admin
admin.site.register(Medicine, MedicineAdmin)
admin.site.register(Supplier)
admin.site.register(Category)

# Inline class for InvoiceItem
class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1  # Number of empty rows to display for adding new items
    fields = ('medicine', 'quantity', 'unit_price')  # Fields to display
    readonly_fields = ('unit_price',)  # Unit price could be read-only if pre-filled from Medicine

    # Optional: Auto-populate unit_price from Medicine when adding via admin
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'medicine':
            kwargs['queryset'] = Medicine.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

# Admin class for Invoice
@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_contact', 'date', 'created_by', 'display_total_amount')  # Use display method for label
    list_filter = ('date', 'created_by')
    search_fields = ('customer_name', 'customer_contact', 'id')
    inlines = [InvoiceItemInline]

    # Just display the stored total_amount from the model
    def display_total_amount(self, obj):
        return f"{obj.total_amount:.2f}"  # formatted to 2 decimal places

    display_total_amount.short_description = 'Total Amount (₹)'  # Custom label