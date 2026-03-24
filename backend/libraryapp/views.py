from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .models import *
from .serializers import *
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.db.models import Q, Sum
from .utils import CustomPagination
from django.contrib.auth.hashers import check_password, make_password
from datetime import datetime, time

User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def Admin_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({
            "success": False,
            "message": "Username and password required"
        }, status=400)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({
            "success": False,
            "message": "Invalid credentials"
        }, status=401)

    if not user.is_superuser:
        return Response({
            "success": False,
            "message": "Not an admin user"
        }, status=403)

    if not user.is_active:
        return Response({
            "success": False,
            "message": "Account disabled"
        }, status=403)

    refresh = RefreshToken.for_user(user)

    return Response({
        "success": True,
        "message": "Login successful 👍",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=200)
            

    





@api_view(["POST"])
@permission_classes([IsAdminUser])
def add_category(request):
    name = request.data.get("name")
    status = request.data.get("status", "1")

    if not name:
        return Response(
            {
                "success": False,
                "message": "Category name is required"
            },
            status=400
        )

    if Category.objects.filter(name__iexact=name).exists():
        return Response(
            {
                "success": False,
                "message": "Category already exists"
            },
            status=400
        )

    is_active = True if str(status) == "1" else False

    category = Category.objects.create(
        name=name,
        is_active=is_active
    )

    serializer = CategorySerializer(category)

    return Response(
        {
            "success": True,
            "message": "Category created successfully 👍",
            "category": serializer.data,
        },
        status=201
    )



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_categories(request):
    categories = Category.objects.all().order_by("-id")

    # SEARCH
    search = request.GET.get("search")
    if search:
        categories = categories.filter(name__icontains=search)

    #  FILTER (active / inactive)
    status = request.GET.get("status")

    if status == "active":
        categories = categories.filter(is_active=True)
    elif status == "inactive":
        categories = categories.filter(is_active=False)

    #  PAGINATION
    paginator = CustomPagination()
    paginated_data = paginator.paginate_queryset(categories, request)

    serializer = CategorySerializer(paginated_data, many=True)

    return paginator.get_paginated_response({
        "success": True,
        "categories": serializer.data
    })


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_category(request, id):
    category = get_object_or_404(Category, id=id)

    name = request.data.get("name")
    status = request.data.get("status", "1")

    if not name:
        return Response(
            {
                "success": False,
                "message": "Category name is required"
            },
            status=400
        )

    if Category.objects.filter(name__iexact=name).exclude(id=id).exists():
        return Response(
            {
                "success": False,
                "message": "Category with this name already exists"
            },
            status=400
        )

    is_active = True if str(status) == "1" else False

    category.name = name
    category.is_active = is_active
    category.save()

    serializer = CategorySerializer(category)

    return Response(
        {
            "success": True,
            "message": "Category updated successfully 👍",
            "category": serializer.data,
        },
        status=200
    )


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_category(request, id):
    category = get_object_or_404(Category, id=id)

    if Book.objects.filter(category=category).exists():
        return Response(
            {
                "success": False,
                "message": "Cannot delete category. Books are linked to it."
            },
            status=400
        )

    category.delete()

    return Response(
        {
            "success": True,
            "message": "Category deleted successfully 👍",
        },
        status=200
    )



@api_view(["POST"])
@permission_classes([IsAdminUser])
def add_author(request):
    name = request.data.get("name")
    if not name:
        return Response(
            {
                "success": False,
                "message": "Author name is required"
            },
            status=400
        )

    if Author.objects.filter(name__iexact=name).exists():
        return Response(
            {
                "success": False,
                "message": "Author already exists"
            },
            status=400
        )

    author = Author.objects.create(name=name)
    serializer = AuthorSerializer(author)
    return Response(
        {
            "success": True,
            "message": "Author created successfully 👍",
            "author": serializer.data,
        },
        status=201
    )




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_authors(request):
    authors = Author.objects.all().order_by("-id")

    #  SEARCH
    search = request.GET.get("search")
    if search:
        authors = authors.filter(name__icontains=search)

    #  PAGINATION
    paginator = CustomPagination()
    paginated_data = paginator.paginate_queryset(authors, request)

    serializer = AuthorSerializer(paginated_data, many=True)

    return paginator.get_paginated_response({
        "success": True,
        "authors": serializer.data
    })


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_author(request, id):
    author = get_object_or_404(Author, id=id)
    name = request.data.get("name")

    if not name:
        return Response(
            {
                "success": False,
                "message": "Author name is required"
            },
            status=400
        )

    if Author.objects.filter(name__iexact=name).exclude(id=id).exists():
        return Response(
            {
                "success": False,
                "message": "Author already exists"
            },
            status=400
        )

    author.name = name
    author.save()

    serializer = AuthorSerializer(author)

    return Response(
        {
            "success": True,
            "message": "Author updated successfully 👍",
            "author": serializer.data,
        },
        status=200
    )


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_author(request, id):
    author = get_object_or_404(Author, id=id)

    if Book.objects.filter(author=author).exists():
        return Response(
            {
                "success": False,
                "message": "Cannot delete author. Books are linked to it."
            },
            status=400
        )

    author.delete()

    return Response(
        {
            "success": True,
            "message": "Author deleted successfully 👍",
        },
        status=200
    )

@api_view(["POST"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def add_book(request):
    title = request.data.get("title")
    author_id = request.data.get("author_id")
    category_id = request.data.get("category_id")
    isbn = request.data.get("isbn")
    price = request.data.get("price")
    quantity = request.data.get("quantity")
    cover_image = request.FILES.get("cover_image")

    if not all([title, author_id, category_id, isbn, price, quantity]):
        return Response({"success": False, "message": "All fields are required"}, status=400)

    if Book.objects.filter(isbn=isbn).exists():
        return Response({"success": False, "message": "ISBN already exists"}, status=400)

    author = get_object_or_404(Author, id=author_id)
    category = get_object_or_404(Category, id=category_id)

    book = Book.objects.create(
        title=title,
        author=author,
        category=category,
        isbn=isbn,
        price=price,
        quantity=quantity,
        available_quantity=quantity,
        cover_image=cover_image
    )

    return Response({
        "success": True,
        "message": "Book added successfully 👍",
        "book": BookSerializer(book).data
    }, status=201)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_books(request):
    user = request.user

    books = Book.objects.all().order_by("-id")

    search = request.GET.get("search")
    if search:
        books = books.filter(
            Q(title__icontains=search) |
            Q(isbn__icontains=search)
        )

    category = request.GET.get("category")
    if category:
        books = books.filter(category__id=category)

    author = request.GET.get("author")
    if author:
        books = books.filter(author__id=author)

    if not user.is_staff:
        books = books.filter(available_quantity__gt=0)


    paginator = CustomPagination()
    paginated_books = paginator.paginate_queryset(books, request)

    serializer = BookSerializer(paginated_books, many=True)

    return paginator.get_paginated_response({
        "success": True,
        "books": serializer.data
    })


@api_view(["PUT"])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def update_book(request, id):
    book = get_object_or_404(Book, id=id)

    title = request.data.get("title")
    author_id = request.data.get("author")
    category_id = request.data.get("category")
    price = request.data.get("price")
    quantity = request.data.get("quantity")
    cover_image = request.FILES.get("cover_image")

    if not title:
        return Response({"success": False, "message": "Title required"}, status=400)

    author = get_object_or_404(Author, id=author_id)
    category = get_object_or_404(Category, id=category_id)

    book.title = title
    book.author = author
    book.category = category
    book.price = price

    if quantity:
        diff = int(quantity) - book.quantity
        book.quantity = quantity
        book.available_quantity += diff

    if cover_image:
        book.cover_image = cover_image

    book.save()

    return Response({
        "success": True,
        "message": "Book updated successfully 👍",
        "book": BookSerializer(book).data
    }, status=200)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)

    if book.issued_records.filter(is_returned=False).exists():
        return Response({
            "success": False,
            "message": "Cannot delete. Book is currently issued"
        }, status=400)

    book.delete()

    return Response({
        "success": True,
        "message": "Book deleted successfully 👍",
    }, status=204)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if not all([current_password, new_password, confirm_password]):
        return Response(
            {"success": False, "message": "All fields are required"},
            status=400
        )

    if new_password != confirm_password:
        return Response(
            {"success": False, "message": "Passwords do not match"},
            status=400
        )

    if len(new_password) < 6:
        return Response(
            {"success": False, "message": "Password must be at least 6 characters"},
            status=400
        )

    if not user.check_password(current_password):
        return Response(
            {"success": False, "message": "Current password is incorrect"},
            status=400
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"success": True, "message": "Password changed successfully 👍"},
        status=200
    )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    return Response(
        {
            "success": True,
            "message": "Logged out successfully 👍"
        },
        status=200
    )






@api_view(["POST"])
@permission_classes([AllowAny])
def student_signup(request):
    full_name = request.data.get("full_name")
    mobile = request.data.get("mobile")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm_password = request.data.get("confirmPassword")

    if not all([full_name, mobile, email, password, confirm_password]):
        return Response({"success": False, "message": "All fields are required"}, status=400)

    if password != confirm_password:
        return Response({"success": False, "message": "Passwords do not match"}, status=400)

    if len(password) < 6:
        return Response({"success": False, "message": "Password must be at least 6 characters"}, status=400)

    if not mobile.isdigit() or len(mobile) < 10:
        return Response({"success": False, "message": "Invalid mobile number"}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({"success": False, "message": "User already exists"}, status=400)

    last_student = Student.objects.all().order_by("-id").first()
    if last_student and last_student.student_id.isdigit():
        new_id_int = int(last_student.student_id) + 1
    else:
        new_id_int = 1001

    student_id = str(new_id_int)

    user = User.objects.create(
        username=email,
        email=email,
        mobile=mobile,
        password=make_password(password)
    )

    student = Student.objects.create(
        user=user,
        student_id=student_id,
        full_name=full_name,
        is_active=True
    )

    return Response(
        {
            "success": True,
            "message": "User registered successfully 👍",
            "student_id": student.student_id,
            "full_name": student.full_name
        },
        status=201
    )



@api_view(["POST"])
@permission_classes([AllowAny])
def student_login(request):
    login_id = request.data.get("login_id")
    password = request.data.get("password")

    if not login_id or not password:
        return Response(
            {"success": False, "message": "Login ID and password required"},
            status=400
        )

   
    try:
        if "@" in login_id:
            student = Student.objects.get(user__email=login_id)
        else:
            student = Student.objects.get(student_id=login_id)
    except Student.DoesNotExist:
        return Response(
            {"success": False, "message": "Invalid login ID"},
            status=401
        )

    user = student.user

    user = authenticate(username=user.username, password=password)

    if user is None:
        return Response(
            {"success": False, "message": "Invalid password"},
            status=401
        )

    if not student.is_active:
        return Response(
            {"success": False, "message": "Account inactive"},
            status=403
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "success": True,
            "message": "Login successful 👍",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "full_name": student.full_name,
            "student_id": student.student_id,
        },
        status=200
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_stats(request):
    student = request.user.student_profile

    total_books = Book.objects.count()
    total_issued = IssuedBook.objects.filter(student=student).count()
    pending = IssuedBook.objects.filter(student=student, is_returned=False).count()

    return Response({
        "success": True,
        "stats": {
            "total_books": total_books,
            "total_issued": total_issued,
            "pending_returns": pending,
        }
    }, status=200)

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def student_profile(request):
    student = request.user.student_profile
    user = request.user

    if request.method == "GET":
        return Response({
            "success": True,
            "student": StudentSerializer(student).data
        })

    full_name = request.data.get("full_name", student.full_name)
    mobile = request.data.get("mobile", user.mobile)

    if not mobile.isdigit() or len(mobile) < 10:
        return Response({"success": False, "message": "Invalid mobile"}, status=400)

    student.full_name = full_name
    student.save()

    user.mobile = mobile
    user.save()

    return Response({
        "success": True,
        "message": "Profile updated successfully 👍",
        "student": StudentSerializer(student).data
    })


@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_registered_students(request):
    students = Student.objects.select_related("user").order_by("-id")

    # SEARCH (name, email, student_id)
    search = request.GET.get("search")
    if search:
        students = students.filter(
            Q(full_name__icontains=search) |
            Q(student_id__icontains=search) |
            Q(user__email__icontains=search)
        )

    #  FILTER (status)
    status = request.GET.get("status")

    if status == "active":
        students = students.filter(is_active=True)

    elif status == "blocked":
        students = students.filter(is_active=False)

    #  PAGINATION
    paginator = CustomPagination()
    paginated_students = paginator.paginate_queryset(students, request)

    serializer = StudentSerializer(paginated_students, many=True)

    return paginator.get_paginated_response({
        "success": True,
        "students": serializer.data
    })



@api_view(["PUT"])
@permission_classes([IsAdminUser])
def block_student(request, id):
    student = get_object_or_404(Student, student_id=id)

    student.is_active = False
    student.save()

    student.user.is_active = False
    student.user.save()

    return Response({
        "success": True,
        "message": "Student blocked successfully 🚫",
        "student": StudentSerializer(student).data
    }, status=200)

@api_view(["PUT"])
@permission_classes([IsAdminUser])
def unblock_student(request, id):
    student = get_object_or_404(Student, student_id=id)

    student.is_active = True
    student.save()

    student.user.is_active = True
    student.user.save()

    return Response({
        "success": True,
        "message": "Student unblocked successfully 👍",
        "student": StudentSerializer(student).data
    }, status=200)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def student_by_id(request, student_id):
    
    if not student_id:
        return Response({
            "success": False,
            "message": "student_id is required"
        }, status=400)

    try:
        student = Student.objects.get(student_id=student_id)

        return Response({
            "success": True,
            "student": StudentSerializer(student).data
        }, status=200)

    except Student.DoesNotExist:
        return Response({
            "success": False,
            "message": "Student not found"
        }, status=404)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def book_lookup(request):
    query = request.query_params.get("q") or request.query_params.get("query")

    if not query:
        return Response({
            "success": False,
            "message": "q is required"
        }, status=400)

    book = Book.objects.filter(isbn__iexact=query).first() \
        or Book.objects.filter(title__icontains=query).first()

    if not book:
        return Response({"success": False, "message": "Book not found"}, status=404)

    return Response({
        "success": True,
        "book": BookSerializer(book).data
    })

@api_view(["POST"])
@permission_classes([IsAdminUser])
def issue_book(request):
    student_id = request.data.get("student_id")
    book_id = request.data.get("book_id")
    remark = request.data.get("remark", "")
    due_date_value = request.data.get("due_date")

    student = get_object_or_404(Student, student_id=student_id)
    book = get_object_or_404(Book, id=book_id)

    if not student.is_active:
        return Response({"success": False, "message": "Student blocked"}, status=403)

    if book.available_quantity <= 0:
        return Response({"success": False, "message": "Book not available"}, status=400)

    due_date = parse_date(due_date_value)
    if due_date is None:
        return Response({"success": False, "message": "Valid due date is required"}, status=400)

    IssuedBook.objects.create(
        student=student,
        book=book,
        remark=remark,
        fine=0,
        is_returned=False,
        due_date=timezone.make_aware(datetime.combine(due_date, time(23, 59, 59)))
    )

    book.available_quantity -= 1
    book.save()

    return Response({
        "success": True,
        "message": "Book issued successfully 👍"
    }, status=201)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_issued_books(request):
    user = request.user

    issued_books = IssuedBook.objects.select_related("student", "book").order_by("-id")

    # Student → only their data
    if not user.is_staff:
        issued_books = issued_books.filter(student=user.student_profile)

    # SEARCH (book title or student name)
    search = request.GET.get("search")
    if search:
        issued_books = issued_books.filter(
            Q(book__title__icontains=search) |
            Q(student__full_name__icontains=search)
        )

    #  FILTER (status)
    status = request.GET.get("status")

    if status == "pending":
        issued_books = issued_books.filter(is_returned=False)

    elif status == "returned":
        issued_books = issued_books.filter(is_returned=True)


    paginator = CustomPagination()
    paginated_data = paginator.paginate_queryset(issued_books, request)

    serializer = IssuedBookSerializer(paginated_data, many=True)

    return paginator.get_paginated_response({
        "success": True,
        "issued_books": serializer.data
    })


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_issued_book_details(request, id):
    issued_book = get_object_or_404(IssuedBook, id=id)

    serializer = IssuedBookSerializer(issued_book)

    return Response(
        {
            "success": True,
            "issued_book": serializer.data
        },
        status=200
    )

@api_view(["POST"])
@permission_classes([IsAdminUser])
def return_book(request, id):
    issued_book = get_object_or_404(IssuedBook, id=id)

    if issued_book.is_returned:
        return Response({"success": False, "message": "Already returned"}, status=400)

    issued_book.is_returned = True
    issued_book.returned_at = timezone.now()

    # Optional fine
    fine = request.data.get("fine", 0)
    issued_book.fine = int(fine)

    issued_book.save()

    book = issued_book.book
    book.available_quantity += 1
    book.save()

    return Response({
        "success": True,
        "message": "Book returned successfully 👍"
    })

@api_view(["GET"])
def student_history(request, student_id):
    student=get_object_or_404(Student, student_id=student_id)
    issued_books = IssuedBook.objects.filter(student=student).select_related("student","book").order_by("-id")
    issued_serializer = IssuedBookSerializer(issued_books, many=True)
    student_serializer = StudentSerializer(student)

    return Response(
        {
            "success":True,
            "student":student_serializer.data,
            "issued_books":issued_serializer.data
        },
        status=200
    )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Student, Book, Category, Author, IssuedBook


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    data = {
        "total_students": Student.objects.count(),
        "active_students": Student.objects.filter(is_active=True).count(),
        "blocked_students": Student.objects.filter(is_active=False).count(),

        "total_books": Book.objects.count(),
        "available_books": Book.objects.filter(available_quantity__gt=0).count(),
        "out_of_stock_books": Book.objects.filter(available_quantity=0).count(),

        "total_categories": Category.objects.count(),
        "total_authors": Author.objects.count(),

        "total_issued": IssuedBook.objects.count(),
        "currently_issued": IssuedBook.objects.filter(is_returned=False).count(),
        "returned_books": IssuedBook.objects.filter(is_returned=True).count(),
    }

    return Response(
        {
            "success": True,
            "stats": data
        },
        status=200
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_issue_history(request):
    student = request.user.student_profile

    issued_books = IssuedBook.objects.filter(student=student)\
        .select_related("book", "student")\
        .order_by("-id")

    total_issued = issued_books.count()
    returned_count = issued_books.filter(is_returned=True).count()
    pending_count = issued_books.filter(is_returned=False).count()
    total_fine = issued_books.aggregate(total=Sum("fine")).get("total") or 0

    paginator = CustomPagination()
    paginated_data = paginator.paginate_queryset(issued_books, request)

    serializer = IssuedBookSerializer(paginated_data, many=True)

    return paginator.get_paginated_response(
        {
            "success": True,
            "student": StudentSerializer(student).data,
            "summary": {
                "total_issued": total_issued,
                "returned_count": returned_count,
                "pending_count": pending_count,
                "total_fine": total_fine,
            },
            "history": serializer.data,
        }
    )


permission_classes = [AllowAny]
@api_view(["GET"])
def homepage_stats(request):
    data = {
        "total_students": Student.objects.count(),
        "total_books": Book.objects.count(),
        "available_books": Book.objects.filter(available_quantity__gt=0).count(),
        "total_categories": Category.objects.count(),
        "total_authors": Author.objects.count(),
    }

    return Response(
        {
            "success": True,
            "stats": data
        },
        status=200
    )






