<template>
  <div class="backTop" @click="backtop">
    
  </div>
</template>

<script>
  export default {
    name: "backTop",
    setup(props,{emit}){
      return {
        backtop:()=>{
          emit('bTop')
        }
      }
    }
  }
</script>

<style scoped>
  .backTop{
    width: 40px;
    height: 40px;
    position: fixed;
    bottom: 80px;
    right: 30px;
    z-index: 20;
    box-shadow: 5px 5px 5px;
    border-radius: 50%;
    background: #fcfcfc url("~assets/images/up.png") no-repeat center center;
  }
</style>