from uuid import UUID
from django.core import exceptions
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model

from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string

from datetime import timedelta, datetime
from django.http import Http404, HttpResponseBadRequest

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from . import models, serializers, tokens
from .permissions import IsAdmin, IsManager, ReadOnly, CreateOnly

from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


class Profile(APIView):
    def get(self, request):
        user_serializer = serializers.UserSerializer(request.user)

        return Response(user_serializer.data)


class UserList(APIView):
    permission_classes = (CreateOnly | IsAdmin | IsManager,)

    def get(self, request):
        users = models.User.objects.all().order_by('role', 'id')
        users_serializer = serializers.UserSerializer(users, many=True)

        return Response(users_serializer.data)

    def post(self, request, format=None):
        users_serializer = serializers.UserSerializerCreate(
            data=request.data)

        if users_serializer.is_valid(raise_exception=True):
            user = users_serializer.save()
            # refresh = RefreshToken.for_user(user)
            # user_view_serializer = serializers.UserSerializer(user)
            # response = {
            #     'refresh': str(refresh),
            #     'access': str(refresh.access_token),
            #     'user': user_view_serializer.data
            # }
            # Send activation email
            current_site = get_current_site(request)
            subject = 'Activate your account'
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = tokens.account_activation_token.make_token(user)
            message = render_to_string('account_activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': uid,
                'token': token
            })
            user.email_user(subject, message)

            return Response(status=status.HTTP_201_CREATED)


class UserDetail(APIView):
    def get_object(self, uuid):
        try:
            user = models.User.objects.get(uuid=uuid)
            return user
        except (models.User.DoesNotExist, exceptions.ValidationError):
            raise Http404

    def get(self, request, uuid):
        user = self.get_object(uuid)
        # Only admin and manager can view other users
        if request.user.role not in [models.User.ADMIN, models.User.MANAGER] and request.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user_serializer = serializers.UserSerializer(user)

        return Response(user_serializer.data)

    def patch(self, request, uuid):
        user = self.get_object(uuid)
        # Only admin and manager can update other users
        if request.user.role not in [models.User.ADMIN, models.User.MANAGER] and request.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if request.user.role not in [models.User.ADMIN] and user.role in [models.User.ADMIN]:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user_serializer = serializers.UserSerializerUpdate(
            user, data=request.data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
            return Response(user_serializer.data)

    def delete(self, request, uuid):
        # Only admin and manager can delete
        if request.user.role not in [models.User.ADMIN, models.User.MANAGER]:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(uuid)
        # Manager cannot remove admin
        if request.user.role not in [models.User.ADMIN] and user.role in [models.User.ADMIN]:
            return Response(status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response('Deleted', status=status.HTTP_204_NO_CONTENT)


class TaskList(APIView):
    def get(self, request):
        assignee_param = request.query_params.get('assignee')
        from_param = request.query_params.get('from')
        to_param = request.query_params.get('to')

        from_filter = {'date__gte': from_param} if from_param else {}
        to_filter = {'date__lte': to_param} if to_param else {}

        if request.user.role == models.User.ADMIN:
            task_filter = {'assignee': assignee_param or request.user,
                           **from_filter, **to_filter}
        elif not assignee_param or str(assignee_param) == str(request.user.uuid):
            task_filter = {}
            task_filter = {'assignee': request.user.uuid,
                           **from_filter, **to_filter}
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        tasks = models.Task.objects.filter(
            **task_filter).order_by('-date', '-duration')
        tasks_serializer = serializers.TaskSerializer(tasks, many=True)

        return Response(tasks_serializer.data)

    def post(self, request):
        data = {
            **request.data,
            'creator': request.user.uuid,
        }
        assignee_uuid = request.data.get('assignee')
        user = models.User.objects.get(pk=request.user.id)
        # Assign the task to current user if there is no assignee or assignee is the current user
        if not assignee_uuid or str(assignee_uuid) == str(user.uuid):
            data['assignee'] = user.uuid
        # Admin can assign tasks to any users
        elif request.user.role == models.User.ADMIN:
            data['assignee'] = assignee_uuid
        # Non-admin cannot assign tasks to other users
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

        task_serializer = serializers.TaskSerializerCreate(data=data)

        if task_serializer.is_valid(raise_exception=True):
            task_serializer.save()
            return Response(task_serializer.data, status=status.HTTP_201_CREATED)


class TaskDetail(APIView):
    def get_object(self, pk):
        try:
            return models.Task.objects.get(pk=pk)
        except models.Task.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        task = self.get_object(pk)
        # Only admin can view tasks of others
        if request.user.role != models.User.ADMIN and task.assignee != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        task_serializer = serializers.TaskSerializer(task)
        return Response(task_serializer.data)

    def patch(self, request, pk):
        task = self.get_object(pk)
        user = request.user
        # Member can only update their tasks, admin can update all
        if user.role != models.User.ADMIN and task.assignee != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        task_serializer = serializers.TaskSerializerUpdate(
            task, data=request.data)
        if task_serializer.is_valid(raise_exception=True):
            task_serializer.save()
            return Response(task_serializer.data)

    def delete(self, request, pk):
        task = self.get_object(pk)
        user = request.user
        # Member can only delete their tasks, admin can delete all
        if user.role != models.User.ADMIN and task.assignee != user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        task.delete()
        return Response('Deleted', status=status.HTTP_204_NO_CONTENT)
