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
        alert(token)
     alert("您未登录,正在跳转到登陆页面")
     window.location.href='login.html'
     }
     else {
         window.location.href='detail.html'
         // alert("当前登陆用户为:"+username)
     }
 }
 var img = function(){
     var img1 = document.getElementById("img").getElementsByTagName("img")[0]
     // alert("heh")
     // alert(img1.src)
     img1.src = "http://127.0.0.1:7890/image/2.jpg"
     
 }
 var img2 = function(){
     var img1 = document.getElementById("img").getElementsByTagName("img")[0]
     // alert("heh")
     img1.src = "http://127.0.0.1:7890/image/3.jpg"
     // alert(img1.src)
 }
 var img3 = function(){
     var img1 = document.getElementById("img").getElementsByTagName("img")[0]
     // alert("heh")
     img1.src = "http://127.0.0.1:7890/image/4.jpg"
     // alert(img1.src)
 }
 var img4 = function(){
     var img1 = document.getElementById("img").getElementsByTagName("img")[0]
     // alert("heh")
     img1.src = "http://127.0.0.1:7890/image/5.jpg"
     // alert(img1.src)
 }
 
 var line_long = function(){
     var hr = document.getElementById("chanel").getElementsByTagName("hr")[0]
     hr.style.width = '80px'
     hr.style.left = '-110px'
 }
 var line_sort = function(){
     var hr = document.getElementById("chanel").getElementsByTagName("hr")[0]
     hr.style.width = '50px'
     hr.style.left = '-125px'
 }
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
var app = new Vue({
    el:"#app",
    data:{
        items:[{'time':'2020-05-01'},{'time':'2020-05-01'},{'time':'2020-05-01'},{'time':'2020-05-01'},{'time':'2020-05-01'},{'time':'2020-05-01'}],
        art_items:[{'time':'2020-05-01','title':'测试标题','channel1':"python",'channel2':'java','channel3':'人工智能'},{'time':'2020-05-01','title':'测试标题','channel1':"python",'channel2':'java','channel3':'人工智能'},{'time':'2020-05-01','title':'测试标题','channel1':"python",'channel2':'java','channel3':'人工智能'},],
        showbule:false,
        host:"http://127.0.0.1:8000",
        token: localStorage.token,
        index:'',
        isActive:0,
    },

    
    mounted:function(){
        this.get_article_bytime()
    },
    methods:{
        show_line:function(index){
            num = parseInt(index)
            if (num==this.items.length-1){ 
                return false
            }
            else{
                return true

            }
            
        },
        choice_time:function(time){
            var time = document.getElementById("time")
            
            this.index=index
            alert(1,this.index)
        },
        get_article_bytime:function(time){
            axios.post(this.host+'/art_by_time',{
                time:time
            },{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    'Authorization': this.token
                }
            },
            )
            .then(response=>{
                if(response.data.code==0){
                    this.items = response.data.time_items
                    this.art_items = response.data.art_items
                }
                else if( response.data.code==1){
                    this.art_items = response.data.art_items
                }
                else{
                    alert(response.data.errmsg)
                }
            })
        }, 
        getMethod:function(id){
            
            window.location.href='article_detail.html?id='+id
        },
        chocie_sort:function(){
            var choice = document.getElementById("choice_id")
            var choice_box = document.getElementById("choice_box_id")
            var text_sort = document.getElementById("text_sort")
            var text_sorted = document.getElementById("text_sorted")
            if(choice.style.backgroundColor=='rgb(0, 0, 0)'||choice.style.backgroundColor==''){
                choice.style.backgroundColor='#14CF67'
                choice_box.style.left='2px'
                text_sorted.style.color='rgb(0, 0, 0)'
                text_sort.style.color='#409EFF'
                this.isActive = this.items.length-this.isActive-1
                this.items = this.items.reverse()
            }
            else{
                choice.style.backgroundColor='rgb(0, 0, 0)'
                choice_box.style.left='20px'
                text_sorted.style.color='#409EFF'
                text_sort.style.color='rgb(0, 0, 0)'
                this.isActive = this.items.length-this.isActive-1
                this.items = this.items.reverse()
            }
         },
         showblue:function(index){
             this.isActive = index

         }
    }
})

