from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('refresh/', TokenRefreshView.as_view()),
    path('admin/login/',views.Admin_login,name='admin_login'),
    path("admin/add-Category/",views.add_category,name="add_category"),
    path("admin/categories/",views.list_categories,name="list_categories"),
    path("admin/update-category/<int:id>/",views.update_category,name="update_category"),
    path("admin/delete-category/<int:id>/",views.delete_category,name="delete_category"),
    path("admin/add-author/",views.add_author,name="add_author"),
    path("admin/list-authors/",views.list_authors,name="list_authors"),
    path("admin/update-author/<int:id>/",views.update_author,name="update_author"),
    path("admin/delete-author/<int:id>/",views.delete_author,name="delete_author"),
    path("admin/add-book/",views.add_book,name="add_book"),
    path("list-books/",views.list_books,name="list_books"),
    path("admin/update-book/<int:id>/",views.update_book,name="update_book"),
    path("admin/delete-book/<int:id>/",views.delete_book,name="delete_book"),
    path("change-password/",views.change_password,name="change_password"),
    path('logout/', views.logout_api, name='logout'),
    path("student/signup/",views.student_signup,name="student_signup"),
    path("student/login/",views.student_login,name="student_login"),
    path("student/stats/",views.student_stats,name="student_stats"),
    path("student/profile/",views.student_profile,name="student_profile"),
    path("admin/students_list/",views.list_registered_students,name="list_registered_students"),
    path("admin/students_block/<int:id>/",views.block_student,name="block_student"),
    path("admin/students_unblock/<int:id>/",views.unblock_student,name="unblock_student"),
    path("admin/student/by-id/<int:student_id>/",views.student_by_id,name="student_by_id"),
    path("admin/books/lookup/",views.book_lookup,name="book_lookup"),
    path("admin/book_issue/",views.issue_book,name="issue_book"),
    path("admin/issue_book_list/",views.list_issued_books,name="list_issued_books"),
    path("admin/issued_book_details/<int:id>/",views.get_issued_book_details,name="get_issued_book_details"),
    path("admin/return_book/<int:id>/",views.return_book,name="return_book"),
    path("admin/student_history/<int:student_id>/",views.student_history,name="student_history"),
    path("admin/dashboard_stats/",views.admin_dashboard_stats,name="admin_dashboard_stats"),
    path("student/issue_history/",views.student_issue_history,name="student_issue_history"),
    path("homepage/stats/",views.homepage_stats,name="homepage_stats"),






]
    