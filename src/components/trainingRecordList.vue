<template>
  <b-modal
    id="modaltktraininglist"
    ref="modaltktraininglist"
    title="我的练习记录"
    hide-footer
    v-model="modalshow"
    size="lg"
  >    
    <b-table striped hover :items="items" :fields="fields" :per-page="perPage" :current-page="currentPage">
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      totalrows: 0,
      perPage:7,
      currentPage: 1,
      modalshow: false,
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
};
</script>
