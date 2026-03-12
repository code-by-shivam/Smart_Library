from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser # Create your views here.
from django.contrib.auth.models import User

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
