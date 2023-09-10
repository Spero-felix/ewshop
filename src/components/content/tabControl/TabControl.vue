<template>
  <div class="tab-control">
    <div @click="itemClick(index)"
         class="tab-control-item"
         :class="{active:index==currentIndex}"
         v-for="(item,index) in titles" :key="index">
      <span>{{item}}</span>
    </div>
    
  </div>
</template>

<script>
  import {Ref,ref} from 'vue';
  
  export default {
    name: "TabControl",
    props:{
      titles:{
        type:Array,
        default() {
          return [];
        }
      },
      currentIndex:{
        type: null,
        default() {
          return 0;
        }
      }
    },
    setup(props, {emit}){
      let currentIndex = ref(0);
      
      const itemClick = (index)=>{
        currentIndex=index
        emit('tabClick',index);
      }
      
      return {
        itemClick,
      }
    },
  }
</script>

<style scoped lang="scss">
  .tab-control{
    z-index: 8;
    height: 40px;
    display: flex;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    width: 100%;
    box-shadow: 0 2px 10px rgba(100,100,100,0.2);
    background-color: #fff;
    // 滑动时固定在顶端
    position: sticky;
    top: 45px;
    
    .tab-control-item{
      flex: 1;
      span{
        padding: 5px;
      }
    }
    .active{
      color: var(--color-tint);
      span{
        border-bottom: 3px solid var(--color-tint);
      }
    }
  }
</style>