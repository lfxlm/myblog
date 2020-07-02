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