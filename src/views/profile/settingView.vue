<template>
  <div>
    <nav-bar>
      <template v-slot:default>设置</template>
    </nav-bar>
    
    
    
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import GoodsList from "@/components/content/goods/GoodsList";
  import {useRoute,useRouter} from 'vue-router';
  import {useStore} from 'vuex';
  import {ref,onMounted,reactive,toRefs} from 'vue'
  import {getDetail,collection} from "@/network/detail";
  import {addCart} from "@/network/cart";
  import {showToast} from 'vant';
  
  export default {
    name: "settingView",
    components:{
      NavBar,
    }
  }
</script>

<style scoped>

</style>