import json

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View

from mybolg.utils.jwt import generate_jwt, get_token, get_user_by_token
from user.models import User


class LoginView(View):
    def post(self, request):
        dict = json.loads(request.body.decode())
        try:
            user = User.objects.get(mobile=dict['mobile'])
            if user:
                ret = user.check_password(dict['password'])
                if ret:
                    data = user.to_dict()
                    token = generate_jwt(user.id)
                    data['token'] = token
                    response = JsonResponse({'errmsg': "登陆成功", 'code': 0, 'data': data})
                    response.set_cookie('username', user.username, max_age=60000)
                    return response
                else:
                    return JsonResponse({'errmsg': "密码错误", 'code': 400})
        except Exception as e:
            User.objects.create_user(username=dict['mobile'], mobile=dict['mobile'], password=dict['password'])
            user = User.objects.get(mobile=dict['mobile'])
        data = user.to_dict()
        token = generate_jwt(user.id)
        data['token'] = token
        response = JsonResponse({'errmsg': "注册成功", 'code': 0, 'data': data})
        response.set_cookie('username', user.username, max_age=60000)
        return response


class UserInfoView(View):
    def get(self, request):
        token = get_token(request)
        if token:
            user = get_user_by_token(token)
            if user:
                dict = user.to_dict()
                return JsonResponse({'errmsg': "ok", 'code': 0, 'data': dict})
            else:
                return JsonResponse({'errmsg': "用户不存在", 'code': 201})

        else:
            return JsonResponse({'errmsg': '缺少参数,请重试', 'code': 201})
