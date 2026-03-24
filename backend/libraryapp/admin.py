from django.contrib import admin
from .models import User, Category, Author, Student, Book, IssuedBook


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "email", "mobile", "is_staff", "is_superuser"]
    search_fields = ["username", "email"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "is_active", "created_at"]
    search_fields = ["name"]


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "is_active", "created_at"]
    search_fields = ["name"]


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ["id", "student_id", "full_name", "user", "is_active"]
    search_fields = ["student_id", "full_name"]


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "author", "category", "quantity", "available_quantity"]
    search_fields = ["title", "isbn"]


@admin.register(IssuedBook)
class IssuedBookAdmin(admin.ModelAdmin):
    list_display = ["id", "book", "student", "issued_at", "due_date", "is_returned", "fine"]
    search_fields = ["book__title", "student__student_id"]