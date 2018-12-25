<template>
    <!-- <div class="vld-parent"> :on-cancel="onCancel"-->
        <loading :active.sync="isLoading" 
        :can-cancel="true"         
        :is-full-page="fullPage"
        :width="width"
        :height="height"
        :loader="loader"
        :color="color"
        @onCancel="$emit('hidden')"
        >
        <h4 slot="before" style="color:#000">{{title}}</h4>
        </loading>
        
        <!-- <label><input type="checkbox" v-model="fullPage">Full page?</label>
        <button @click.prevent="doAjax">fetch Data</button>
    </div> -->
</template>
 
<script>
    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
    
    export default {
        data() {
            return {
                isLoading: this.show,
                fullPage: true,
                width:50,
                height:50,
                loader:'Dots',
                color:'#28a745',
                title:this.title,//'正在保存...'
            }
        },
        props:['show','title'],
        components: {
            Loading
        },

        //methods: {
            //showloading() {
                // this.isLoading = true;
                // simulate AJAX
                //setTimeout(() => {
                //  this.isLoading = false
                //},5000)
          //  },
            // hidderloading(){
                // this.isLoading=false;
            // }
            // onCancel() {
            //   console.log('User cancelled the loader.')
            // }
        }
    }
</script> 