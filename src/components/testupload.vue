<template>
<div>
  <!-- <form
    action="http://192.168.123.151:3000/sys/testupload"
    method="post"
    enctype="multipart/form-data"
  >
    
    <input type="submit" value="提交">
  </form> -->
  <input type="file" @change="appendfiles" value multiple="multiple">
  <b-button @click="uploadfile" title="upload">upload</b-button>
</div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
        files:[]
    };
  },    
  methods: {
    appendfiles(evt){
        console.log(evt.target.files);
        this.files.push(evt.target.files[0])
    },
    uploadfile() {
      var fd = new FormData();
      console.log(this.files[0])
      fd.append("file", this.files[0]);
      let config = {
        onUploadProgress: progressEvent => {
          var complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          console.log(complete); //进度值
          this.jindu = complete;
        },
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      axios
        .post('/sys/testupload', fd, config)
        .then(res => {})
        .catch(res => {});
    }
  }
};
</script>

