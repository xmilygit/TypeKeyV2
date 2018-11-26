<template>
    <b-modal id="modalPrevent" ref="modal" title="课程添加" hide-footer v-model="modalshow">
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
                <b-button type="reset" variant="danger" @click="$refs.modal.hide()">取消</b-button>
            </div>
        </form>
    </b-modal>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        lessonname: "",
        lessoncontent: ""
      },
      modalshow: true
    };
  },
  methods: {
    savelesson(evt) {
      evt.preventDefault();
      this.modalshow=false;
      this.$emit("displayLoading",null,true);
      let self=this;
      axios
        .post("/sys/savetklesson", { lessoninfo: self.form })
        .then(function(res) {
            self.$emit('displayLoading')
            if(res.data.error){
                //出错处理
                self.$emit("displayAlert","保存失败："+res.data.error.message,"danger",null,)
            }
            //正常处理
            self.$emit("displayAlert",null,null,5);
        })
        .catch(function(err) {
            self.$emit('displayLoading')
            //系统出错处理
            self.$emit("displayAlert","系统错误："+err.message,'danger',null);
        });
    }
  }
};
</script>
