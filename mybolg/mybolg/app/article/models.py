import datetime

from django.db import models

# Create your models here.
from user.models import User


class Article(models.Model):
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=500)
    time = models.DateTimeField(auto_now_add=True)
    follow_count = models.IntegerField(default=0)
    read_count = models.IntegerField(default=0)
    avatar = models.CharField(max_length=1000, verbose_name='封面', null=True)
    channel = models.CharField(max_length=20, default='编程')  # 默认标签

    class Meta:
        db_table = 't_article'
        verbose_name = '文章表'
        verbose_name_plural = verbose_name

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'time': self.time.strftime('%Y-%m-%d %H:%M:%S'),
            'follow_count': self.follow_count,
            'read_count': self.read_count,
            'avatar': self.avatar,
            'channel': self.channel,
            'content': self.content
        }


class Channel(models.Model):
    # 标签表
    name = models.CharField(unique=True, max_length=10)

    class Meta:
        db_table = 't_channel'
        verbose_name = '标签表'
        verbose_name_plural = verbose_name


class Art_Channel(models.Model):
    # 博客标签表
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 't_art_channel'
        verbose_name = '标签表'
        verbose_name_plural = verbose_name


class Classify(models.Model):
    # 分类表
    name = models.CharField(unique=True, max_length=10)

    class Meta:
        db_table = 't_classify'
        verbose_name = '标签表'
        verbose_name_plural = verbose_name


class Art_Class(models.Model):
    # 博客分类表
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True)
    classify = models.ForeignKey(Classify, on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 't_art_classify'
        verbose_name = '标签表'
        verbose_name_plural = verbose_name


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    comment = models.CharField(max_length=500)
    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE, related_name='subs')
    ctime = models.DateTimeField(auto_now_add=True)
    is_del = models.IntegerField(default=0)  # 0.未删除,1.删除状态

    class Meta:
        db_table = 't_comment'
        verbose_name = '评论'
        verbose_name_plural = verbose_name

    def to_dict(self):
        return {
            'id': self.id,
            'article': self.article.id,
            'comment': self.comment,
            'time': self.ctime.strftime('%Y-%m-%d %H:%M:%S'),
            'del': self.is_del,
        }


class Relation(models.Model):
    '''文章点赞表'''
    relation_list = [
        (1, '点赞'),
        (0, '无关系'),
        (2, '收藏')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    relation = models.IntegerField(default=0)

    class Meta:
        db_table = 't_relation'
        verbose_name = '文章点赞表'
        verbose_name_plural = verbose_name
