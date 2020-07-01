from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views import View

from article.models import Article, Relation
from user.models import User


class ArticleListView(View):
    # 首页文章列表展示
    def get(self, request):
        article_items = Article.objects.order_by('-follow_count').all()
        article_list = []
        for article in article_items:
            dict = article.to_dict()
            user = User.objects.get(id=article.user_id)
            dict['username'] = user.username
            article_list.append(dict)
        return JsonResponse({'errmsg': "ok", 'code': 0, "data": article_list})


class HostArticleView(View):
    # 热门文章图片标题展示
    def get(self, request):
        art_item = Article.objects.order_by('-read_count').all()[0:2]
        avatar_dict = {}
        i = 1
        data_list = []
        for art in art_item:
            avatar_dict['avatar%d' % i] = art.avatar
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
        user = User.objects.get(id=art.user_id)
        dict = art.to_dict()
        dict['username'] = user.username
        list = []
        list.append(dict)
        return JsonResponse({'errmsg': 'ok', 'code': 0, 'data': list})


class ArticleFollowView(View):
    def get(self, request):
        username = request.COOKIES.get('username')
        art_id = request.GET.get('id')
        art = Article.objects.get(id=art_id)
        if not username:
            return JsonResponse({'errmsg': '请先登录哦', 'code': 201})
        else:
            user = User.objects.get(username=username)
            if not user:
                return JsonResponse({'errmsg': '用户不存在', 'code': 201})
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
        dict['username'] = user.username
        list = []
        list.append(dict)

        return JsonResponse({"errmsg": 'ok', 'code': 0, 'data': list})
