<template>
  <b-modal
    id="modaltktraininglist"
    ref="modaltktraininglist"
    :title="rank"
    hide-footer
    v-model="modalshow"
    size="lg"
  >
    <b-tabs>
      <!-- Add your b-tab components here-->
      <template slot="tabs">
        <b-nav-item v-show="user" ref="tab1" href="#" @click="eventproccess('class')" :active="!active2">班级排名</b-nav-item>
        <b-nav-item ref="tab2" href="#" @click="eventproccess('school')" :active="active2">全校排名</b-nav-item>
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
      <template slot="index" slot-scope="data">{{data.index + 1}}</template>
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      active2: this.user?false:true,
      totalrows: 0,
      perPage: 7,
      currentPage: 1,
      modalshow: false,
      fields: [
        { key: "index", label: "名次" },
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
      items: []
    };
  },
  props:['user','rank'],
  methods: {
    eventproccess(type) {
      if (type == "class") this.active2 = false;
      else this.active2 = true;
      this.$emit("showrank", type);
    }
  }
};
</script>
