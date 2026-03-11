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