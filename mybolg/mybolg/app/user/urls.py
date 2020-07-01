from django.urls import re_path

from user import views

urlpatterns = [
    re_path(r'^login/$', views.LoginView.as_view()),
    re_path(r'^user/info/(?P<mobile>[1][3-9][0-9]{9})$', views.UserInfoView.as_view()),
]
