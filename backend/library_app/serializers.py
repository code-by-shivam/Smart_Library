from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=["id","name","is_active","created_at","updated_at"]

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Author
        fields=["id","name","created_at","updated_at"]

class BookSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source="category.name",read_only=True)
    author_name=serializers.CharField(source="author.name",read_only=True)
    class Meta:
        model=Book
        fields=["id","title","category","category_name","author","author_name","isbn","price","quantity","cover_image","is_issued","created_at","updated_at"]



class BookListSerializer(serializers.ModelSerializer):
    category_name=serializers.CharField(source="category.name",read_only=True)
    author_name=serializers.CharField(source="author.name",read_only=True)
    available_quantity=serializers.SerializerMethodField()
    class Meta:
        model=Book
        fields=["id","title","author","category","category_name","author_name","isbn","price","quantity","cover_image","is_issued","created_at","updated_at","available_quantity"]
    def get_available_quantity(self,obj):
        issued_count=obj.issued_records.filter(is_returned=False).count()
        available_quantity=obj.quantity - issued_count
        return available_quantity if available_quantity>0 else 0      