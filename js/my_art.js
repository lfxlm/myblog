var test = function (){
    var t1 = document.getElementById("t1")
    var t3 = document.getElementById("t3")
    
   if(t3.hasAttribute('hidden')){
        t3.removeAttribute('hidden')
   }
   else{
    t3.setAttribute('hidden','hidden')
   }
 }



var app = new Vue({
    el:"#app",
    data:{
        host:"http://127.0.0.1:8000",
        mobile:"",
        username:"",
        info:"",
        gender:"",
        token: localStorage.token,
    },
    mounted:function(){
        this.getUserInfo()
    },
    methods:{
        getUserInfo:function(){
            axios.get(this.host+"/user/info",{
                headers: {
                    'Authorization': this.token
                }
            },
            {
                responseType:'json',
                changeOrigin: true,
                withCredentials:true, 
            })
            .then(response=>{
                if(response.data.code==0){
                    this.mobile = response.data.data.mobile
                    this.username = response.data.data.username
                    this.info = response.data.data.info
                    this.gender = response.data.data.gender
                }
                else{
                    alert(response.data.errmsg)
                }
                    
            })
        },
        alter_info:function(){
            alert("还没实现")
        }
    }

    
}) 

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
    var  username = getCookie('username')
    if (username ==null){
    alert("您未登录,正在跳转到登陆页面")
    window.location.href='login.html'
    }
    else {
        window.location.href='detail.html'
        // alert("当前登陆用户为:"+username)
    }
}


var new_app = new Vue({
    el:"#new_app",
    methods:{
        redict1:function(){
            window.location.href='detail.html'
        },
        redict2:function(){
            window.location.href='my_art.html'
        },
        redict3:function(){
            window.location.href='re_password.html'
        }
    }
})

var isshowlogout = new Vue({
    el:"#banner",
    data:{
        host:"http://127.0.0.1:8000",
        token: localStorage.token,
        isshowlogout:false,
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
                    window.location.href='login.html'
                }
            })
        }
    }

})
var get_info = new Vue({
    el:'#get_info',
    data:{
        host:"http://127.0.0.1:8000",
        token: localStorage.token,
        comment_items:[{'title': '测试数据', 'username': '17356586732', 'time': '2020-07-02 16:28:34', 'comment': '测试一下吧'}, {'title': '测试数据', 'username': '17356586732', 'time': '2020-07-02 16:53:58', 'comment': '1111'},],
        history_items:[],
        vist_items:[{'username':'lisi','time':'1234'}],
        times:10,
        isdelete:false,
        delete_comment_id:'',
        isdelete_history:false,
        history_article_id:'',
    },
    mounted:function(){
        this.get_to_my_comment()
        this.get_my_history()
        this.get_vist()
    },
    methods:{
        // 获取我的评论
        get_to_my_comment:function(){
            axios.get(this.host+'/tomycomment',{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    'Authorization': this.token
                }
            })
            .then(response=>{
                if(response.data.code==0){
                    this.comment_items = response.data.comment_items
                }
                else{
                    alert(response.data.errmsg)
                    window.location.href='login.html'
                }
            })
        },
        // 获取我的浏览历史
        get_my_history:function(){
            axios.get(this.host+'/myhistory',{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    'Authorization': this.token
                }
            })
            .then(response=>{
                if(response.data.code==0){
                    this.history_items = response.data.history_items
                }
                else{
                    alert(response.data.errmsg)
                }
            })
        },
        // 获取今日访问用户
        get_vist:function(){
            axios.get(this.host+'/today',{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    'Authorization': this.token
                }
            })
            .then(response=>{
                if(response.data.code==0){
                    this.vist_items = response.data.vist_items
                    this.times = this.vist_items.length
                }
                else{
                    alert(response.data.errmsg)
                    window.location.href='login.html'
                }
            })
        },
        to_article:function(article_id){
            window.location.href='article_detail.html?id='+article_id
        },
        delete_comment:function(comment_id){
            this.isdelete=true
            this.delete_comment_id = comment_id

        },
        not_delete:function(){
            this.isdelete=false
        },
        do_delete:function(){
            axios.delete(this.host + '/comment', {
                headers: {
                    'Authorization': this.token
                },
                data: {
                    comment_id: this.delete_comment_id,
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
                        this.isdelete=false
                        alert('删除成功')
                        window.location.reload();
                    }
                    else {
                        this.isdelete=false
                        alert(response.data.errmsg)
                    }
                })


        },
        delete_history:function(article_id){
            this.isdelete_history = true
            this.history_article_id = article_id
        },
        not_delete_history:function(){
            this.isdelete_history=false
        },
        do_delete_history:function(){
            axios.delete(this.host + '/history', {
                headers: {
                    'Authorization': this.token
                },
                data: {
                    article_id: this.history_article_id,
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
                        this.isdelete_history=false
                        alert('删除成功')
                        window.location.reload();
                    }
                    else {
                        this.isdelete_history=false
                        alert(response.data.errmsg)
                    }
                })
        }
        
    }
})
