from django.urls import path
from . import views
urlpatterns = [
    path("admin/login/",views.admin_login_api),
    path("admin/add-Category/",views.add_category),
    path("categories/",views.list_categories),
    path("admin/update-category/<int:id>/",views.update_category),
    path("admin/delete-category/<int:id>/",views.delete_category),
    path("admin/add-author/",views.add_author),
    path("admin/authors/",views.list_authors),
    path("admin/update-author/<int:id>/",views.update_author),
    path("admin/delete-author/<int:id>/",views.delete_author),
    path("admin/add-book/",views.add_book),
    path("books/",views.list_books),
    path("admin/update-book/<int:id>/",views.update_book),
    path("admin/delete-book/<int:id>/",views.delete_book),
    path("admin/change-password/",views.change_password),
]
