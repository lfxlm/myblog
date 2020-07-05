from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    # gender_list = ((1, '男'), (2, '女'), (3, '保密'))
    mobile = models.CharField(max_length=11, unique=True)
    password = models.CharField(max_length=200)
    gender = models.CharField(max_length=2, default='保密')
    info = models.CharField(max_length=200, default=None, null=True)
    avatar = models.CharField(max_length=500, null=True,
                              default='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1593686188537&di=01d5790d79716e3ba84d87282faafb53&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F03%2F59%2F66%2F5bd129fad1055_610.jpg')

    class Meta:
        db_table = 't_user'
        verbose_name = '用户表'
        verbose_name_plural = verbose_name

    def to_dict(self):
        return {
            "mobile": self.mobile,
            'username': self.username if self.username else self.mobile,
            'gender': self.gender,
            'info': self.info,
            'avatar': self.avatar,
            'time': self.last_login.strftime('%Y-%m-%d %H:%M:%S'),
        }


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=1024)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, default=None, null=True)
    is_del = models.IntegerField(default=0)  # 0.未删除 1.删除
    ctime = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = 't_message'
        verbose_name = '留言表'
        verbose_name_plural = verbose_name

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.user.username,
            'content': self.content,
            'parent': self.parent.id if self.parent else None,
            'useravatar': self.user.avatar,
            'is_del': self.is_del,
            'time': self.ctime.strftime('%Y-%m-%d %H:%M:%S'),
        }
