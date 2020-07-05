var toabout = function(){
    window.location.href='aboutmy.html'
}
var index = function(){
    window.location.href='index.html'
    }
var toclassify=function(){
    window.location.href='classify.html'
}
var tosort=function(){
    window.location.href='sort.html'
}
var tochanel=function(){
    window.location.href='chanel.html'
}
var tomessage=function(){
    window.location.href='message.html'
}
var login = function(){
    var  token = localStorage.token
    if (token ==null){
    alert("您未登录,正在跳转到登陆页面")
    window.location.href='login.html'
    }
    else {
        window.location.href='detail.html'
        // alert("当前登陆用户为:"+username)
    }
}



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
        index:"",
        isShowReply:'haha'
    },
    mounted: function () {
        // id = window.location.search
        this.get_commont()
    },
    methods: {
        get_commont: function () {
            axios.get(this.host + '/messages' , {
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
            // alert('发送')
            if(this.comment.length==0){
                alert('评论不能为空')
            }
            else{
                axios.post(this.host + '/add_message', {
                    message: this.comment
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
            }
           
        },
        // 删除我的评论
        del_my_message: function (id) {
            axios.delete(this.host + '/del_message', {
                headers: {
                    'Authorization': this.token
                },
                data: {
                    message_id: id,

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
            this.reply_comment = ''
            this.show_reply=false
            this.isShowReply = 'haha'
        },
        //  回复评论
        recvecomment: function (message_id) {
            axios.post(this.host+'/reply_message',{
                message_id:message_id,
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
        },
        reply:function(index){
           if(this.isShowReply=='haha'){
            this.isShowReply = index 
           }
           else{
               this.isShowReply = 'haha'

           }
            
        },
        show_reply_test:function(index){
            if(this.isShowReply==index){
                return true
            }
            else{
                return false
            }
        }
    }
})
var isshowlogout = new Vue({
    el:"#banner",
    data:{ 
        host:"http://127.0.0.1:8000",
        isshowlogout:false,
        token: localStorage.token,
    },
    methods:{
        showlogout:function(){
           
            this.isshowlogout=true
        },
        notshowlogout:function(){
            setTimeout(()=>{
                this.isshowlogout=false
            },1500)
            
        },
        logout:function(){
            axios.post(this.host+'/logout',{},{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    'Authorization': this.token
                }

            })
            .then(response=>{
                if (response.data.code==0){
                    localStorage.removeItem("token")
                    localStorage.removeItem("username")
                    alert('退出登陆成功')
                    window.location.reload();
                }
                else{
                    alert(response.data.errmsg)
                }
            })
        }
    }

})