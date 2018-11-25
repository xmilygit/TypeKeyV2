<template>
    <b-alert :show="dismissCountDown"
             dismissible
             :variant="variant"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged"
             >
      <p>{{message}} ({{dismissCountDown}})</p>
      <b-progress variant="warning"
                  :max="dismissSecs"
                  :value="dismissCountDown"
                  height="2px">
      </b-progress>
    </b-alert>
</template>

<script>
export default {
  data() {
    return {
      variant:"warning",
      dismissSecs: 10,
      dismissCountDown: 0,
      message:''
    };
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    }
  }
};
</script>
