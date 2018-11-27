<template>
  <b-modal
    id="modaltklessonlist"
    ref="modaltklessonlist"
    title="课程列表"
    hide-footer
    v-model="modalshow"
  >
    <b-table striped hover :items="items" :fields="fields" :per-page="perPage">
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button
          size="sm"
          @click.stop="info(row.item, row.index, $event.target)"
          class="mr-1"
        >编辑</b-button>
        <b-button
          size="sm"
          @click.stop="row.toggleDetails"
          class="mr-1"
        >删除</b-button>
        <b-button
          size="sm"
          @click.stop="row.toggleDetails"
          class="mr-1"
        >详细</b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        {{row.item.lessoncontent}}
      </template>
    </b-table>
    <b-pagination align="center" :total-rows="totalrows" v-model="currentPage" :per-page="perPage"></b-pagination>
  </b-modal>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      totalrows:0,
      perPage: 5,
      currentPage: 1,
      modalshow: true,
      fields: [{ key: "lessonname", label: "课程名称", sortable: true },{key:'actions',label:'操作'}],
      items: [
        {
          lessonname: "test1",
          lessoncontent: "asdfasdfasdfdfadfafdafdfadfadffadfaf"
        },
        {
          lessonname: "test2",
          lessoncontent: "asdfasdfasdfdfadfafdafdfadfadffadfaf"
        },
        {
          lessonname: "test3",
          lessoncontent: "asdfasdfasdfdfadfafdafdfadfadffadfaf"
        },
        {
          lessonname: "test4",
          lessoncontent: "asdfasdfasdfdfadfafdafdfadfadffadfaf"
        }
      ]
    }
  },
  mounted(){
    this.items=[{lessonname:'正在加载数据...'}]
    axios.get('/sys/getalltklessonpaging')
    .then(this.showlesson)
    .catch(function(err){
      console.log(err.message)
    })
  },
  methods:{
    showlesson(res){
      if(res.data.error){
        this.items=[];
        console.log(res.data.message)
        return
      }
      console.log(res.data.pagingdata)
      this.totalrows=res.data.pagingdata.count;
      this.items=res.data.pagingdata.recordset;
    },
    info(a,b,c){
      console.log(a)
      console.log(b)
      console.log(c)
    }
  }
};

</script>
