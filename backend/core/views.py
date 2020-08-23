from django.contrib.auth import login

from django.shortcuts import render, redirect
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from app import models, tokens, serializers
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


class Activate(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = models.User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, models.User.DoesNotExist):
            user = None

        if user is not None and tokens.account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
