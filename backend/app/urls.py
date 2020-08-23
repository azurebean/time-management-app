from django.urls import path
from app import views

urlpatterns = [
    path('profile/', views.Profile.as_view()),
    path('users/', views.UserList.as_view()),
    path('users/<str:uuid>/', views.UserDetail.as_view()),
    path('tasks/', views.TaskList.as_view()),
    path('tasks/<int:pk>/', views.TaskDetail.as_view()),
]
