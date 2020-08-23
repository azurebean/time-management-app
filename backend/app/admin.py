from django.contrib import admin
from django.contrib.auth import get_user_model
from . import models


class UserAdmin(admin.ModelAdmin):
    fields = ('full_name', 'email', 'role',
              'daily_work_hours', 'is_active', 'is_staff', 'last_login')
    list_display = ('full_name', 'email', 'role')


class TaskAdmin(admin.ModelAdmin):
    list_display = ('name', 'assignee', 'creator')


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Task, TaskAdmin)
