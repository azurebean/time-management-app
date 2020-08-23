from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from . import models


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        user_serializer = UserSerializer(self.user)
        data.update({'user': user_serializer.data})
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ('uuid', 'full_name', 'email', 'role', 'daily_work_hours')


class UserSerializerCreate(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.is_active = False  # for email validation
        instance.save()

        return instance

    class Meta:
        model = models.User
        fields = ('email', 'password', 'full_name', 'daily_work_hours')


class UserSerializerUpdate(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        instance.full_name = validated_data.get(
            'full_name', instance.full_name)
        instance.daily_work_hours = validated_data.get('daily_work_hours')
        instance.save()

        return instance

    class Meta:
        model = models.User
        fields = ('full_name', 'daily_work_hours')


class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer()

    class Meta:
        model = models.Task
        fields = '__all__'


class TaskSerializerCreate(serializers.ModelSerializer):
    def create(self, validated_data):
        return models.Task.objects.create(**validated_data)

    class Meta:
        model = models.Task
        exclude = ('created_at', 'modified_at',)


class TaskSerializerUpdate(serializers.ModelSerializer):
    class Meta:
        model = models.Task
        fields = ('name', 'duration', 'date', 'note')

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.date = validated_data.get('date', instance.date)
        instance.note = validated_data.get('note', instance.note)
        instance.save()

        return instance
