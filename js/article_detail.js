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
     }
 }


 var app = new Vue({
     el:"#app",
     data:{
        host:"http://127.0.0.1:8000",
        // chanel:"",
        items:[],
     }, 
     mounted:function(){
        id = window.location.search
        this.get_article_info()
    },
    methods:{
        get_article_info:function(){
            axios.get(this.host+'/article'+id,{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true, 
            })
            .then(response=>{
                if (response.data.code==0){
                    this.items = response.data.data  
                }
                else{
                    alert(response.data.errmsg)
                }
            })
            },
            follow:function(){
                axios.get(this.host+'/follow'+id,{
                    responseType:'json',
                    changeOrigin: true,
                    withCredentials:true,
                })
                .then(response=>{
                    if (response.data.code==0){
                        alert('点赞成功')
                        this.items = response.data.data  
                    }
                    else{
                        alert(response.data.errmsg)
                    }

                })
        },
        money:function(){
            alert('打赏请打到支付宝15655229707,一毛也是情,一毛也是爱,请用金钱砸死我')
        } 
    }
 }) 