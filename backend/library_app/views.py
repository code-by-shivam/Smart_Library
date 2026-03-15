from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser # Create your views here.
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
@api_view(["POST"])
def admin_login_api(request):
    username=request.data.get("username")
    password=request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
        return Response(
            {
                "success":True,
                "message":"Login Succesfully 👍",
                "username":username
            },
            status=200
        )
    return Response(
            {
                "success":False,
                "message":"Invalid Credientials 😒"
            },
            status=401
        )



@api_view(["POST"])
def add_category(request):
    name=request.data.get("name")
    status=request.data.get("status","1")

    is_active =True if str(status)=="1" else False 

    category=Category.objects.create(name=name,is_active=is_active)
    serializer=CategorySerializer(category)

    return Response(
        {
            "success":True,
            "message":"Category has been Created 👌",
            "category":serializer.data,
        },
        status=201
    )


@api_view(["GET"])
def list_categories(request):
    categories = Category.objects.all().order_by("-id") 
    serializer=CategorySerializer(categories,many=True)

    return Response(
        serializer.data,
        status=200
    )

@api_view(["PUT"])
def update_category(request,id):
    category=get_object_or_404(Category,id=id)
    name=request.data.get("name")
    status=request.data.get("status","1")

    is_active =True if str(status)=="1" else False 

    category.name=name
    category.is_active=is_active
    category.save()
    serializer=CategorySerializer(category)

    return Response(
        {
            "success":True,
            "message":"Category has been updated 👌",
            "category":serializer.data,
        },
        status=200
    )


@api_view(["DELETE"])
def delete_category(request,id):
    category=get_object_or_404(Category,id=id)
    category.delete()

    return Response(
        {
            "success":True,
            "message":"Category has been deleted successfully 😍",
        },
        status=200
    )


@api_view(["POST"])
def add_author(request):
    name=request.data.get("name")


    author=Author.objects.create(name=name)
    serializer=AuthorSerializer(author)

    return Response(
        {
            "success":True,
            "message":"Author has been Created 👌",
            "author":serializer.data,
        },
        status=201
    )


@api_view(["GET"])
def list_authors(request):
    authors = Author.objects.all().order_by("-id")
    serializer=AuthorSerializer(authors,many=True)

    return Response(
        serializer.data,
        status=200
    )


@api_view(["PUT"])
def update_author(request,id):
    author=get_object_or_404(Author,id=id)
    name=request.data.get("name")

    author.name=name
    author.save()
    serializer=AuthorSerializer(author)

    return Response(
        {
            "success":True,
            "message":"Author has been updated 👌",
            "author":serializer.data,
        },
        status=200
    )


@api_view(["DELETE"])
def delete_author(request,id):
    author=get_object_or_404(Author,id=id)
    author.delete()

    return Response(
        {
            "success":True,
            "message":"Author has been deleted successfully 😍",
        },
        status=200
    )


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])   # to handle file uploads and form data in the same request  
def add_book(request):
    title=request.data.get("title")
    author_id=request.data.get("author_id")
    category_id=request.data.get("category_id")
    isbn=request.data.get("isbn")
    price=request.data.get("price")
    quantity=request.data.get("quantity")
    cover_image=request.FILES.get("cover_image")

    author=Author.objects.get(id=author_id)
    category=Category.objects.get(id=category_id)
   
    if Book.objects.filter(isbn=isbn).exists():
        return Response(
            {
                "success":False,
                "message":"Book with this ISBN already exists 😒"
            },
            status=400
        )

    book=Book.objects.create(
        title=title,
        author=author,
        category=category,
        isbn=isbn,
        price=price,
        quantity=quantity,
        cover_image=cover_image
        )
    
    serializer=BookSerializer(book) # to serialize the created book instance and include the category_name and author_name in the response
    
    return Response(
        {
            "success":True,
            "message":"Book has been Added 👌",
            "book":serializer.data,
        },
        status=201
    )


@api_view(["GET"])
def list_books(request):    
    books = Book.objects.all().order_by("-id")
    serializer=BookSerializer(books,many=True)

    return Response(
        serializer.data,
        status=200
    )


@api_view(["PUT"])
@parser_classes([MultiPartParser, FormParser])   # to handle file uploads and form data in the same request  
def update_book(request,id):
    book=get_object_or_404(Book,id=id)
     
    title=request.data.get("title")
    author_id=request.data.get("author")
    category_id=request.data.get("category")
    price=request.data.get("price") 
    quantity=request.data.get("quantity")
    cover_image=request.FILES.get("cover_image") 
       
    author=Author.objects.get(id=author_id)
    category=Category.objects.get(id=category_id)


    book.title=title
    book.author=author
    book.category=category
    book.price=price    
    book.quantity=quantity
    if cover_image:
        book.cover_image=cover_image

    book.save()
    serializer=BookSerializer(book) # to serialize the updated book instance and include the category_name

    return Response(
        {   "success":True,
            "message":"Book has been Updated 👌",
            "book":serializer.data,
        },  status=200
    )

