from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=["id","name","is_active","created_at","updated_at"]
        