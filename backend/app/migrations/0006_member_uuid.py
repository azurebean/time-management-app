# Generated by Django 3.1 on 2020-08-07 15:58

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20200805_1930'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]