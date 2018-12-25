<template>
        <loading :active.sync="show" 
        :can-cancel="true"         
        :is-full-page="fullPage"
        :width="width"
        :height="height"
        :loader="loader"
        :color="color"
        >
        <h4 slot="before" style="color:#000">{{title}}</h4>
        </loading>
</template>
 
<script>
    // Import component
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';
    
    export default {
        data() {
            return {
                fullPage: true,
                width:50,
                height:50,
                loader:'Dots',
                color:'#28a745',
            }
        },
        props:['show','title'],
        components: {
            Loading
        },
    }
</script> 