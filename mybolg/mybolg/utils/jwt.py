import datetime

import jwt
from django.http import JsonResponse

from mybolg.settings import SECRET_KEY
from user.models import User


def generate_jwt(user_id):
    '''生成jwt'''
    payload = {
        'exp': datetime.datetime.now() + datetime.timedelta(days=14),
        'data': {"user_id": user_id}
    }
    token = jwt.encode(payload, SECRET_KEY).decode()
    return token


def verify_jwt(token):
    try:
        data = jwt.decode(token, SECRET_KEY)
    except Exception as e:
        return None
    return data


def get_user_by_token(request):
    token = get_token(request)
    data = verify_jwt(token)
    if data:
        user_id = data.get('data').get('user_id')
        user = User.objects.get(id=user_id)
        return user
    else:
        return None


def get_token(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    if not token:
        return None
    return token
