<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">键盘指法练习</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="#" @click="$emit('showtraningrecord')" v-show="user">我的成绩列表</b-nav-item>
        <b-nav-item href="#" @click="$emit('showtraningrank')">查看排名</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="课程选择" right>
          <b-dropdown-item
            v-for="(item,index) in lessonlist"
            :key="index"
            @click="$emit('execlessonEvent',index)"
          >{{item.lessonname}}</b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- <b-nav-form v-if="!login" @submit="signin"> -->
        <b-nav-form v-if="!user" @submit="signin">
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
              v-show="showsigninloading"
              src="src/assets/loading.gif"
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
          <!--  -->
        </b-nav-form>
        <b-nav-item-dropdown right v-else>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{user.info.username}}</em>
          </template>
          <b-dropdown-item v-show="user?user.info.admin:false" href="#" @click="$emit('openlessonEvent')">修改课程</b-dropdown-item>
          <b-dropdown-item href="#" @click="$emit('signout')">退出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>


<script>
export default {
  data() {
    return {
    };
  },
  props:['lessonlist','showsigninloading','logintip','user'],

  methods: {
     signin(evt) {
      evt.preventDefault();
      let userinfo={
        username:this.$refs.username.localValue,
        password:this.$refs.password.localValue
      }
      this.$emit('signin',userinfo)
    },
    logintipshow() {
      setTimeout(() => {
        this.logintip.status = false;
      }, 5000);
    },
  }
};
</script>
