<template>
  <div id="app">
    <mynavbar
      @openlessonEvent="lessonmodalshow=true"
      @execlessonEvent="execlesson"
      @showtraningrecord="trainmodalshow=true"
      @showtraningrank="rankmodalshow=true"
      @signin="signin"
      @signout="signout"
      :user="user"
      :showsigninloading="showsigninloading"
      :lessonlist="lessonlist"
      :logintip="logintip"
    ></mynavbar>
    <myalert :show="alertshow" :alert-info="alertinfo" @hidden="alertshow=false"></myalert>
    <myloading :title="loadbacktitle" :show="showloadingback"></myloading>
    <mytklessonlist
      :show="lessonmodalshow"
      :user="user"
      @hidden="lessonmodalshow=false"
      @showloading="showloading"
    ></mytklessonlist>
    <trainingrecordlist
      @hidden="trainmodalshow=false"
      :user="user"
      :lessonname="lessonname"
      :show="trainmodalshow"
    ></trainingrecordlist>
    <trainingranklist
      :user="user"
      :show="rankmodalshow"
      :lessonname="lessonname"
      @hidden="rankmodalshow=false"
    ></trainingranklist>
    <b-modal
      id="modal1"
      title="练习成绩"
      v-model="modalshow"
      cancel-title="取消"
      ok-title="保存成绩"
      :ok-disabled="!user"
      @hidden="gotoReady"
      @ok="saverecord"
    >
      <p class="my-4">本次练习综合成绩为：{{result}}</p>
    </b-modal>
    <b-container style="margin-top:30px;">
      <b-row style="padding-bottom:20px;">
        <b-col>
          <b-button variant="success" v-show="lessonname.length>0">
            <i class="material-icons buttonoffset">import_contacts</i>
            当前课程：{{lessonname}}
          </b-button>
          <b-button variant="success">
            <i class="material-icons buttonoffset">check</i>
            正确：{{rightCount}} 个
          </b-button>
          <b-button variant="success">
            <i class="material-icons buttonoffset">close</i>
            错误：{{errCount}} 个
          </b-button>
          <b-button variant="success">
            <i class="material-icons buttonoffset">subject</i>
            共有字符：{{wordCount}} 个
          </b-button>
          <b-button variant="success">
            <i class="material-icons buttonoffset">spellcheck</i>
            正确率：{{rightRate}} %
          </b-button>
          <b-button variant="success">
            <i class="material-icons buttonoffset">query_builder</i>
            每分钟：{{perMinute}} 个
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group>
            <b-button
              variant="secondary"
              v-for="(item,index) in typeKeys"
              :key="index"
              class="keybutton"
              ref="keyStyle"
            >
              <h2 ref="keys">{{item}}</h2>
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <img src="src/assets/kp.jpg" style="margin-top:30px;">
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button
            variant="primary"
            :disabled="countTime!='开  始'"
            @click="training(null)"
            style="width:50%"
          >
            <b>&rArr; &rArr; &rArr;</b>
            {{countTime}}
            <b>&lArr; &lArr; &lArr;</b>
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// 新增课程后课程选择列表未刷新
import mynavbar from "./components/mynavbar.vue";
import myloading from "./components/loading.vue";
import myalert from "./components/myalert.vue";
import trainingrecordlist from "./components/trainingRecordList.vue";
import mytklessonlist from "./components/tklessonlist.vue";
import trainingranklist from "./components/trainingrankList.vue";
import test from "./components/test.vue";

