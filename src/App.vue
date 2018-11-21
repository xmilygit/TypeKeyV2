<template>
  <div id="app">
    <b-container>
      <b-row style="padding-bottom:20px;">
        <b-col>
          <b-button variant="success"><i class="material-icons buttonoffset">check</i>正确：<var id="rightCount">0</var> 个</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">close</i>错误：<var id="errCount">0</var> 个</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">subject</i>共有字符：<var id="wordCount">0</var> 个</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">spellcheck</i>正确率：<var id="rightRate">100</var> %</b-button>
          <b-button variant="success"><i class="material-icons buttonoffset">query_builder</i>每分钟：<var id="perMinute">0</var> 个</b-button>
        </b-col>
      </b-row>

      <b-row style="padding-bottom:20px;">
        <b-col>
          <b-button variant="secondary" v-for="(item,index) in typeKeys" :key="index" class="keybutton" ref="keyStyle"><h2 ref="keys">{{item}}</h2></b-button>
        </b-col>
      </b-row>
      <b-row style="padding-bottom:20px;">
        <b-col>
          <b-button-group ref="targetKey">
                            <b-button class="keybutton"><h2>请</h2></b-button>
                            <b-button class="keybutton"><h2>登</h2></b-button>
                            <b-button class="keybutton"><h2>录</h2></b-button>
                            <b-button class="keybutton"><h2>后</h2></b-button>
                            <b-button class="keybutton"><h2>点</h2></b-button>
                            <b-button class="keybutton"><h2>击</h2></b-button>
                            <b-button class="keybutton"><h2>开</h2></b-button>
                            <b-button class="keybutton"><h2>始</h2></b-button>
                            <b-button class="keybutton"><h2>开</h2></b-button>
                            <b-button class="keybutton"><h2>始</h2></b-button>
                            <b-button class="keybutton"><h2>练</h2></b-button>
                            <b-button class="keybutton"><h2>习</h2></b-button>
                        </b-button-group>
                        <img src="./assets/kp.jpg" style="margin-top:80px;" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button @click="training(null)" style="width:50%"> > > > 开&nbsp;&nbsp;始 < < < </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
var begin = 0;
var end = 12;
var str =
  "qazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmik";
export default {
  name: "app",
  data() {
    return {
      typeKeys: "请登录后点击开始开始练习",
      currentKeyPosition: 0
    };
  },
  mounted() {
    window.addEventListener("keyup", this.whenKeyPress);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.whenKeyPress);
  },
  methods: {
    training(traiStr) {
      //str = traiStr;
      //str = "f ad a";
      //begin = 0;
      //end = 12;
      //row = 0;
      //k = 0;
      //errCount = 0;
      //rightCount = 0;
      //var str =
      //  "qazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmikqazwsxedcrfvtgbyhnujmik";
      // wordCount = str.length;
      // rightRate = 0;
      // countTime = "00:00:00";
      // perMinute = 0;
      // result = 0;
      // time_begin = false;
      // time_h = 0;
      // time_m = 0;
      // time_s = 0;
      // checkedInput = 0;
      //$(document).bind("keypress", $.myMethod.whenKeyPress);
      //$.myMethod.showInfo();
      this.getNewRow(begin, end);
    },
    getNewRow(begin, end) {
      alert(str);
      if (end - begin != 12) {
        alert("begin-end mast be equst 12");
        return;
      }
      // targetKeys
      //   .parent("button")
      //   .removeClass("btn-success")
      //   .removeClass("btn-danger");
      //以下放置移除样式代码

      var index = 0;
      for (var i = begin; i < end; i++) {
        if (i < str.length) {
          this.$refs.keys[index].innerText = str[i].toUpperCase();
        } else {
          this.$refs.keys[index].innerText = "";
        }
        index++;
      }
    },
    whenKeyPress(e) {
      //alert(this.$refs.keys[0].innerText);
      var key = e.which;
      var keyChar = String.fromCharCode(key).toUpperCase();
      //alert(keyChar+" === "+this.currentKeyPosition)
      var targetKeys=this.$refs.keys
      var targetKeyStyle=this.$refs.keyStyle
      if (targetKeys[this.currentKeyPosition].innerText == keyChar) {
        console.log(targetKeyStyle[this.currentKeyPosition])
        console.log(targetKeyStyle[this.currentKeyPosition].className)//="btn keybutton btn-success"
        targetKeyStyle[this.currentKeyPosition].className="btn keybutton btn-success"
        // $(targetKeys[k])
        //   .parent("button")
        //   .addClass("btn-success");
        // rightCount++;
        // checkedInput = 0;
      } else {
        alert('w')
        // $(targetKeys[k])
        //   .parent("button")
        //   .addClass("btn-danger");
        // errCount++;
        // checkedInput++;
      }
      this.currentKeyPosition++;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.buttonoffset {
  vertical-align: top;
  margin-top: 2px;
  margin-right: 2px;
  font-size: 20px;
}
.keybutton {
  border-color: #cccccc;
  width:59px;
  height:59px;
}
</style>
