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
        showchange:false,
        username_flag:'',
        gender_flag:'',
        info_flag:'',
        show_save_button:true,
        can_button_flag:0,
        avatar:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=204471953,2683458197&fm=26&gp=0.jpg',
        image:'',
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
                    this.avatar = response.data.data.avatar
                }
                else{
                    alert(response.data.errmsg)
                }
                    
            })
        },
        alter_info:function(){
            if(this.showchange==true){
                this.showchange=false
                // this.show_save_button=true
            }
            else{
                this.showchange=true
                // this.show_save_button=false
            }
        },
        upload_photo:function(el){
            var file = el.target.files[0];
            const param = new FormData();
            param.append('file',file)
            param.append('Authorization',this.token)
            axios.post(this.host+'/avatar',param,{
            },{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    "Content-Type": "multipart/form-data",
                    // 'Authorization': this.token,
                    }
            })
            .then(response=>{
                if(response.data.code==0){
                    this.avatar = response.data.data.avatar
                    alert('头像上传成功')
                }
                else{
                    alert('请重试一次..')
                }
            })
        },
        save_info:function(){
            if(this.can_button_flag==0){
                this.can_button_flag=1
                axios.post(this.host+'/re_user_info',{
                    username:this.username,
                    gender:this.gender,
                    info:this.info
                },
                {
                    responseType:'json',
                    changeOrigin: true,
                    withCredentials:true,
                    headers: {
                        'Authorization': this.token,
                    }
                })
                .then(response=>{
                    if(response.data.code==0){
                        this.showchange=false
                        this.mobile = response.data.data.mobile
                        this.username = response.data.data.username
                        this.info = response.data.data.info
                        this.gender = response.data.data.gender
                    }
                    else{
                        alert(response.data.errmsg)
                    }
                })
            }
            else{
                var that=this
                alert('点击的太频繁了,服务器扛不住了啊')
                setTimeout(function(){
                    that.can_button_flag=0
                },10000)
            }
           
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
var repassword = new Vue({
    el:"#repassword",
    data:{
        host:"http://127.0.0.1:8000",
        token: localStorage.token,
        old_passowrd:'',
        ishowerror:false,
        new_passowrd:'',
        re_passowrd:'',
        show_old_error:'',
        show_new_error:'',
        show_same_error:'',
        show_re_error:'',
        show_not_same_error:'',
    },
    methods:{
        sure_repassword:function(){
            axios.post(this.host+'/repassword',{
                old_passowrd:this.old_passowrd,
                new_passowrd:this.new_passowrd,
                re_passowrd:this.re_passowrd
            },{
                responseType:'json',
                changeOrigin: true,
                withCredentials:true,
                headers: {
                    'Authorization': this.token
                }
            })
            .then(response=>{
                if(response.data.code==0){
                    alert('密码修改成功,请重新登陆')
                }
                else{
                    this.ishowerror=true
                }
            })
            
        },
        blank_password:function(){
            if(this.old_passowrd==''){
                this.show_old_error=1
            }
            else{
                this.show_old_error=0
            }
        },
        blank_new_password:function(){
            if(this.new_passowrd==''){
                this.show_new_error=1
            }
            else if(this.new_passowrd==this.old_passowrd){
                this.show_same_error = 1
            }
            else{
                this.show_new_error=0
                this.show_same_error = 0
            }

        },
        blank_re_password:function(){
            if(this.re_passowrd==''){
                this.show_re_error=1
            }
            else if(this.re_passowrd!=this.new_passowrd){
                this.show_not_same_error=1
            }
            else{
                this.show_not_same_error=0
                this.show_re_error=0  
            }
        },
        reset_all_password:function(){
            this.old_passowrd=''
            this.new_passowrd=''
            this.re_passowrd=''
        }
    }
})