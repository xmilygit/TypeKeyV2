<template>
  <b-modal
    id="modaltklessonlist"
    ref="modaltklessonlist"
    title="课程列表"
    hide-footer
    v-model="modalshow"
    @hidden="$emit('hidden')"
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
      <b-button @click="showadddlesson=true" size="sm">添加</b-button>
    </b-input-group>
    <b-collapse id="collapse1" class="mt-2" v-model="showadddlesson">
      <b-card>
        <form style="text-align:left;" ref="form" @submit="savelesson">
          <b-form-group
            id="InputGroup1"
            label="课程名称:"
            label-for="lessonname"
            description="用于课程显示时的名称"
          >
            <b-form-input
              id="lessonname"
              type="text"
              v-model.trim="form.lessonname"
              required
              placeholder="课程名称"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="InputGroup2"
            label="课程内容:"
            label-for="lessoncontent"
            description="练习时的所有字符"
          >
            <b-form-textarea
              id="lessoncontent"
              v-model.trim="form.lessoncontent"
              placeholder="输入练习内容"
              :rows="4"
              :max-rows="6"
              required
            ></b-form-textarea>
          </b-form-group>
          <div style="text-align:right">
            <b-button type="submit" variant="primary">保存</b-button>
            <b-button type="reset" variant="danger" @click="clearform">取消</b-button>
          </div>
        </form>
      </b-card>
    </b-collapse>
    <b-table striped hover :items="items" :fields="fields" :per-page="perPage">
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button-group class="mx-1" size="sm">
          <b-btn @click.stop="editlesson(row.index,row.item)">编辑</b-btn>
          <b-btn @click.stop="del(row.index,row.item)">删除</b-btn>
          <b-btn @click.stop="row.toggleDetails">详细</b-btn>
        </b-button-group>
      </template>
      <template slot="row-details" slot-scope="row">
        <span style="word-wrap:break-word;word-break:break-all;">{{row.item.lessoncontent}}</span>
      </template>
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loadingbacktitle: "正在保存...",
      showloadingback: false,
      showadddlesson: false,
      variant: "warning",
      dismissSecs: 10,
      dismissCountDown: 0,
      message: "",
      totalrows: 0,
      perPage: 5,
      currentPage: 1,
      modalshow: false,
      fields: [
        { key: "lessonname", label: "课程名称", sortable: true },
        { key: "actions", label: "操作" }
      ],
      items: [],
      keyword: "",
      form: {
        lessonname: "",
        lessoncontent: ""
      }
    };
  },
  props: ["show", "user"],
  watch: {
    currentPage: function() {
      this.loadlessonlist();
    },
    show: function(val, oldval) {
      if (val) {
        this.modalshow = val;
        this.loadlessonlist();
      }
    }
  },
  // mounted() {
  //   this.loadlessonlist();
  // },
  methods: {
    showalert(message, variant, dismissSecs) {
      this.variant = variant || "success";
      this.dismiss = dismissSecs || 10;
      this.message = message || "保存成功！";
      this.dismissCountDown = dismissSecs;
    },
    showloading(message, show) {
      this.$emit('showloading',message,show)
      // this.loadingbacktitle = message || "正在保存...";
      // if (show) this.showloadingback = true;
      // else this.showloadingback = false;
    },
    clearform() {
      if (this.form.id) delete this.form["id"];
      this.form.lessonname = "";
      this.form.lessoncontent = "";
      this.showadddlesson = false;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    del(index, item) {
      this.showloading("正在删除...", true);
      let self = this;
      axios
        .get("/typekey/deletelesson?id=" + item._id)
        .then(this.deletelesson)
        .catch(function(err) {
          self.showalert("系统出错：" + err.message, "danger", 10);
          // self.message =
          // self.variant = "danger";
          // self.dismissCountDown = 10;
        });
    },
    deletelesson(res) {
      //this.message = "正在删除数据...";
      //this.variant = "info";
      //this.dismissCountDown = 5;
      this.showloading();
      if (res.data.error) {
        this.showalert("删除记录出错：" + res.data.message, "danger", 10);
        // this.message = "删除记录出错：" + res.data.message;
        // this.variant = "danger";
        // this.dismissCountDown = 10;
        return;
      }
      // this.dismissCountDown = 0;
      this.loadlessonlist();
    },
    loadlessonlist() {
      // this.message = "正在加载数据...";
      // this.variant = "info";
      // this.dismissCountDown = 5;
      this.showloading("正在加载数据...", true);
      let self = this;
      axios
        .get(
          "/typekey/getalltklessonpaging?currentpage=" +
            this.currentPage +
            "&keyword=" +
            this.keyword +
            "&sort=" +
            "-sq"
        )
        .then(this.showlesson)
        .catch(function(err) {
          self.showalert("系统出错：" + err.message, "danger", 10);
          // self.message = "系统出错：" + err.message;
          // self.variant = "danger";
          // self.dismissCountDown = 10;
        });
    },
    showlesson(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert("加载数据出错：" + res.data.message, "danger", 10);
        // this.message = "加载数据出错：" + res.data.message;
        // this.variant = "danger";
        // this.dismissCountDown = 10;
        return;
      }
      //this.dismissCountDown = 0;
      //console.log(res.data.pagingdata)
      this.totalrows = res.data.pagingdata.count;
      this.items = res.data.pagingdata.recordset;
    },
    savelesson(evt) {
      evt.preventDefault();
      let self = this;
      // this.message = "正在保存...";
      // this.variant = "info";
      // this.dismissCountDown = 10;
      this.showloading("正在保存...", true);
      if (this.form.id) {
        axios
          .post("/typekey/edittklesson", {
            lessoninfo: this.form
          })
          .then(this.editinglesson)
          .catch(function(err) {
            self.showalert("系统出错：" + err.message, "danger", 10);
            //self.$emit("displayLoading");
            //系统出错处理
            // self.message = "系统错误：" + err.message;
            // self.variant = "danger";
            // self.dismissCountDown = 10;
          });
        return;
      }

      axios
        .post("/typekey/savetklesson", { lessoninfo: this.form })
        .then(this.saveinglesson)
        .catch(function(err) {
          self.showalert("系统出错：" + err.message, "danger", 10);
          //self.$emit("displayLoading");
          //系统出错处理
          // self.message = "系统错误1：" + err.message;
          // self.variant = "danger";
          // self.dismissCountDown = 10;
        });
    },
    editinglesson(res) {
      this.showloading();
      if (res.data.error) {
        this.showalert("保存失败：" + res.data.message, "danger", 10);
        // this.message = "保存失败:" + res.data.message;
        // this.variant = "danger";
        // this.dismissCountDown = 10;
        return;
      }
      this.showadddlesson = false;
      // this.message = "保存成功";
      // this.variant = "success";
      // this.dismissCountDown = 5;
      this.showalert("保存成功", "success", 5);
      this.form.lessonname = "";
      this.form.lessoncontent = "";
      this.loadlessonlist();
      // setTimeout(() => {
      //   this.form.lessonname = "";
      //   this.form.lessoncontent = "";
      //   this.loadlessonlist();
      // }, this.dismissCountDown * 1000);
    },
    saveinglesson(res) {
      //self.$emit("displayLoading");
      this.showloading();
      if (res.data.error) {
        //出错处理
        // this.message = "保存失败：" + res.data.message;
        // this.variant = "danger";
        // this.dismissCountDown = 10;
        this.showalert("保存失败：" + res.data.message, "danger", 10);
        return;
      }
      //正常处理
      this.showadddlesson = false;
      this.showalert("保存成功", "success", 5);
      // this.message = "保存成功";
      // this.variant = "success";
      // this.dismissCountDown = 5;
      this.form.lessonname = "";
      this.form.lessoncontent = "";
      this.loadlessonlist();
    },
    editlesson(index, item) {
      this.showadddlesson = true;
      this.form.lessonname = item.lessonname;
      this.form.lessoncontent = item.lessoncontent;
      this.form.id = item._id;
    }
  }
};
</script>
