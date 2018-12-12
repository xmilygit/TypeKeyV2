<template>
  <div id="app">
    <mynavbar
      ref="navbar_c"
      @loginevent="islogin"
      @openlessonEvent="openlesson"
      @execlessonEvent="execlesson"
      @showtraningrecord="opentraningrecord"
      @showtraningrank="opentraningrank"
    ></mynavbar>
    <myalert ref="alert_c"></myalert>
    <myloading ref="loading_c"></myloading>
    <!-- <myadminlesson @displayLoading="showloading" @displayAlert="showalert" ref="addlesson"></myadminlesson> -->
    <mytklessonlist ref="lessonmanage"></mytklessonlist>
    <trainingrecordlist ref="trainingrecordlist"></trainingrecordlist>
    <trainingranlist ref="trainingranklist" @showrank="opentraningrank" :user="user" :rank="rank"></trainingranlist>
    <b-modal
      id="modal1"
      title="练习成绩"
      v-model="modalshow"
      cancel-title="取消"
      ok-title="保存成绩"
      @cancel="gotoReady"
      @ok="gotoReady"
      :ok-disabled="!userislogin"
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
          <img src="./assets/kp.jpg" style="margin-top:30px;">
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
      <!-- <b-button @click="testother">setsession</b-button>
      <b-button @click="testgetsession">getsession</b-button> -->
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
import trainingranlist from "./components/trainingrankList.vue";

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
      modalshow: false,
      result: 0,
      user: null,
      userislogin: false,
      lessonname: "",
      rank: null
    };
  },
  components: {
    mynavbar,
    myloading,
    myalert,
    trainingrecordlist,
    mytklessonlist,
    trainingranlist
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
    islogin(val) {
      this.user = val;
      if (val) {
        this.userislogin = true;
      } else {
        this.userislogin = false;
      }
    },
    gotoReady(evt) {
      console.log(evt);
      if (this.userislogin && evt.trigger != "cancel") this.saverecord();
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
    training(traiStr) {
      //console.log(this);
      this.wordCount = this.str.length;
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
      let tempstr = this.str.substring(begin, end).toUpperCase();
      while (tempstr.length < 12) {
        tempstr = tempstr + " ";
      }
      this.typeKeys = tempstr;

      for (var i = 0; i < this.$refs.keyStyle.length; i++) {
        this.$refs.keyStyle[i].className = "btn keybutton btn-secondary";
      }
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
        if (begin == this.wordCount) {
          time_begin = false;
          window.removeEventListener("keypress", this.whenKeyPress);
          this.modalshow = true; //$.myMethod.showResult();
          return;
        }
        this.getNewRow(begin, end);
      }
    },
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
    saverecord() {
      let user = this.$refs.navbar_c.user;
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
        .post("/sys/addtkrecord", { record: record, token: user.token })
        .then(this.saveingrecord)
        .catch(function(err) {
          self.showloading();
          self.showalert("系统错误，保存失败！：" + err.message, "danger");
        });
    },
    saveingrecord(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert("保存失败！错误原因：" + res.data.message, "danger");
        return;
      }
      this.showalert("保存成功！", "success", 3);
    },
    showloading(message, show) {
      message = message || "正在保存...";
      this.$refs.loading_c.title = message;
      if (show) this.$refs.loading_c.showloading();
      else this.$refs.loading_c.hidderloading();
    },
    showalert(message, variant, dismissSecs) {
      message = message || "保存成功！";
      variant = variant || "success";
      dismissSecs = dismissSecs || 10;
      this.$refs.alert_c.message = message;
      this.$refs.alert_c.variant = variant;
      this.$refs.alert_c.dismissSecs = dismissSecs;
      this.$refs.alert_c.showAlert();
    },
    openlesson() {
      this.$refs.lessonmanage.modalshow = true;
    },
    execlesson(index) {
      this.lessonname = this.$refs.navbar_c.lessonlist[index].lessonname;
      this.showloading("正在加载课程数据...", true);
      axios
        .get(
          "/sys/getlessonbyid?id=" + this.$refs.navbar_c.lessonlist[index]._id
        )
        .then(this.execinglesson)
        .catch(function(err) {
          this.showalert("系统错误！错误原因：" + err.message, "danger");
        });
    },
    execinglesson(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert("加载课程失败！错误原因：" + res.data.message, "danger");
        return;
      }
      this.str = res.data.result.lessoncontent;
    },
    opentraningrecord() {
      let user = this.$refs.navbar_c.user;
      if (!user) {
        this.showalert("请先登录!", "info", 5);
        return;
      }
      let self = this;
      this.showloading("正在加载数据...", true);
      axios
        .get(
          "/sys/gettkrecord?lesson=" + this.lessonname + "&token=" + user.token
        )
        .then(this.gettkrecord)
        .catch(function(err) {
          self.showloading();
          self.showalert(err.message, "danger");
        });
    },
    opentraningrank(eventtype) {
      let self = this;
      this.showloading("正在加载数据...", true);
      this.rank = "成绩排名";
      let querypath = "/sys/gettkrecordrank?lesson=" + this.lessonname;
      let rankpath = undefined;
      if (this.user) {
        switch (eventtype) {
          case "class":
            this.rank = "您当前课程的班级排名为：第rankstr名！";
            rankpath =
              "/sys/getuserrankbyclass?token=" +
              this.user.token +
              "&lesson=" +
              this.lessonname +
              "&classno=" +
              this.user.info.baseinfo.classno;
            querypath =
              "/sys/gettkrecordrankbyclass?lesson=" +
              this.lessonname +
              "&classno=" +
              this.user.info.baseinfo.classno +
              "&token=" +
              this.user.token;
            break;
          case "school":
          //   querypath=
          //   break;
          default:
            rankpath =
              "/sys/getuserrankbyschool?token=" +
              this.user.token +
              "&lesson=" +
              this.lessonname;
            this.rank = "您当前课程的全校排名为：第rankstr名！";
            break;
        }
      } else {
      }

      axios
        .get(querypath)
        .then(this.gettkrecordrank)
        .catch(function(err) {
          self.showloading();
          self.showalert(err.message, "danger");
        });
      if (rankpath) {
        axios
          .get(rankpath)
          .then(this.showuserrank)
          .catch(function(err) {
            self.showalert(err.message, "danger");
          });
      }
    },

    gettkrecord(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert(res.data.message);
        return;
      }
      this.$refs.trainingrecordlist.modalshow = true;
      this.$refs.trainingrecordlist.items = res.data.result;
      this.$refs.trainingrecordlist.totalrows = this.$refs.trainingrecordlist.items.length;
    },
    gettkrecordrank(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert(res.data.message, "info");
        return;
      }
      console.log(res.data.result);
      this.$refs.trainingranklist.modalshow = true;
      this.$refs.trainingranklist.items = res.data.result;
      this.$refs.trainingranklist.totalrows = this.$refs.trainingranklist.items.length;
    },
    showuserrank(res) {
      if (res.data.error) {
        this.showalert(res.data.message, "info");
        return;
      }
      this.rank = this.rank.replace("rankstr", res.data.result[0].rank);
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
          "/sys/getuserrankbyschool?token=" +
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
