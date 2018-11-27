<template>
    <b-modal
        id="modaltklessonlist"
        ref="modaltklessonlist"
        title="课程列表"
        hide-footer
        v-model="modalshow"
    >
        <b-table striped hover :items="items" :fields="fields" :per-page="perPage">
        </b-table>
        <b-pagination align="center" :total-rows="8" v-model="currentPage" :per-page="perPage"></b-pagination>
    </b-modal>    
</template>

<script>
export default {
  data() {
    return {
      perPage:2,
      currentPage:1,
      modalshow: true,
      fields: ["first_name", "last_name", "age"],
      items: [
        { isActive: true, age: 40, first_name: "Dickerson", last_name: "Macdonald"},
        { isActive: false, age: 21, first_name: "Larsen", last_name: "Shaw" },
        { isActive: false, age: 89, first_name: "Geneva", last_name: "Wilson" },
        { isActive: true, age: 38, first_name: "Jami", last_name: "Carney" },
        { isActive: true, age: 40, first_name: "Dickerson", last_name: "Macdonald"},
        { isActive: false, age: 21, first_name: "Larsen", last_name: "Shaw" },
        { isActive: false, age: 89, first_name: "Geneva", last_name: "Wilson" },
        { isActive: true, age: 38, first_name: "Jami", last_name: "Carney" }
      ]
    };
  }
};
</script>
