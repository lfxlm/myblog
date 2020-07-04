import json
from datetime import datetime, timedelta
from dateutil import parser

from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View

from article.models import Article, Relation, Comment, Art_Class, Classify
from mybolg.utils.history import add_history
from mybolg.utils.jwt import get_token, get_user_by_token
from user.models import User


class ArticleListView(View):
    # 首页文章列表展示
    def get(self, request):
        article_items = Article.objects.order_by('-follow_count').all()
        max_flag = len(article_items)
        article_list = []
        if max_flag > 9:
            article_items = article_items[0:10]  # 先去前10个数据
        for article in article_items:
            dict = article.to_dict()
            user = User.objects.get(id=article.user_id)
            dict['username'] = user.username
            article_list.append(dict)
        return JsonResponse({'errmsg': "ok", 'code': 0, "data": article_list, 'max_flag': max_flag})


class HostArticleView(View):
    # 热门文章图片标题展示
    def get(self, request):
        art_item = Article.objects.order_by('-read_count').all()[0:2]
        avatar_dict = {}
        i = 1
        data_list = []
        for art in art_item:
            avatar_dict['avatar%d' % i] = art.avatar
            avatar_dict['id%d' % i] = art.id
            avatar_dict['title%d' % i] = art.title
            i += 1
            data_list.append(avatar_dict)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': data_list})


class ArticleInfoView(View):
    def get(self, request):
        art_id = request.GET.get('id')
        art = Article.objects.get(id=art_id)
        art.read_count += 1
        art.save()
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        add_history(user_id=user.id, article_id=art_id)
        dict = art.to_dict()
        dict['username'] = user.username
        list = []
        list.append(dict)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': list})


# todo 可以使用redis缓存用户点赞列表和文章点赞列表
class ArticleFollowView(View):
    def get(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        art_id = request.GET.get('id')
        art = Article.objects.get(id=art_id)
        try:
            relation = Relation.objects.get(user=user, article_id=art_id)
            if relation.relation == 1:
                return JsonResponse({'errmsg': '您已经赞过了哦', 'code': 201})
            else:
                relation.relation = 1
                art.follow_count += 1
                relation.save()
        except Exception as e:
            Relation.objects.create(user_id=user.id, article_id=art_id, relation=1)
            art.follow_count += 1
        art.save()
        dict = art.to_dict()
        dict['username'] = art.user.username
        list = []
        list.append(dict)
        return JsonResponse({"errmsg": 'ok', 'code': 0, 'data': list})


class RelateArticleView(View):
    # 相关文章
    def get(self, request):
        art_id = request.GET.get('id')
        art = Article.objects.get(id=art_id)
        try:
            art_items = Article.objects.filter(channel=art.channel).exclude(id=art_id)[0:4]
            list = []
            i = 1
            for art_item in art_items:
                list.append({'title%d' % i: art_item.title, 'id': art_item.id})
                i += 1
                if i == 3:
                    i = 1

        except Exception as e:
            pass
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': list})


# 获取文章评论
class ArticleCommentView(View):
    def get(self, request):
        art_id = request.GET.get('id')
        # token = get_token(request)
        # user = get_user_by_token(token)
        data = []
        try:
            comments = Comment.objects.filter(article_id=art_id, parent_id=None, is_del=0).order_by('-ctime')

            for comment in comments:
                dict = comment.to_dict()
                try:
                    sub_comments = Comment.objects.filter(parent_id=comment.id, article_id=art_id, is_del=0).order_by(
                        '-ctime')
                    subs_list = []
                    for sub_comment in sub_comments:
                        subs = sub_comment.to_dict()
                        subs['username'] = sub_comment.user.username
                        subs['useravatar'] = sub_comment.user.avatar
                        subs_list.append(subs)
                except Exception as e:
                    subs_list = []
                dict['subs'] = subs_list
                dict['username'] = comment.user.username
                dict['useravatar'] = comment.user.avatar
                data.append(dict)
        except Exception as e:
            pass
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': data})


# 增加评论
class AddCommentView(View):
    def post(self, request):
        art_id = request.GET.get('id')
        user = get_user_by_token(request)
        data = []
        if not user:
            return JsonResponse({'errmsg': '请先登录', 'code': 201})
        comment = json.loads(request.body.decode()).get('comment')
        if not comment:
            return JsonResponse({'errmsg': '评论不能为空', 'code': 400})
        else:
            comment = Comment.objects.create(user=user, article_id=art_id,
                                             comment=comment)
            comment.ctime = datetime.now() + timedelta(hours=8)

            comment.save()
            comments = Comment.objects.filter(article_id=art_id)
            for comment in comments:
                dict = comment.to_dict()
                dict['username'] = user.username if user else "匿名用户"
                dict['useravatar'] = user.avatar if user else "0"
                data.append(dict)
            return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': data})


# 删除评论
class DelCommentView(View):
    def delete(self, request):
        comment_id = json.loads(request.body.decode()).get('comment_id')
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        try:
            comment = Comment.objects.get(id=comment_id, user=user)
        except Exception as e:
            return JsonResponse({"errmsg": '您不能删除别人的评论哦', 'code': 201})
        comment.is_del = 1
        comment.save()
        return JsonResponse({'errmsg': 'ok', 'code': 0})


class ReplyCommentView(View):
    def post(self, request):
        comment_id = json.loads(request.body.decode()).get('comment_id')
        reply = json.loads(request.body.decode()).get('reply_comment')
        article_id = int(json.loads(request.body.decode()).get('article_id'))
        user = get_user_by_token(request)
        comment = Comment.objects.create(user=user, parent_id=comment_id, article_id=article_id, comment=reply)
        comment.ctime = datetime.now() + timedelta(hours=8)
        comment.save()
        return JsonResponse({'errmsg': 'ok', 'code': 0})


class GetMoreArticleView(View):
    def get(self, request):
        start_id = request.GET.get('start')
        max_id = request.GET.get('end')
        if start_id and max_id:
            start_id = int(start_id)
            max_id = int(max_id)
        else:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        if max_id > start_id + 10:
            article_item = Article.objects.filter(id__gt=start_id)[0:10]
        else:
            article_item = Article.objects.filter(id__gt=start_id)
        if len(article_item) == 0:
            return JsonResponse({'errmsg': '没有数据了', 'code': 0, 'max_flag': 0})
        else:
            article_list = []
            for article in article_item:
                dict = article.to_dict()
                user = User.objects.get(id=article.user_id)
                dict['username'] = user.username
                article_list.append(dict)
            return JsonResponse({'errmsg': "ok", 'code': 0, "data": article_list, 'max_flag': max_id})


class HostListView(View):
    def get(self, request):
        art_item = Article.objects.order_by('-read_count').all()[0:5]
        data_list = []
        for art in art_item:
            avatar_dict = {}
            avatar_dict['avatar'] = art.avatar
            avatar_dict['id'] = art.id
            avatar_dict['title'] = art.title
            avatar_dict['time'] = art.time.strftime('%Y-%m-%d %H:%M:%S')
            data_list.append(avatar_dict)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': data_list})


class ArtByTimeView(View):
    def post(self, request):
        art_items = Article.objects.order_by("-time").all()
        time_list = []
        for art_item in art_items:
            time_list.append(art_item.time.strftime('%Y-%m'))
        if time_list:
            time_list = set(time_list)
        new_list = sorted(time_list, reverse=True)
        appoint_time = json.loads(request.body.decode()).get('time')
        if not appoint_time:
            '''没传递指定时间'''
            time_string = new_list[0]
        else:
            ''''传递了指定的时间'''
            time = appoint_time.replace('年', '-')
            time_string = time.replace('月', '')
        datetime_struct = parser.parse(time_string) - timedelta(days=3)
        time_delta = datetime_struct + timedelta(days=30)
        art_by_items = Article.objects.filter(time__lte=time_delta, time__gte=datetime_struct)
        art_by_time_list = []
        for art in art_by_items:
            dict = art.to_dict()
            dict['channel1'] = dict.pop('channel')
            dict['channel2'] = 'java'
            dict['channel3'] = '爱生活'
            art_by_time_list.append(dict)
        time_data = []
        for time in new_list:
            time_data.append({'time': time.replace('-', '年') + "月"})
        if not appoint_time:
            return JsonResponse({'errmsg': 'ok', 'code': 0, 'time_items': time_data, "art_items": art_by_time_list})
        else:
            return JsonResponse({'errmsg': 'ok', 'code': 1, "art_items": art_by_time_list})


class ToMyCommentView(View):
    def get(self, request):
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        my_art_item = Article.objects.filter(user=user)
        my_art_id = []
        for art in my_art_item:
            my_art_id.append(art.id)
        if not user:
            return JsonResponse({'errmsg': '登陆已失效,请重新登陆', 'code': 201})
        items = Comment.objects.filter(article_id__in=my_art_id, is_del=0)
        comment_items = []
        for comment in items:
            comment_items.append({
                'article': comment.article.id,
                "title": comment.article.title,
                'username': comment.user.username,
                'time': comment.ctime.strftime('%Y-%m-%d %H:%M:%S'),
                'comment': comment.comment,
                'comment_id': comment.id,

            })
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'comment_items': comment_items})


