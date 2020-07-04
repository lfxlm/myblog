from datetime import datetime, timedelta

from django_redis import get_redis_connection


def add_history(user_id, article_id):
    redis_conn = get_redis_connection('history')
    pl = redis_conn.pipeline()
    # 去重
    # 改成hash存储,保存时间
    pl.lrem('history_%s' % user_id, 0, article_id)
    # 存储
    pl.lpush('history_%s' % user_id, article_id)
    pl.set('%s:%s' % (user_id, article_id), (datetime.now()+timedelta(hours=8)).strftime('%Y-%m-%d %H:%M:%S'))
    pl.execute()
