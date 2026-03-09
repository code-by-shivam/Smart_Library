from django.urls import path
from .views import *
urlpatterns = [
    path("admin/login/",admin_login_api),
    path("admin/add-Category/",add_category),
    path("categories/",list_categories)
]
