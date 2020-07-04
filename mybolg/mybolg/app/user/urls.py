from django.urls import re_path

from user import views

urlpatterns = [
    re_path(r'^login/$', views.LoginView.as_view()),
    re_path(r'^user/info$', views.UserInfoView.as_view()),
    re_path(r'^logout$', views.LogoutView.as_view()),
    re_path(r'^today$', views.TodayView.as_view()),  # 获取今日访问用户
    re_path(r'^myhistory$', views.HistoryView.as_view()),  # 获取用户浏览记录
    re_path(r'^history$', views.DeleteHistoryView.as_view()),  # 获取用户浏览记录
    re_path(r'^repassword$', views.RePasswordView.as_view()),  # 修改密码
]
