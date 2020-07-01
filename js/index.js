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
    // axios.get('user/')
    // .then(function (response){
    //     console.log(response)
    // })
    // .catch(function (error){
    //     console.log(error);{
    //     }
    // })
    
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
        title:"第一个网页",
        username :"未知用户",
        channel:"python",
        read_count:"0",
        follow_count:"0",
        time:"2020-05-01",
        items:[],
        id:'',
    },
    mounted:function(){
        this.get_article_info()
    },
    methods:{
        get_article_info:function(){
            axios.get(this.host+'/articles',{
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
        } ,
        getMethod:function(id){
            
            window.location.href='article_detail.html?id='+id
        }
    }
})

var label = new Vue({
    el:"#label",
    data:{
        host:"http://127.0.0.1:8000",
        new_items:[]
    },
    mounted:function(){
        this.get_hot_article()
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
        }
    }
})