from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "mobile"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    mobile = serializers.CharField(source="user.mobile", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "student_id",
            "full_name",
            "username",
            "email",
            "mobile",
            "is_active",
            "created_at",
            "updated_at",
        ]


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    author_name = serializers.CharField(source="author.name", read_only=True)
    cover_image = serializers.SerializerMethodField()

    def get_cover_image(self, obj):
        if not obj.cover_image:
            return None
        try:
            return obj.cover_image.url
        except Exception:
            return str(obj.cover_image)

    class Meta:
        model = Book
        fields = "__all__"


class IssuedBookSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_isbn = serializers.CharField(source="book.isbn", read_only=True)
    book_cover_image = serializers.SerializerMethodField()

    def get_book_cover_image(self, obj):
        if not obj.book.cover_image:
            return None
        try:
            return obj.book.cover_image.url
        except Exception:
            return str(obj.book.cover_image)

    class Meta:
        model = IssuedBook
        fields = "__all__"