@api_view(["DELETE"])
def delete_book(request,id):
    book=get_object_or_404(Book,id=id)
    book.delete()

    return Response(
        {
            "success":True,
            "message":"Book has been deleted successfully 😍",
        },
        status=200
    )


@api_view(["POST"])
def change_password(request):
    username=request.data.get("username")
    current_password=request.data.get("current_password")
    new_password=request.data.get("new_password")
    confirm_password=request.data.get("confirm_password")


    if new_password != confirm_password:
        return Response(
            {
                "success":False,
                "message":"New password and confirm password do not match 😒"
            },
            status=400
        )
    
    if len(new_password) < 6:
        return Response(
            {
                "success":False,
                "message":"New password must be at least 6 characters long 😒"
            },
            status=400
        )

    try:
        user = User.objects.get(username=username,is_staff=True)
    except User.DoesNotExist:
        return Response(
            {
                "success":False,
                "message":"Admin user not found 😒"
            },
            status=404
        )
    
    if not user.check_password(current_password):
        return Response(
            {
                "success":False,
                "message":"Current password is incorrect 😒"
            },
            status=400
        )
    user.set_password(new_password)
    user.save()
    return Response(
        {
            "success":True,
            "message":"Password has been changed successfully 👍"
        },
        status=200
    )


@api_view(["POST"])
def user_signup_api(request):
    full_name=request.data.get("full_name")
    mobile=request.data.get("mobile")
    email=request.data.get("email")
    password=request.data.get("password")
    confirm_password=request.data.get("confirmPassword")

    if password != confirm_password:
        return Response(
            {
                "success":False,
                "message":"Password and confirm password do not match 😒"
            },
            status=400
        )
    
    if len(password) < 6:
        return Response(
            {
                "success":False,
                "message":"Password must be at least 6 characters long 😒"
            },
            status=400
        )
    if not mobile.isdigit() or len(mobile) < 10:
        return Response(
            {
                "success":False,
                "message":"Invalid mobile number 😒"
            },
            status=400
        )
    
    last_student=Student.objects.all().order_by("-id").first()
    if last_student and last_student.student_id.isdigit():
        new_id_int=int(last_student.student_id) + 1
        new_id=str(new_id_int).zfill(5)  # Increment the last student ID and pad with zeros to maintain a 5-digit format
    else:
        new_id_int= 1001

    student_id=str(new_id_int)

    if Student.objects.filter(email=email).exists():
        return Response(
            {
                "success":False,
                "message":"User with this email already exists 😒"
            },
            status=400
        )
    
    hashed_password=make_password(password)
    student=Student.objects.create(
        student_id=student_id,
        full_name=full_name,
        email=email,
        mobile=mobile,
        password=hashed_password,
        is_active=True
    )
    return Response(
        {
            "success":True,
            "message":"User has been registered successfully 👍",
            "full_name":student.full_name,
            "student_id":student.student_id,
            
        },
        status=201
    )


@api_view(["POST"])
def user_login_api(request):
    login_id=request.data.get("login_id")
    password=request.data.get("password")


    try:
        if '@' in login_id:
            student = Student.objects.get(email=login_id)
        else:
            student = Student.objects.get(student_id=login_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success":False,
                "message":"Invalid login ID 😒"
            },
            status=401
        )
    
    if not check_password(password,student.password):
        return Response(
            {
                "success":False,
                "message":"Invalid password 😒"
            },
            status=401
        )
    
    if not student.is_active:
        return Response(
            {
                "success":False,
                "message":"User account in inactive, please contact admin"
            },
            status=403,
        )
    
    return Response(
        {
            "success":True,
            "message":"Login successful 👍",
            "full_name":student.full_name,
            "student_id":student.student_id,
        },  
        status=200
    )
    

@api_view(["GET"])
def user_stats_api(request):
    student_id=request.query_params.get("student_id")
    try:
        student=Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response(
            {
                "success":False,
                "message":"Student not found 😒"
            },
            status=404
        )
    
    total_books=Book.objects.count()
    total_issued=IssuedBook.objects.filter(student=student).count()
    not_returned=IssuedBook.objects.filter(student=student, is_returned=True).count()

    stats={
        "total_books":total_books,
        "total_issued":total_issued,
        "pending_returns":not_returned,
    }
    return Response(
        {
            "success":True,
            "stats":stats
        },
        status=200
    )
    

@api_view(["GET"])
def user_list_books(request):
    books=Book.objects.select_related("author","category").prefetch_related("issued_records").all().order_by("title")
    serializer=BookListSerializer(books,many=True)

    return Response(
        serializer.data,
        status=200
    )

