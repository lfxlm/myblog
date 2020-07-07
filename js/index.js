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
var app = new Vue({
    el:"#app",
    data:{
        host:"http://127.0.0.1:8000",
        mobile:'',
        password:'',
    },
    methods:{
        on_submit:function(){
            axios.post(this.host+'/login/',{
                mobile:this.mobile,
                password:this.password,
            },
            {
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
            })
            .then(response =>{
                if (response.data.code==0){
                    alert(response.data.errmsg)
                    // 保存token
                    localStorage.setItem("username", response.data.data.username)
                    localStorage.setItem("token", response.data.data.token)
                    // localStorage.setItem("avatar", response.data.data.avatar)
                    // alert(response.data.data.token)
                    window.location.href='index.html'
                }
                else{
                    alert(response.data.errmsg)
                }
                
            })
        }
    }
   

})

var new_app = new Vue({
    el:"#art_app",
    data:{
        host:"http://127.0.0.1:8000",
        token: localStorage.token,
        title:"第一个网页",
        username :"未知用户",
        channel:"python",
        read_count:"0",
        follow_count:"0",
        time:"2020-05-01",
        items:[],
        local_items:[{"title":"这是一条标题",'username':'liufei','content':'这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容'}],
        id:'',
        flag:'',
        showno:false,
        show_article_info:false,
        get_local_article:'',
        float:0

    },
    mounted:function(){
        this.get_article_info()
    },
    methods:{
        Float:function(index){
            this.float=index
        },
        NotFloat:function(index){
            this.float=-1
        },
        get_article_info:function(){
            axios.get(this.host+'/articles',{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true, 
            })
            .then(response=>{
                if (response.data.code==0){
                    this.items = response.data.data
                    this.flag = response.data.max_flag
                }
                else{
                    alert(response.data.errmsg)
                }
            })
        } ,
        getMethod:function(id){
            
            window.location.href='article_detail.html?id='+id
        },
        load_many:function(final_id){
            if (final_id<this.flag-1){
                return true
            }
            else{
                this.showno=true
                return false
            }
            
        },
        load_many_article:function(start_id){
            axios.get(this.host+'/articles/?start='+start_id+'&end='+this.flag,{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true, 
            })
            .then(response=>{
                if(response.data.code==0){
                    // this.items = response.data.data
                    let items = {}
                    items = this.items.concat(response.data.data)
                    this.items = items
                    this.flag = response.data.max_flag
                }
                else{
                    alert(response.data.errmsg)
                }
            })
        },
        get_articl_info:function(artcile_id){
            var that = this
            timer = setTimeout(function(){
                that.show_article_info=true
                    axios.get(that.host+'/localarticle/'+artcile_id,{
                        responseType:'json',
                        changeOrigin: true,
                        withCredentials:true,  
                        headers: {
                            'Authorization': this.token
                        }
                       })
                       .then(resposne=>{
                           if(resposne.data.code==0){
                               that.local_items = resposne.data.local_items
                           }
                           else{
                               alert(resposne.data.errmsg)
                           }
                       })
            },300)
            
        },
        not_get_articl_info:function(artcile_id){
            clearTimeout(timer)
            // this.show_article_info=false
        },
        close_local_box:function(){
            this.show_article_info=false
        }
    }
})

var label = new Vue({
    el:"#label",
    data:{
        host:"http://127.0.0.1:8000",
        new_items:[],
        host_items:[{'title':'Ces','time':'2020-06-01'},{'title':'Ces','time':'2020-06-01'},{'title':'Ces','time':'2020-06-01'},{'title':'Ces','time':'2020-06-01'},{'title':'Ces','time':'2020-06-01'}]

    },
    mounted:function(){
        this.get_hot_article()
        this.get_hot_list()
    },
    methods:{
        get_hot_article:function(){
            axios.get(this.host+'/host/articles',{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
            })
            .then(response=>{
                if (response.data.code==0){
                    this.new_items = response.data.data
                }
                else{
                    alert(response.data.errmsg)
                }
                
            })
        },
        getMethod:function(id){
            
            window.location.href='article_detail.html?id='+id
        },
        get_hot_list:function(){
            axios.get(this.host+'/hotlist',{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
            })
            .then(response=>{
                if (response.data.code==0){
                    this.host_items = response.data.data
                }
                else{
                    alert(response.data.errmsg)
                }

            })
        },
       
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

