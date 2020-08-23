import uuid
from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth import get_user_model


class MemberManager(BaseUserManager):
    def create_user(self, email, full_name, password, **extra_fields):
        if not email:
            raise ValueError(_('Email is required.'))
        if not full_name:
            raise ValueError(_('Full name is required.'))
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, full_name, password=None):
        user = self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            is_staff=True,
            is_superuser=True,
            role=Member.ADMIN
        )

        return user


class Member(AbstractUser):
    ADMIN = 1
    MANAGER = 2
    MEMBER = 3

    ROLES = (
        (ADMIN, 'Admin'),
        (MANAGER, 'Manager'),
        (MEMBER, 'User'),
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    username = None
    uuid = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=64, blank=False)
    email = models.EmailField(unique=True)
    role = models.PositiveSmallIntegerField(choices=ROLES, default=MEMBER)
    daily_work_hours = models.PositiveSmallIntegerField(blank=True, null=True)

    objects = MemberManager()

    def __str__(self):
        return self.email


User = get_user_model()


class Task(models.Model):
    creator = models.ForeignKey(User, to_field="uuid", related_name='tasks_created',
                                on_delete=models.CASCADE)
    assignee = models.ForeignKey(User, to_field="uuid", related_name='tasks_assigned',
                                 on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    duration = models.PositiveIntegerField()
    date = models.DateField(default=date.today)
    note = models.CharField(max_length=1024, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
