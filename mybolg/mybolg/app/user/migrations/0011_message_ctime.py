# Generated by Django 2.2.5 on 2020-07-05 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_auto_20200705_0520'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='ctime',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
