<template>
  <b-modal
    id="modaltklessonlist"
    ref="modaltklessonlist"
    title="课程列表"
    hide-footer
    v-model="modalshow"
  >
    <b-alert
      :show="dismissCountDown"
      dismissible
      :variant="variant"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{message}} ({{dismissCountDown}})</p>
      <b-progress variant="warning" :max="dismissSecs" :value="dismissCountDown" height="2px"></b-progress>
    </b-alert>
    <b-input-group>
      <b-form-input placeholder="搜索关键字" v-model="keyword"/>
      <b-button @click="loadlessonlist" size="sm">搜索</b-button>
    </b-input-group>

    <b-table striped hover :items="items" :fields="fields" :per-page="perPage">
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button-group class="mx-1" size="sm">
          <b-btn @click.stop="info(row.item, row.index, $event.target)">编辑</b-btn>
          <b-btn @click.stop="del(row.index,row.item)">删除</b-btn>
          <b-btn @click.stop="row.toggleDetails">详细</b-btn>
        </b-button-group>
      </template>
      <template slot="row-details" slot-scope="row">{{row.item.lessoncontent}}</template>
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import axios from "axios";
import linq from "linq";
export default {
  data() {
    return {
      variant: "warning",
      dismissSecs: 10,
      dismissCountDown: 0,
      message: "",
      totalrows: 0,
      perPage: 5,
      currentPage: 1,
      modalshow: true,
      fields: [
        { key: "lessonname", label: "课程名称", sortable: true },
        { key: "actions", label: "操作" }
      ],
      items: [],
      keyword: ""
    };
  },
  watch: {
    currentPage: function() {
      this.loadlessonlist();
    }
  },
  mounted() {
    this.loadlessonlist();
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    del(index, item) {
      //this.items.splice(index,1)
      let self = this;
      axios
        .get("/sys/deletelesson?id=" + item._id)
        .then(this.deletelesson)
        .catch(function(err) {
          self.message = "系统出错：" + err.message;
          self.variant = "danger";
          self.dismissCountDown = 10;
        });
    },
    deletelesson(res) {
      this.message = "正在删除数据...";
      this.variant = "info";
      this.dismissCountDown = 5;
      if (res.data.error) {
        this.message = "删除记录出错：" + res.data.message;
        this.variant = "danger";
        this.dismissCountDown = 10;
        return;
      }
      this.dismissCountDown = 0;
      this.loadlessonlist();
    },
    loadlessonlist() {
      this.message = "正在加载数据...";
      this.variant = "info";
      this.dismissCountDown = 5;
      let self = this;
      axios
        .get(
          "/sys/getalltklessonpaging?currentpage=" + this.currentPage + "&keyword=" + this.keyword
        )
        .then(this.showlesson)
        .catch(function(err) {
          self.message = "系统出错：" + err.message;
          self.variant = "danger";
          self.dismissCountDown = 10;
        });
    },
    showlesson(res) {
      if (res.data.error) {
        this.message = "加载数据出错：" + res.data.message;
        this.variant = "danger";
        this.dismissCountDown = 10;
        return;
      }
      this.dismissCountDown = 0;
      //console.log(res.data.pagingdata)
      this.totalrows = res.data.pagingdata.count;
      this.items = res.data.pagingdata.recordset;
    },
    info(a, b, c) {
      console.log(a);
      console.log(b);
      console.log(c);
    }
  }
};
</script>
