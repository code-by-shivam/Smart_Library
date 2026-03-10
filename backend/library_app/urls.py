from django.urls import path
from .views import *
urlpatterns = [
    path("admin/login/",admin_login_api),
    path("admin/add-Category/",add_category),
    path("categories/",list_categories),
    path("admin/update-category/<int:id>/",update_category),
    path("admin/delete-category/<int:id>/",delete_category),
    path("admin/add-author/",add_author),
    path("admin/authors/",list_authors),
    path("admin/update-author/<int:id>/",update_author),
    path("admin/delete-author/<int:id>/",delete_author),
]
