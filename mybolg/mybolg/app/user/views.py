import json

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View

from user.models import User


class LoginView(View):
    def post(self, request):
        dict = json.loads(request.body.decode())
        try:
            user = User.objects.get(mobile=dict['mobile'])
            if user:
                ret = user.check_password(dict['password'])
                if ret:
                    response = JsonResponse({'errmsg': "登陆成功", 'code': 0})
                    response.set_cookie('username', user.mobile, max_age=60000)
                    return response
                else:
                    return JsonResponse({'errmsg': "密码错误", 'code': 400})
        except Exception as e:
            User.objects.create_user(username=dict['mobile'], mobile=dict['mobile'], password=dict['password'])
            user = User.objects.get(mobile=dict['mobile'])
            response = JsonResponse({'errmsg': "注册成功", 'code': 0})
            response.set_cookie('username', user.mobile, max_age=6000)
            return response


class UserInfoView(View):
    def get(self, request, mobile):
        try:
            user = User.objects.get(mobile=mobile)
        except Exception as e:
            return JsonResponse({'errmsg': '用户不存在', 'code': 400})
        dict = user.to_dict()
        return JsonResponse({'errmsg': "ok", 'code': 0, 'data': dict})