class AdminDelCommentView(View):
    def delete(self, request):
        comment_id = json.loads(request.body.decode()).get('comment_id')
        user = get_user_by_token(request)
        if not user:
            return JsonResponse({'errmsg': '缺少参数', 'code': 400})
        try:
            comment = Comment.objects.get(id=comment_id)
        except Exception as e:
            return JsonResponse({"errmsg": '服务器异常', 'code': 201})
        comment.is_del = 1
        comment.save()
        return JsonResponse({'errmsg': 'ok', 'code': 0})


class ArtByClassifyView(View):
    def post(self, request):
        # 侧边栏
        classify_items = Classify.objects.all()
        classify_list = []
        for classify in classify_items:
            classify_list.append({
                'id': classify.id,
                'name': classify.name
            })
        dict = json.loads(request.body.decode())
        classify = dict.get('classify')
        if not classify:
            classify = Classify.objects.get(name='前端开发')
        else:
            # 传递了参数
            classify = Classify.objects.get(name=classify)
        art_items = Art_Class.objects.filter(classify=classify)
        art_items_list = []
        for art_classify in art_items:
            dict = art_classify.article.to_dict()
            try:
                new_classify = Art_Class.objects.filter(article=art_classify.article)
                i = 1
                for classify_item in new_classify:
                    dict['classify_%s' % i] = classify_item.classify.name
                    i += 1
                art_items_list.append(dict)
            except Exception as e:
                pass
        return JsonResponse(
            {"errmsg": "ok", 'code': 0, 'art_items': art_items_list, 'classify_items': classify_list})


class LocalArticleView(View):
    def get(self, request, article_id):
        article = Article.objects.get(id=article_id)
        dict = {
            "id": article.id,
            'title': article.title,
            'username': article.user.username,
            'content': article.content
        }
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'local_items': [dict]})
