from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^articles$', views.ArticleListView.as_view()),
    re_path(r'^host/articles$', views.HostArticleView.as_view()),
    re_path(r'^article$', views.ArticleInfoView.as_view()),
    re_path(r'^follow$', views.ArticleFollowView.as_view()),
]
