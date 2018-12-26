<template>
<div>
    <h1>
        这是子组件自己的值obj1.val1：{{obj1.val1}}       
    </h1>
    <h1>
        这是父组件接收的值obj2.val1:{{obj2E.val1}}
    </h1>
</div>
</template>

<script>
export default {
    data(){
        return{
            obj1:{
                val1:1,
                val2:2
            }

        }
    },
    //props:['obj2E']
    props:{
        obj2E:{
            type:Object,
            default:function(){
                return {val1:3,val:4}
            }
        }
    },
}
</script>

