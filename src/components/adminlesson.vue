<template>
    <b-modal id="modalPrevent" ref="modal" title="课程添加" @ok="savelesson" @shown="clearName" v-model="modalshow">
        <form @submit.stop.prevent="handleSubmit">
            <b-form-group
                id="InputGroup1"
                label="课程名称:"
                label-for="lessonname"
                description="用于课程显示时的名称"
            >
                <b-form-input
                    id="lessonname"
                    type="text"
                    v-model="form.lessonname"
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
                    v-model="form.lessoncontent"
                    placeholder="输入练习内容"
                    :rows="4"
                    :max-rows="6"
                ></b-form-textarea>
            </b-form-group>
        </form>
    </b-modal>
</template>

<script>
export default {
  data() {
    return {
      form: {
        lessonname: "",
        lessoncontent: ""
      },
      modalshow:true
    };
  },
  methods: {
    savelesson() {},
    clearName() {}
  }
};
</script>
