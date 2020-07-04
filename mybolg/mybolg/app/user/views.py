import json
from datetime import datetime, timedelta

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View
from django_redis import get_redis_connection

from article.models import Article
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
                    user.last_login = datetime.now() + timedelta(hours=8)
                    user.save()
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
            user.last_login = datetime.now() + timedelta(hours=8)
            user.save()
        data = user.to_dict()
        token = generate_jwt(user.id)
        data['token'] = token
        response = JsonResponse({'errmsg': "注册成功", 'code': 0, 'data': data})
        response.set_cookie('username', user.username, max_age=60000)
        return response


class UserInfoView(View):
    def get(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        if user:
            dict = user.to_dict()
            return JsonResponse({'errmsg': "ok", 'code': 0, 'data': dict})
        else:
            return JsonResponse({'errmsg': "请重新登陆", 'code': 201})


class LogoutView(View):
    def post(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        response = JsonResponse({'errmsg': "ok", 'code': 0})
        response.delete_cookie('username')
        return response


class TodayView(View):
    def get(self, request):
        today = datetime.now() - timedelta(days=1)
        user_item = User.objects.filter(last_login__gt=today)
        vist_items = []
        for user in user_item:
            vist_items.append(user.to_dict())
        print(vist_items)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'vist_items': vist_items})


class HistoryView(View):
    def get(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        redis_conn = get_redis_connection('history')
        historys = redis_conn.lrange('history_%s' % user.id, 0, -1)
        new_history = [int(art_id) for art_id in historys][::-1]
        time_list = []
        for art in new_history:
            time = redis_conn.get('%s:%s' % (user.id, art))
            time_list.append(time.decode())
        art_items = Article.objects.filter(id__in=new_history)
        history_items = []
        i = 0
        for art in art_items:
            history_items.append({
                'article': art.id,
                'username': art.user.username,
                'title': art.title,
                'time': time_list[i]

            })
            i += 1
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'history_items': history_items[::-1]})


class DeleteHistoryView(View):
    def delete(self, request):
        article_id = json.loads(request.body.decode()).get('article_id')
        if not article_id:
            return JsonResponse({"errmsg": '缺少参数', 'code': 400})
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        redis_conn = get_redis_connection('history')
        redis_conn.lrem('history_%s' % user.id, 0, article_id)
        redis_conn.delete('%s:%s' % (user.id, article_id))
        return JsonResponse({'errmsg': 'ok', 'code': 0})


class RePasswordView(View):
    def post(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        dict = json.loads(request.body.decode())
        old_pwd = dict.get('old_password')
        new_pwd = dict.get('new_password')
        re_pwd = dict.get('re_password')
        ret = user.check_password(old_pwd)
        if not ret:
            return JsonResponse({'errmsg': '旧密码错误', 'code': 200})
        elif new_pwd != re_pwd:
            return JsonResponse({'errmsg': '两次密码不一致', 'code': 400})
        else:
            user.set_password(new_pwd)
            user.save()
            return JsonResponse({'errmsg': '修改成功', 'code': 0})
