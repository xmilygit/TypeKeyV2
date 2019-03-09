<template>
  <b-modal
    id="modaltktraininglist"
    ref="modaltktraininglist"
    hide-footer
    v-model="modalshow"
    size="lg"
    @hidden="$emit('hidden')"
  >
  <template slot="modal-title">
    <span v-if="rank.indexOf('rankstr')>=0" style="line-height:20px;">正在计算您的排名...<img
              src="../assets/loading.gif"
              style="width:20px;height:20px;margin-right:10px;"
            ></span>
    <span v-else>
      {{this.rank}}
    </span>
  </template>
    <b-tabs>
      <!-- Add your b-tab components here-->
      <template slot="tabs">
        <b-nav-item
          v-show="user"
          ref="tab1"
          href="#"
          @click="opentraningrank('班级排名')"
          :active="!active2"
        >班级排名</b-nav-item>
        <b-nav-item ref="tab2" href="#" @click="opentraningrank('全校排名')" :active="active2">全校排名</b-nav-item>
      </template>
    </b-tabs>
    <b-table
      style="margin-top:5px;"
      striped
      hover
      :items="items"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
    >
    <!-- <template slot="index" slot-scope="data">{{data.index + 1}}</template> -->
    <template slot="index" slot-scope="data">{{(currentPage-1)*perPage+data.index + 1}}</template>
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      active2: this.user ? false : true,
      totalrows: 0,
      perPage: 7,
      currentPage: 1,
      modalshow: this.show,
      fields: [
        { 
          key: "index", 
          label: "名次"
        },
        // { key: "lesson", label: "课程名称", sortable: true },
        { key: "username", label: "姓名" },
        { key: "class", label: "班级" },
        { key: "score", label: "综合成绩" },
        { key: "rightrate", label: "正确率" },
        { key: "time", label: "用时" },
        {
          key: "finishdate",
          label: "练习时间",
          formatter: (value1, key, item) => {
            return moment(value1).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      ],
      items: [],
      rank: ""
    };
  },
  props: ["user", "show", "lessonname"],
  watch: {
    show: function(val, oldval) {
      if (val){
        this.modalshow=val;
        this.opentraningrank();
      } 
    }
  },
  methods: {
    //打开练习记录回调
    opentraningrank(displaywho) {
      this.rank='';
      if (displaywho == "班级排名") this.active2 = false;
      else this.active2 = true;

      let self = this;
      //this.showloading("正在加载数据...", true);
      this.rank = "当前课程全校排名";
      let querypath = "/typekey/gettkrecordrank?lesson=" + this.lessonname;
      let rankpath = undefined;
      if (this.user) {
        switch (displaywho) {
          case "班级排名":
            this.rank = "您当前课程的班级排名为：第rankstr名！";
            rankpath =
              "/typekey/getuserrankbyclass?token=" +
              this.user.token +
              "&lesson=" +
              this.lessonname +
              "&classno=" +
              this.user.info.classno;
            querypath =
              "/typekey/gettkrecordrankbyclass?lesson=" +
              this.lessonname +
              "&classno=" +
              this.user.info.classno +
              "&token=" +
              this.user.token;
            break;
          case "全校排名":
          //   querypath=
          //   break;
          default:
            rankpath =
              "/typekey/getuserrankbyschool?token=" +
              this.user.token +
              "&lesson=" +
              this.lessonname;
            this.rank = "您当前课程的全校排名为：第rankstr名！";
            break;
        }
      } else {
      }

      axios
        .get(encodeURI(querypath))
        .then(this.gettkrecordrank)
        .catch(function(err) {
          //self.showloading();
          //self.showalert(err.message, "danger");
        });
      if (rankpath) {
        axios
          .get(encodeURI(rankpath))
          .then(this.showuserrank)
          .catch(function(err) {
            //self.showalert(err.message, "danger");
          });
      }
    },
    //获取练习记录排名回调
    gettkrecordrank(res) {
      //this.showloading();
      if (res.data.error) {
        //this.showalert(res.data.message, "info");
        return;
      }
      //console.log(res.data.result);
      //this.$refs.trainingranklist.modalshow = true;
      this.items = res.data.result;
      this.totalrows = this.items.length;
    },
    //显示用户排名回调
    showuserrank(res) {
      if (res.data.error) {
        //this.showalert(res.data.message, "info");
        return;
      }
      if (!res.data.result) {
        this.rank = res.data.message;
        return;
      }
      this.rank = this.rank.replace("rankstr", res.data.result);
    },
  }
};
</script>
