<template>
    <b-alert :show="dismissCountDown"
             dismissible
             :variant="alertInfo.variant"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged"
             >
      <p>{{alertInfo.message}} ({{dismissCountDown}})</p>
      <b-progress :variant="alertInfo.variant"
                  :max="alertInfo.dismissSecs"
                  :value="dismissCountDown"
                  height="2px">
      </b-progress>
    </b-alert>
</template>

<script>
export default {
  data() {
    return {
      dismissCountDown: 0,
    };
  },
  props:{
    alertInfo:{
      type:Object,
      default:()=>{
        return {
          variant:"warning",
          dismissSecs: 10,
          message:'保存成功！'
        }
      }
    },
    show:{
      type:Boolean
    },
  },
  watch:{
    show:function(val,oldval){
      if(val)
      this.dismissCountDown=this.alertInfo.dismissSecs
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    dismissed(){
      this.dismissCountDown=0;
      this.$emit('hidden');
    }
  }
};
</script>
