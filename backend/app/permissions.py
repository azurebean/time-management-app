from rest_framework import permissions
from django.contrib.auth import get_user_model
from . import models


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == models.User.ADMIN


class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == models.User.MANAGER


class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


class CreateOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method == 'POST'
