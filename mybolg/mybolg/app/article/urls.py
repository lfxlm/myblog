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
    re_path(r'^hotlist$', views.HostListView.as_view()),
    re_path(r'^art_by_time$', views.ArtByTimeView.as_view()),
    re_path(r'^tomycomment$', views.ToMyCommentView.as_view()),
    re_path(r'^comment$', views.AdminDelCommentView.as_view()),
    re_path(r'^art_by_classify$', views.ArtByClassifyView.as_view()),
    re_path(r'^localarticle/(?P<article_id>\d+)$', views.LocalArticleView.as_view()),
    re_path(r'^art_by_channel$', views.ArtBYChannel.as_view()),
]
