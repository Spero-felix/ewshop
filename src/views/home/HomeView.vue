<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>图书兄弟</template>
    </nav-bar>
  
    <tab-control v-show="isTabFixed" @tabClick="tabClick" :currentIndex="currentIndex" :titles="['畅销','新书','精选']"></tab-control>
    
    <div class="wrapper">
      <div class="content">
        <div ref="banref">
          <home-swiper :banners="banners"></home-swiper>
          <recommend-view :recommends="recommends"></recommend-view>
        </div>
        
        <tab-control @tabClick="tabClick" :currentIndex="currentIndex" :titles="['畅销','新书','精选']"></tab-control>
  
        <goods-list :goods="showGoods" @scrollRefresh="scrollRefresh"></goods-list>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from "@/views/home/childComps/HomeSwiper";
  import NavBar from "components/common/navbar/NavBar";
  import RecommendView from "./childComps/RecommendView"
  import {getHomeAllData,getHomeGoods} from "@/network/home";
  import {ref,onMounted,reactive,computed,watchEffect,nextTick} from 'vue'
  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodsList from "@/components/content/goods/GoodsList";
  import BScroll from  'better-scroll';
  import backTop from "@/components/common/backtop/backTop";
  
  
  export default {
  name:'HomeView',
  components:{
    NavBar,
    RecommendView,
    TabControl,
    GoodsList,
    backTop,
    HomeSwiper,
  },
  setup(){
    const recommends = ref([]);
    let banref = ref(null);
    let isTabFixed = ref(false);
    let isShowBackTop = ref(false);
    let currentIndex = ref(0);
    let banners = ref([]);
    
    let type = ['sales','new','recommend'];
    // 商品列表数据模型
    const goods = reactive({
      sales:{page:1,list:[]},
      new:{page: 1,list: []},
      recommend:{page: 1,list: []},
    })
    
    let currentType = ref('sales');

    const showGoods = computed(()=>{
      return goods[currentType.value].list;
    });

    let bscroll=reactive({});
    
    onMounted(()=>{
      getHomeAllData().then(res=>{
        recommends.value = res.goods.data;
        banners.value = res.slides;
      })
      
      getHomeGoods('sales').then(res=>{
        goods.sales.list = res.goods.data;
      });
      getHomeGoods('recommend').then(res=>{
        goods.recommend.list = res.goods.data;
      });
      getHomeGoods('new').then(res=>{
        goods.new.list = res.goods.data;
      });
      
      // 创建betterScroll对象
      bscroll = new BScroll(document.querySelector('.wrapper'),{
        probeType:3,  // 0 1 2 3  3 只要在运动就触发scroll事件
        click:true,  // 链接可以点击
        pullUpLoad:true, // 上拉加载更多
      });
      // 触发滚动事件
      bscroll.on('scroll',(position)=>{
        // console.log(position.y);
        isShowBackTop.value = isTabFixed.value = -position.y > banref.value.offsetHeight;
      })
      
      bscroll.on('pullingUp',()=>{
        console.log('加载更多');
        const page =goods[currentType.value].page + 1;
        getHomeGoods(currentType.value,page).then(res=>{
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].page +=1;
        });
        bscroll.finishPullUp();
        bscroll.refresh();
      })
    })
    
    const bTop = ()=>{
      bscroll.scrollTo(0,0,500);
    }
    
    const scrollRefresh = ()=>{
      bscroll.refresh();
    }
    
    const tabClick = (index)=>{
      currentIndex.value = index;
      currentType.value = type[index];
      nextTick(()=>{
        bscroll && bscroll.refresh();
      })
    }
    // 监听 任何一个变量有变化
    watchEffect(()=>{
      nextTick(()=>{
        bscroll && bscroll.refresh();
      })
    })
    
    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      scrollRefresh,
      isTabFixed,
      banref,
      isShowBackTop,
      bTop,
      currentIndex,
      banners,
    }
  },
  
  
};
</script>

<style lang="scss" scoped>
  .banners img{
    width: 100%;
    height: auto;
  }
  #home{
    height: 100vh;
    position: relative;
  }
  .wrapper{
    position: absolute;
    top: 45px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .content{
  
  }
</style>
