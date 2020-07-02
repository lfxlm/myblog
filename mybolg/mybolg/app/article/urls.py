from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^articles$', views.ArticleListView.as_view()),
    re_path(r'^host/articles$', views.HostArticleView.as_view()),
    re_path(r'^article$', views.ArticleInfoView.as_view()),
    re_path(r'^follow$', views.ArticleFollowView.as_view()),
    re_path(r'^relate/article$', views.RelateArticleView.as_view()),
    re_path(r'^commonts$', views.ArticleCommentView.as_view()),
    re_path(r'^add_comment$', views.AddCommentView.as_view()),
    re_path(r'^del_comment$', views.DelCommentView.as_view()),
    re_path(r'^reply$', views.ReplyCommentView.as_view()),
    re_path(r'^articles/$', views.GetMoreArticleView.as_view()),
]
