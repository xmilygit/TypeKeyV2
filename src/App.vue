<template>
  <div id="app">
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

  
      <b-nav-form v-if="!login"> 
        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="用户名"/>
        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="密码"/>
        <b-button size="sm" class="my-2 my-sm-0" type="submit">登录</b-button>
      </b-nav-form>
      <b-nav-item-dropdown right v-else>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em>User</em>
        </template>
        <b-dropdown-item href="#">Profile</b-dropdown-item>
        <b-dropdown-item href="#">Signout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <b-modal id="modal1" title="练习成绩" v-model="modalshow" cancel-title="取消"	ok-title="确定" @ok="gotoReady">
    <p class="my-4">本次练习综合成绩为：{{result}}</p>
  </b-modal>
    <b-container style="margin-top:30px;">
      
      <b-row style="padding-bottom:20px;">
        <b-col>
          <b-button variant="success"><i class="material-icons buttonoffset">check</i>正确：{{rightCount}} 个</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">close</i>错误：{{errCount}} 个</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">subject</i>共有字符：{{wordCount}} 个</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">spellcheck</i>正确率：{{rightRate}} %</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">query_builder</i>每分钟：{{perMinute}} 个</b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group>
          <b-button variant="secondary" v-for="(item,index) in typeKeys" :key="index" class="keybutton" ref="keyStyle"><h2 ref="keys">{{item}}</h2></b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <img src="./assets/kp.jpg" style="margin-top:30px;" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button variant="primary" :disabled="countTime!='开  始'" @click="training(null)" style="width:50%"> > > > {{countTime}} < < < </b-button>
        </b-col>
      </b-row>
      <b-button @click="gotoReady">adfaf</b-button>
    </b-container>
  </div>
</template>

<script>
var begin = 0;
var end = 12;
var str =
  "qazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmik";
//var result = 0;
var time_begin = false;
var time_h = 0;
var time_m = 0;
var time_s = 0;
var checkedInput = 0;
export default {
  name: "app",
  data() {
    return {
      typeKeys: "请登录后点击开始开始练习",
      currentKeyPosition: 0,
      errCount: 0,
      rightCount: 0,
      wordCount: 0,
      perMinute: 0,
      countTime: "开  始",
      modalshow: false,
      result: 0,
      login:false,
    };
  },
  computed: {
    rightRate: function() {
      if (this.wordCount != 0)
        return Math.round(
          ((this.wordCount - this.errCount) / this.wordCount) * 100
        );
      else return 100;
    }
  },
  watch: {
    modalshow: function() {
      let temp = (this.perMinute * this.rightRate) / 100;
      this.result = Math.round(temp * 100) / 100;
    }
  },
  mounted() {
    window.addEventListener("keypress", this.whenKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.whenKeyPress);
  },
  methods: {
    gotoReady() {
      time_h = 0;
      time_m = 0;
      time_s = 0;
      checkedInput = 0;
      begin = 0;
      end = 12;
      time_begin = false;
      this.typeKeys = "请登录后点击开始开始练习";
      this.currentKeyPosition = 0;
      this.errCount = 0;
      this.rightCount = 0;
      this.wordCount = 0;
      this.perMinute = 0;
      this.countTime = "开  始";
      this.modalshow = false;
      this.result = 0;
    },
    training(traiStr) {
      console.log(this);
      this.wordCount = str.length;
      time_begin = true;
      this.getNewRow(begin, end);
      this.timecount();
      this.totalperMinute();
    },
    getNewRow(begin, end) {
      if (end - begin != 12) {
        alert("begin-end mast be equst 12");
        return;
      }
      let tempstr = str.substring(begin, end).toUpperCase();
      while (tempstr.length < 12) {
        tempstr = tempstr + " ";
      }
      this.typeKeys = tempstr;
      /*
      var index = 0;
      for (var i = begin; i < end; i++) {
        if (i < str.length) {
          this.$refs.keys[index].innerText = str[i].toUpperCase();
        } else {
          this.$refs.keys[index].innerText = "";
        }
        this.$refs.keyStyle[index].className = "btn keybutton btn-secondary";
        index++;
      }
      */
    },
    whenKeyPress(e) {
      if (!time_begin) return;
      var key = e.which;
      var keyChar = String.fromCharCode(key).toUpperCase();
      var targetKeys = this.$refs.keys;
      var targetKeyStyle = this.$refs.keyStyle;

      if (targetKeys[this.currentKeyPosition].innerText == keyChar) {
        targetKeyStyle[this.currentKeyPosition].className =
          "btn keybutton btn-success";
        this.rightCount++;
        checkedInput = 0;
      } else {
        targetKeyStyle[this.currentKeyPosition].className =
          "btn keybutton btn-danger";
        this.errCount++;
        checkedInput++;
        if (checkedInput >= 5)
          alert(
            "你已经连续出错，请检查指法是否按要求放在基本键上，请认真练习！！！"
          );
      }
      if (this.currentKeyPosition < 11) {
        if (
          targetKeys[this.currentKeyPosition + 1].innerText.replace(/\s/gi) ==
          ""
        ) {
          time_begin = false;
          window.removeEventListener("keypress", this.whenKeyPress);
          this.modalshow = true; //$.myMethod.showResult();
          return;
        }
        this.currentKeyPosition++;
      } else {
        this.currentKeyPosition = 0;
        begin = end;
        end = begin + 12;
        this.getNewRow(begin, end);
      }
    },
    totalperMinute() {
      if (time_begin) {
        let totalSecond = time_h * 3600 + time_m * 60 + time_s - 1;
        let temp = Math.round((this.rightCount / totalSecond) * 100) / 100;
        this.perMinute = Math.round(temp * 60 * 100) / 100;
        window.setTimeout(this.totalperMinute, 5000);
      }
    },
    timecount() {
      let temp_s = "";
      let temp_m = "";
      let temp_h = "";
      if (time_begin) {
        if (time_s < 10) {
          temp_s = "0" + time_s++;
        } else {
          temp_s = time_s++;
        }
        if (time_m < 10) {
          temp_m = "0" + time_m;
        } else {
          temp_m = time_m;
        }
        if (time_h < 10) {
          temp_h = "0" + time_h;
        } else {
          temp_h = time_h;
        }
        this.countTime = temp_h + ":" + temp_m + ":" + temp_s;
        if (time_s == 60) {
          time_m++;
          time_s = 0;
        }
        if (time_m == 60) {
          time_h++;
          time_m = 0;
        }
        window.setTimeout(this.timecount, 1000);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.buttonoffset {
  vertical-align: top;
  margin-top: 2px;
  margin-right: 2px;
  font-size: 20px;
}
.keybutton {
  border-color: #cccccc;
  width: 59px;
  height: 59px;
}
</style>
