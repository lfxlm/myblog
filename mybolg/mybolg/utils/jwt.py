import jwt

from mybolg.settings import SECRET_KEY
from user.models import User


def generate_jwt(user_id):
    '''生成jwt'''
    payload = {"user_id": user_id}
    token = jwt.encode(payload, SECRET_KEY).decode()
    return token


def verify_jwt(token):
    try:
        data = jwt.decode(token, SECRET_KEY)
    except Exception as e:
        return None
    return data


def get_user_by_token(token):
    data = verify_jwt(token)
    if data:
        user_id = data.get('user_id')
        user = User.objects.get(id=user_id)
        return user
    else:
        return None


def get_token(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    return token
