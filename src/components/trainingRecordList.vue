<template>
  <b-modal
    id="modaltktraininglist"
    ref="modaltktraininglist"
    title="我的练习记录"
    hide-footer
    v-model="modalshow"
    @hidden="$emit('hidden')"
    size="lg"
  >    
    <b-table striped hover :items="items" :fields="fields" :per-page="perPage" :current-page="currentPage">
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  data() {
    return {
      totalrows: 0,
      perPage:7,
      currentPage: 1,
      modalshow: this.show,
      fields: [
        { key: "lesson", label: "课程名称", sortable: true },
        { key: "score", label: "综合成绩", sortable: true },
        { key: "rightrate", label: "正确率", sortable: true },
        { key: "time", label: "用时", sortable: true },
        { key: "finishdate", label: "练习时间", sortable: true,formatter:(value1,key,item)=>{
          return moment(value1).format('YYYY-MM-DD HH:mm:ss')
        } }
      ],
      items: []
    };
  },
  props:['user','lessonname','show'],
  watch:{
    show: function(val, oldval) {
      if (val){
        this.modalshow=val;
        this.gettraningrecord();
      } 
    }
  },
  methods:{
    //获取练习记录
    gettraningrecord() {
      if (!this.user) {
        //this.showalert("请先登录!", "info", 5);
        return;
      }
      let self = this;
      //this.showloading("正在加载数据...", true);
      axios
        .get(
          encodeURI(
          "/typekey/gettkrecord?lesson=" +
            this.lessonname +
            "&token=" +
            this.user.token
        ))
        .then(this.gettraningrecord_cb)
        .catch(function(err) {
          //self.showloading();
          //self.showalert(err.message, "danger");
        });
    },
    //获取练习记录回调
    gettraningrecord_cb(res) {
      //this.showloading();
      if (res.data.error) {
        //this.showalert(res.data.message);
        return;
      }
      //this.$refs.trainingrecordlist.modalshow = true;
      this.items = res.data.result;
      this.totalrows = this.items.length;
    },
  }
};
</script>
