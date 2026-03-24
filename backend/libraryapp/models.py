from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    mobile = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.username


class Category(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Author(TimeStampedModel):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Student(TimeStampedModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    student_id = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student_id}-{self.full_name}"


class Book(TimeStampedModel):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    author = models.ForeignKey(Author, on_delete=models.PROTECT)
    isbn = models.CharField(max_length=25, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    cover_image = CloudinaryField('image', folder='library/books/', blank=True, null=True)

    quantity = models.PositiveIntegerField(default=0)
    available_quantity = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.isbn})"


class IssuedBook(TimeStampedModel):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="issued_records")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="borrowed_books")

    issued_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()

    returned_at = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    fine = models.PositiveIntegerField(default=0)
    remark = models.TextField(blank=True)

    def __str__(self):
        return f"{self.book.title} - {self.student.student_id}"