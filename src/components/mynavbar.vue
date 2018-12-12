<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">键盘指法练习</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="#" @click="$emit('showtraningrecord')" v-show="login">我的成绩列表</b-nav-item>
        <b-nav-item href="#" @click="$emit('showtraningrank')">查看排名</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="课程选择" right >
          <b-dropdown-item v-for="(item,index) in lessonlist" :key="index" @click="$emit('execlessonEvent',index)">{{item.lessonname}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-form v-if="!login" @submit="signin">
          <b-form-input
            required
            size="sm"
            class="mr-sm-2"
            type="text"
            ref="username"
            placeholder="用户名"
          />
          <b-form-input
            required
            size="sm"
            class="mr-sm-2"
            type="password"
            ref="password"
            placeholder="密码"
          />
          <b-button size="sm" type="submit" class="my-2 my-sm-0" id="loginbutton">
            <img
              v-show="loading"
              src="../assets/loading.gif"
              style="width:20px;height:20px;margin-right:10px;"
            >登录
          </b-button>
          <b-popover
            disabled
            target="loginbutton"
            :show="logintip.status"
            @shown="logintipshow"
            placement="bottomleft"
          >{{logintip.message}}</b-popover>
        </b-nav-form>
        <b-nav-item-dropdown right v-else>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{user.info.username}}</em>
          </template>
          <b-dropdown-item v-show="isadmin" href="#" @click="$emit('openlessonEvent')">修改课程</b-dropdown-item>
          <b-dropdown-item href="#" @click="signout">退出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>


<script>
import axios from "axios";
axios.defaults.baseURL = "http://192.168.123.151:3000";
export default {
  data() {
    return {
      isadmin:undefined,
      login: false,
      loading: false,
      user:null,
      //userinfo: {
      //  username: "",
      //  password: "",
      //  id: ""
      //},
      ///userotherinfo:{},
      logintip: {
        status: false,
        message: "default"
      },
      lessonlist: [{ lessonname: "正在加载数据..." }]
    };
  },
  mounted() {
    console.log(sessionStorage.getItem("user"))
    let user=JSON.parse(sessionStorage.getItem("user"));
    let self = this;    
    if (user) {
      axios
        .post("/sys/validsignin", { token: user.token })
        .then(this.getusercache)
        .catch(function(error) {
          self.login = false;
          self.user=null
          sessionStorage.removeItem('user')
        });
    }
    axios
      .get("/sys/getalltklesson")
      .then(this.getlessonlist)
      .catch(function(error) {});
  },
  watch: {
    login: function() {
      //this.$emit("loginevent", this.login);
      this.isadmin=this.user?this.user.info.admin:false;
      this.$emit('loginevent',this.user)
    }
  },
  methods: {
    //刷新页面后获取session中的用户信息
    getusercache(res) {
      if (res.data.signin) {
        // this.userinfo.username = res.data.userinfo.username;
        // this.userinfo.id = res.data.userinfo.id;
        // this.userotherinfo=res.data.userotherinfo;
        this.user=JSON.parse(sessionStorage.getItem('user'));
        this.login = true;
        return;
      } else {
        if(this.user){
          this.user=null
          sessionStorage.removeItem('user')
        }
        this.login = false;
      }
    },
    //获取课程列表
    getlessonlist(res) {
      if (res.data.error) {
        //alert错误
        console.log(res.data.message);
        retrun;
      }
      this.lessonlist = res.data.lessonlist;
      this.$emit('execlessonEvent',0);
    },
    signin(evt) {
      evt.preventDefault();
      this.loading = true;
      let self = this;
      let userinfo={
        username:this.$refs.username.localValue,
        password:this.$refs.password.localValue
      }
      axios
        .post("/sys/login", userinfo)
        .then(function(res) {
          self.loading = false;
          if (res.data.error) {
            self.logintip.message = res.data.message;
            self.logintip.status = true;
            return;
          }
          console.log(res.data)
          self.user={
            token:res.data.token,
            info:res.data.userinfo,
          };
          sessionStorage.setItem("user", JSON.stringify(self.user));
          self.login = true;
          console.log(self.user)
          //self.userinfo = res.data.userinfo;
          // self.userotherinfo=res.data.userotherinfo;
        })
        .catch(function(err) {
          self.loading = false;
          self.logintip = { status: true, message: "系统故障：" + err.message };
        });
    },
    signout() {
      sessionStorage.removeItem("user");
      this.user=null
      this.login = false;
      //this.userinfo.username = "";
      // this.userinfo.password = "";
      // this.userotherinfo={};
    },
    logintipshow() {
      setTimeout(() => {
        this.logintip.status = false;
      }, 5000);
    },
    testevent(a,b,c){
      console.log(a);
      console.log(b)
      for (var i in arguments) {
        alert(arguments[i]);
    }
    }
  }
};
</script>
