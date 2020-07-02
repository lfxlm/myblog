var test = function () {
    var t1 = document.getElementById("t1")
    var t3 = document.getElementById("t3")

    if (t3.hasAttribute('hidden')) {
        t3.removeAttribute('hidden')
    }
    else {
        t3.setAttribute('hidden', 'hidden')
    }
}

var toabout = function () {
    window.location.href = 'aboutmy.html'
}
var index = function () {
    window.location.href = 'index.html'
}

var login = function () {
    var username = getCookie('username')
    if (username == null) {
        alert("您未登录,正在跳转到登陆页面")
        window.location.href = 'login.html'
    }
    else {
        window.location.href = 'detail.html'
    }
}


var app = new Vue({
    el: "#app",
    data: {
        host: "http://127.0.0.1:8000",
        // chanel:"",
        items: [],
        relate_items: [],
        token: localStorage.token,


    },
    mounted: function () {
        id = window.location.search
        this.get_article_info()
        this.get_relate_article()
    },
    methods: {
        get_article_info: function () {
            axios.get(this.host + '/article' + id, {
                responseType: 'json',
                changeOrigin: true,
                withCredentials: true,
            })
                .then(response => {
                    if (response.data.code == 0) {
                        this.items = response.data.data
                    }
                    else {
                        alert(response.data.errmsg)
                    }
                })
        },
        follow: function () {
            axios.get(this.host + '/follow' + id, {
                responseType: 'json',
                changeOrigin: true,
                withCredentials: true,
                // 设置token
                headers: {
                    'Authorization': this.token
                }
            })
                .then(response => {
                    if (response.data.code == 0) {
                        alert('点赞成功')
                        this.items = response.data.data
                    }
                    else {
                        alert(response.data.errmsg)
                    }

                })
        },
        money: function () {
            alert('打赏请打到支付宝15655229707,一毛也是情,一毛也是爱,请用金钱砸死我')
        },
        get_relate_article: function () {
            axios.get(this.host + '/relate/article' + id, {
                responseType: 'json',
                changeOrigin: true,
                withCredentials: true,
            })
                .then(response => {
                    if (response.data.code == 0) {
                        this.relate_items = response.data.data
                    }
                    else {
                        alert("网络异常")
                    }
                })
        },
        to_article: function (id) {
            window.location.href = 'article_detail.html?id=' + id
        }
    }
})
var new_app = new Vue({
    el: '#new_app',
    data: {
        host: "http://127.0.0.1:8000",
        isShow: true,
        isshow_del: true,
        commont_items: [],
        token: localStorage.token,
        comment: '',
        isdelshow: true,
        show_reply:false,
        reply_comment:'',
        index:""
    },
    mounted: function () {
        id = window.location.search
        this.get_commont()
    },
    methods: {
        get_commont: function () {
            axios.get(this.host + '/commonts' + id, {
                responseType: 'json',
                changeOrigin: true,
                withCredentials: true,
                // 设置token
                headers: {
                    'Authorization': this.token
                }
            })
                .then(response => {
                    if (response.data.code == 0) {
                        this.commont_items = response.data.data
                        this.isShow = false
                    }
                    else {
                        alert(response.data.errmsg)
                    }
                })
        },
        sendcomment: function () {
            axios.post(this.host + '/add_comment' + id, {
                comment: this.comment
            }, {
                responseType: 'json',
                changeOrigin: true,
                withCredentials: true,
                // 设置token
                headers: {
                    'Authorization': this.token
                }
            })
                .then(response => {
                    if (response.data.code == 0) {
                        // window.location.href='article_detail.html'+id
                        window.location.reload();
                    }
                    else {
                        alert(response.data.errmsg)
                    }
                })
        },
        // 删除我的评论
        del_my_comment: function (id) {
            axios.delete(this.host + '/del_comment', {
                headers: {
                    'Authorization': this.token
                },
                data: {
                    comment_id: id,

                }

            },
                {
                    responseType: 'json',
                    changeOrigin: true,
                    withCredentials: true,
                    // 设置token
                    

                })
                .then(response => {
                    if (response.data.code == 0) {
                        alert('删除成功')
                        window.location.reload();
                    }
                    else {
                        alert(response.data.errmsg)
                    }
                })


        },
        // 取消评论
        resetcomment: function () {
            this.comment = ''
        },
        //  回复评论
        recvecomment: function (com_id) {
            axios.post(this.host+'/reply',{
                comment_id:com_id,
                article_id:id.split('=')[1],
                reply_comment:this.reply_comment
            },{
                responseType: 'json',
                changeOrigin: true,
                withCredentials: true,
                headers: {
                    'Authorization': this.token
                }
            })
            .then(response=>{
                if(response.data.code==0){
                    window.location.reload();
                }
                else{
                    alert(response.data.errmsg)
                }
            })
        },
        show_reply_box:function(index){
            if(this.show_reply==false){
                this.index = index
                this.show_reply=true
            }
            else{
                this.index = index
                this.show_reply=false
            }
        },
        is_show_reply_comment:function(dict){
            if(dict!=null){
                return true
            }
            else{
                return false
            }
        },
        cant:function(){
            alert('暂未开通此功能')
        }
    }
})