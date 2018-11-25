<template>
<b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">键盘指法练习</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">

    <b-navbar-nav>
      <b-nav-item href="#">Link</b-nav-item>
      <b-nav-item href="#">Disabled</b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown text="课程选择" right>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-form v-if="!login" @submit='signin'>
        <b-form-input required size="sm" class="mr-sm-2" type="text" v-model.trim="userinfo.username" placeholder="用户名"/>
        <b-form-input required size="sm" class="mr-sm-2" type="password" v-model="userinfo.password" placeholder="密码"/>
        <b-button size="sm" type="submit" class="my-2 my-sm-0" id="loginbutton"><img v-show="loading" src="../assets/loading.gif" style="width:20px;height:20px;margin-right:10px;" />登录</b-button>
        
        <b-popover disabled target="loginbutton" :show="logintip.status" @shown="logintipshow"  placement="bottomleft">
        {{logintip.message}}    
        </b-popover>
      </b-nav-form>

      

      <b-nav-item-dropdown right v-else>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em>{{userinfo.username}}</em>
        </template>
        <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
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
      login: false,
      loading: false,
      userinfo: {
        username: "",
        password: "",
        id:""
      },
      logintip: {
        status: false,
        message: "default"
      }
    };
  },
  mounted() {
    //console.log("asfaf"+sessionStorage.getItem('token'))
    let token = sessionStorage.getItem("token");
    console.log("token:" + token);
    let self = this;
    if (token) {
      axios
        .post("/sys/validsignin", { token: token })
        .then(function(res) {
          if (res.data.signin) {
            console.log(res.data);
            self.userinfo.username = res.data.userinfo.username;
            self.userinfo.id=res.data.userinfo.id;
            self.login = true;
            return;
          } else {
            self.login = false;
          }
        })
        .catch(function(error) {
          self.login = false;
        });
    }
  },
  watch:{
    login:function(){
      this.$emit('loginevent',this.login)
    }
  },
  methods: {
    signin(evt) {
      evt.preventDefault();
      this.loading = true;
      let self = this;
      //axios.post('',{
      //method:'POST',
      //url:'',
      //data:self.userinfo
      //})
      axios
        .post("/sys/login", self.userinfo)
        .then(function(res) {
            self.loading = false;
          if (res.data.error) {
            self.logintip.message = res.data.message;
            self.logintip.status = true;
            return;
          }
          sessionStorage.setItem("token", res.data.token);
          self.login = true;
          selft.userinfo=res.data.userinfo;
        })
        .catch(function(err) {
          self.loading = false;
          self.logintip = { status: true, message: "系统故障：" + err.message };
        });
    },
    signout() {
      sessionStorage.removeItem("token");
      this.login = false;
      this.userinfo.username = "";
      this.userinfo.password = "";
    },
    logintipshow() {
      setTimeout(() => {
        this.logintip.status = false;
      }, 5000);
    }
  }
};
</script>