import axios from "axios";
var begin = 0;
var end = 12;
//var str = "qazwsxedcrfvtgbyhnujmikq"; //azwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmik";
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
      str: "",
      typeKeys: "请登录后点击开始开始练习",
      currentKeyPosition: 0,
      errCount: 0,
      rightCount: 0,
      wordCount: 0,
      perMinute: 0,
      countTime: "开  始",
      result: 0,
      modalshow: false,
      rankmodalshow: false,
      trainmodalshow: false,
      lessonmodalshow: false,
      showloadingback: false,
      alertshow: false,
      loadbacktitle: "正在保存...",
      user: null,
      lessonname: "",
      lessonlist: null,
      showsigninloading: false,
      logintip: {
        status: false,
        message: "default"
      },
      alertinfo: undefined
    };
  },
  components: {
    mynavbar,
    myloading,
    myalert,
    trainingrecordlist,
    mytklessonlist,
    trainingranklist,
    test
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
    this.whenrefresh();
    this.getlessonlist();
    window.addEventListener("keypress", this.whenKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.whenKeyPress);
  },
  methods: {
    //初始界面
    gotoReady(evt) {
      console.log(evt);
      console.log(evt.trigger);
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
      for (var i = 0; i < this.$refs.keyStyle.length; i++) {
        this.$refs.keyStyle[i].className = "btn keybutton btn-secondary";
      }
      window.addEventListener("keypress", this.whenKeyPress);
    },
    ///开始练习
    training(traiStr) {
      //console.log(this);
      this.wordCount = this.str.length;
      time_begin = true;
      this.getNewRow(begin, end);
      this.timecount();
      this.totalperMinute();
    },
    //获取下一行练习数据
    getNewRow(begin, end) {
      if (end - begin != 12) {
        alert("begin-end mast be equst 12");
        return;
      }
      let tempstr = this.str.substring(begin, end).toUpperCase();
      while (tempstr.length < 12) {
        tempstr = tempstr + " ";
      }
      this.typeKeys = tempstr;

      for (var i = 0; i < this.$refs.keyStyle.length; i++) {
        this.$refs.keyStyle[i].className = "btn keybutton btn-secondary";
      }
    },
    //当按键被按下时执行判断
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
      // debugger;
      if (this.currentKeyPosition < 11) {
        // let a1=targetKeys[this.currentKeyPosition + 1].innerText
          // let a2=targetKeys[this.currentKeyPosition + 1].innerText.replace(/\s/gi)
        if (
          targetKeys[this.currentKeyPosition + 1].innerText.replace(/\s/gi) ==
            "" ||
          targetKeys[this.currentKeyPosition + 1].innerText.replace(/\s/gi) ==
            "undefined"
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
        if (begin == this.wordCount) {
          time_begin = false;
          window.removeEventListener("keypress", this.whenKeyPress);
          this.modalshow = true; //$.myMethod.showResult();
          return;
        }
        this.getNewRow(begin, end);
      }
    },
    //统计每分钟的百分率
    totalperMinute() {
      if (time_begin) {
        let totalSecond = time_h * 3600 + time_m * 60 + time_s - 1;
        if (totalSecond != 0) {
          var temp = Math.round((this.rightCount / totalSecond) * 100) / 100;
          this.perMinute = Math.round(temp * 60 * 100) / 100;
        }

        window.setTimeout(this.totalperMinute, 5000);
      }
    },
    //计时器
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
    },
    //保存练习记录
    saverecord() {
      if (!this.user) return;
      this.showloading(null, true);
      let record = {
        lesson: this.lessonname,
        score: this.result,
        rightrate: this.rightRate,
        time: this.countTime,
        finishdate: Date.now()
      };
      let self = this;
      axios
        .post("/typekey/addtkrecord", {
          record: record,
          token: this.user.token
        })
        .then(this.saveingrecord)
        .catch(function(err) {
          self.showloading();
          self.showalert("系统错误，保存失败！：" + err.message, "danger");
        });
    },
    //保存练习记录回调
    saveingrecord(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert("保存失败！错误原因：" + res.data.message, "danger");
        return;
      }
      this.showalert("保存成功！", "success", 3);
    },
    //显示loading
    showloading(message, show) {
      message = message || "正在保存...";
      this.loadbacktitle = message;
      if (show) this.showloadingback = true;
      else this.showloadingback = false;
    },
    //显示提示
    showalert(message, variant, dismissSecs) {
      this.alertinfo = {
        variant: variant || "success",
        dismissSecs: dismissSecs || 10,
        message: message || "保存成功！"
      };
      this.alertshow = true;
    },
    //加载课程
    execlesson(index) {
      this.lessonname = this.lessonlist[index].lessonname;
      this.showloading("正在加载课程数据...", true);
      let self = this;
      axios
        .get("/typekey/getlessonbyid?id=" + this.lessonlist[index]._id)
        .then(this.execinglesson)
        .catch(function(err) {
          self.showloading();
          self.showalert("系统错误！错误原因：" + err.message, "danger");
        });
    },
    //加载课程回调
    execinglesson(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert("加载课程失败！错误原因：" + res.data.message, "danger");
        return;
      }
      this.str = res.data.result.lessoncontent;
    },

    //获取所有课程
    getlessonlist() {
      this.showloading("正在加载数据...", true);
      let self = this;
      axios
        .get("/typekey/getalltklesson?sort=-sq")
        .then(this.getlessonlist_cb)
        .catch(function(error) {
          self.showloading();
          self.showalert("加载课程失败！错误原因：" + error, "danger");
        });
    },
    //获取所有课程回调
    getlessonlist_cb(res) {
      this.showloading();
      if (res.data.error) {
        console.log(res.data.message);
        retrun;
      }
      this.lessonname = res.data.lessonlist[0].lessonname;
      this.lessonlist = res.data.lessonlist;
      this.execlesson(0);
    },
    //用户登录
    signin(userinfo) {
      let self = this;
      this.showsigninloading = true;
      axios
        .post("/sys/login", userinfo)
        .then(this.signin_cb)
        .catch(function(err) {
          self.showsigninloading = false;
          self.logintip = {
            status: true,
            message: "系统故障：" + err.message
          };
        });
    },
    //用户登录回调
    signin_cb(res) {
      this.showsigninloading = false;
      if (res.data.error) {
        this.logintip.message = res.data.message;
        this.logintip.status = true;
        return;
      }
      this.user = {
        token: res.data.token,
        info: res.data.userinfo
      };
      sessionStorage.setItem("user", JSON.stringify(this.user));
    },
    //退出用户登录
    signout() {
      sessionStorage.removeItem("user");
      this.user = null;
    },
    //当未退出刷新页面时
    whenrefresh() {
      console.log(sessionStorage.getItem("user"));
      let user = JSON.parse(sessionStorage.getItem("user"));
      let self = this;
      if (user) {
        this.showloading("加载数据...", true);
        axios
          .post("/sys/validsignin", { token: user.token })
          .then(this.whenrefresh_cb)
          .catch(function(error) {
            self.showloading();
            self.user = null;
            sessionStorage.removeItem("user");
          });
      }
    },
    //刷新页面后获取session中的用户信息回调
    whenrefresh_cb(res) {
      this.showloading();
      if (res.data.signin) {
        this.user = JSON.parse(sessionStorage.getItem("user"));
        return;
      } else {
        if (this.user) {
          this.user = null;
          sessionStorage.removeItem("user");
        }
      }
    },
    testsession() {
      sessionStorage.setItem("test", "ffff");
    },
    testgetsession() {
      sessionStorage.getItem("test");
      alert(sessionStorage.getItem("test"));
    },
    testother() {
      alert("afsfsdf");
      //axios.get('/sys/getuserrankbyclass?token='+this.user.token+'&lesson='+this.lessonname+'&classno='+this.user.info.baseinfo.classno)
      axios
        .get(
          "/typekey/getuserrankbyschool?token=" +
            this.user.token +
            "&lesson=" +
            this.lessonname
        )
        .then(function(res) {})
        .catch(function(err) {});
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
