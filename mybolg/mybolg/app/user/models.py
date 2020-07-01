from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    # gender_list = ((1, '男'), (2, '女'), (3, '保密'))
    mobile = models.CharField(max_length=11, unique=True)
    password = models.CharField(max_length=200)
    gender = models.CharField(max_length=2, default='保密')
    info = models.CharField(max_length=200, default=None, null=True)

    class Meta:
        db_table = 't_user'
        verbose_name = '用户表'
        verbose_name_plural = verbose_name

    def to_dict(self):
        return {
            "mobile": self.mobile,
            'username': self.username,
            'gender': self.gender,
            'info': self.info
        }
