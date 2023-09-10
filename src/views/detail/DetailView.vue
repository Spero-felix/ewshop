<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品详情:{{id}}</template>
    </nav-bar>
    
    <van-image
      style="margin-top: 50px"
      width="100%"
      lazy-load
      :src="detail.cover_url"
    />
    <van-card
      style="text-align: left"
      :num="detail.stock"
      :price="detail.price+'.00'"
      :desc="detail.description"
      :title="detail.title"
    >
      <template #tags>
        <van-tag plain type="danger">新书</van-tag>
        <van-tag plain type="danger">推荐</van-tag>
      </template>
      <template #footer>
        <van-button v-model:type="color" @click="handleCollect">收藏</van-button>
        <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
        <van-button type="danger" @click="goToCart">立即购买</van-button>
      </template>
    </van-card>
    
    <van-tabs v-model="active">
      <van-tab title="概述">
        <div class="content" v-html="detail.details">
        </div>
      </van-tab>
      <van-tab title="热评">
        <div v-for="item in detail.comments" :key="item">
        
        </div>
      </van-tab>
      <van-tab title="相关图书">
        <goods-list :goods="like_goods"></goods-list>
      </van-tab>
    </van-tabs>
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
  import {showToast} from 'vant'

  export default {
    components:{
      NavBar,
      GoodsList,
    },
    setup(){
      const route = useRoute();
      const router = useRouter();
      const store = useStore();
      let id = ref(0);
      let color = ref('default');
      let active = ref(1);
      let book = reactive({
        detail:{},
        like_goods:[],
      })
      
      
      onMounted(()=>{
        id.value = route.query.id;
        getDetail(id.value).then(res=>{
          book.detail = res.goods;
          book.like_goods = res.like_goods;
        })
      })
      
      // 加入购物车
      const handleAddCart = ()=>{
        addCart({
          goods_id:book.detail.id,
          num:1,
        }).then(res =>{
          if(res && (res.status=='204' || res.status=='201')){
            alert('成功添加购物车！');
            store.dispatch('updateCart');
          }
        })
      }
      
      const handleCollect = ()=>{
        collection(id).then(res=>{
          if(res && res=='201'){
            showToast('收藏成功');
            color.value = 'success';
          }else if(res=='204'){
            showToast('取消收藏');
            color.value = 'default';
          }else{
            showToast('操作失败');
          }
        })
      }
      
      // 直接购买
      const goToCart = ()=>{
        addCart({
          goods_id:book.detail.id,
          num:1,
        }).then(res =>{
          if(res && (res.status=='204' || res.status=='201')){
            alert('成功添加购物车！跳转购物车');
            router.push({path:'/shopcart'});
            store.dispatch('updateCart');
          }
        })
      }
      
      return{
        id,
        ...toRefs(book),
        active,
        handleAddCart,
        goToCart,
        handleCollect,
        color,
      }
    }
  };
</script>

<style lang="scss" scoped>
  .content {
    padding: 10px;

  }
</style>
