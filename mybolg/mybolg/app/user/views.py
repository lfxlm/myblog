import imghdr
import json
from datetime import datetime, timedelta

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View
from django_redis import get_redis_connection

from article.models import Article
from mybolg.libs.qiniuyun.qiniu_storage import storage
from mybolg.settings import QINIU_URL
from mybolg.utils.jwt import generate_jwt, get_token, get_user_by_token, verify_jwt
from user.models import User, Message


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


class ReUserInfoView(View):
    def post(self, request):
        dict = json.loads(request.body.decode())
        user = get_user_by_token(request)
        username = dict.get('username')
        gender = dict.get('gender')
        info = dict.get('info')
        user.username = username
        user.gender = gender
        user.info = info
        user.save()
        dict = user.to_dict()
        return JsonResponse({'errmsg': "ok", 'code': 0, 'data': dict})


class AvatarUploadView(View):
    def post(self, request):
        token = request.POST.get('Authorization')
        if not token:
            return JsonResponse({'errmsg': '缺少参数', 'code': 201})
        data = verify_jwt(token)
        if not data:
            return JsonResponse({'errmsg': "登录信息已经失效,请重新登陆", 'code': 201})
        user_id = data.get('data').get('user_id')
        user = User.objects.get(id=user_id)
        if not user:
            return JsonResponse({'errmsg': '请先登录', 'code': 201})
        file = request.FILES.get('file')
        print(file)
        type = imghdr.what(file)
        if type:
            img_url = storage(file.read())
            user.avatar = QINIU_URL + img_url
            user.save()
            dict = user.to_dict()
            return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': dict})
        else:
            return JsonResponse({'errmsg': '图片类型有误', 'code': 400})


class AddMessageView(View):
    def post(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '请先登录', 'code': 201})
        message = json.loads(request.body.decode()).get('message')
        if not message:
            return JsonResponse({"errmsg": '评论不能为空', 'code': 400})
        message = Message.objects.create(user=user, content=message, parent_id=None)
        message.save()
        message_items = Message.objects.all()
        data = []
        for message in message_items:
            dict = message.to_dict()
            data.append(dict)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': data})


class GetMessageView(View):
    def get(self, request):
        message_items = Message.objects.filter(parent_id=None, is_del=0).order_by('-ctime')  # 一级留言
        data = []
        for message in message_items:
            subs_list = []
            try:
                subs_message_items = Message.objects.filter(parent=message, is_del=0).order_by('-ctime')
                for sub in subs_message_items:
                    subs = sub.to_dict()
                    subs_list.append(subs)
            except Exception as e:
                subs_list = []
            dict = message.to_dict()
            dict['subs'] = subs_list
            data.append(dict)
        # print(data)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': data})


class ReplyMessageView(View):
    def post(self, request):
        message_id = json.loads(request.body.decode()).get('message_id')
        reply = json.loads(request.body.decode()).get('reply_comment')
        user = get_user_by_token(request)
        message = Message.objects.create(user=user, parent_id=message_id, content=reply)
        message.ctime = datetime.now() + timedelta(hours=8)
        message.save()
        return JsonResponse({'errmsg': 'ok', 'code': 0})


class DelMyMessageView(View):
    def delete(self, request):
        message_id = json.loads(request.body.decode()).get('message_id')
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        try:
            message = Message.objects.get(id=message_id, user=user)
        except Exception as e:
            return JsonResponse({"errmsg": '您不能删除别人的评论哦', 'code': 201})
        message.is_del = 1
        message.save()
        return JsonResponse({'errmsg': 'ok', 'code': 0})
