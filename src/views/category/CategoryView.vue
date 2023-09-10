<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>
    <div id="mainbox">
      <div class="ordertab">
        <van-tabs v-model="activeKey" @click="onClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>
      
      <van-sidebar class="leftmenu" v-model="active">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item v-for="item in categories"
                             :key="item.id"
                             :title="item.name">
            <van-sidebar-item v-for="sub in item.children"
                              :key="sub.id"
                              :title="sub.name"
                              @click="getGoods(sub.id)"
                              />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>
      
      <div class="goodslist">
        <div class="content">
          <van-card
            v-for="item in showGoods"
            :key="item.id"
            @click="itemClick(item.id)"
            :num="item.comments_count"
            :tag="item.comments_count>=0?'流行':'标签'"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
        </div>
      </div>
      <back-top @bTop="bTop" v-show="isShowBackTop"></back-top>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {useRouter} from 'vue-router';
  import {ref,reactive,onMounted,computed,onUpdated} from 'vue'
  import {getCategory,getCategoryGoods} from "@/network/category";
  import BScroll from  'better-scroll';
  import backTop from "@/components/common/backtop/backTop";


  export default {
    components:{
      NavBar,
      backTop,
    },
    setup(){
      const router = useRouter();
      let flag = true;
      let active = ref(0);
      let activeKey = ref(1);
      let activeName = ref('1');
      let categories = ref([]);
      let bscroll=reactive({});
      let isShowBackTop = ref(false);
      // 当前的排序条件
      let currentOrder = ref('sales')
      // 当前的分类id
      let currentCid = ref(0);
      // 数据模型
      const goods = reactive({
        sales:{page:1,list:[]},
        price:{page:1,list:[]},
        comments_count:{page:1,list:[]},
      })

      const showGoods = computed(()=>{
        return goods[currentOrder.value].list;
      })

      const bTop = ()=>{
        bscroll.scrollTo(0,0,500);
      }
      
      const init = ()=>{
        getCategoryGoods('sales',currentCid.value).then(res=>{
          goods.sales.list = res.goods.data;
        })
        getCategoryGoods('price',currentCid.value).then(res=>{
          goods.price.list = res.goods.data;
        })
        getCategoryGoods('comments_count',currentCid.value).then(res=>{
          goods.comments_count.list = res.goods.data;
        })
      }
      
      onMounted(()=>{
        getCategory().then(res=>{
          categories.value = res.categories;
        })
        getCategoryGoods('sales',currentCid.value).then(res=>{
          goods.sales.list = res.goods.data;
        })
      })

      onUpdated(()=>{
        if(flag){
          flag=false;
          bscroll = new BScroll(document.querySelector('.goodslist'),{
            probeType:3,  // 0 1 2 3  3 只要在运动就触发scroll事件
            click:true,  // 链接可以点击
            pullUpLoad:true, // 上拉加载更多
          });
          bscroll.on('scroll',(position)=>{
            // console.log(position.y);
            isShowBackTop.value = -position.y > 300;
          })

          bscroll.on('pullingUp',()=>{
            console.log('加载更多');
            const page =goods[currentOrder.value].page + 1;
            getCategoryGoods(currentOrder.value,currentCid,page).then(res=>{
              goods[currentOrder.value].list.push(...res.goods.data);
              goods[currentOrder.value].page +=1;
            });
            bscroll.finishPullUp();
            bscroll.refresh();
          })
        }else{
          bscroll.refresh();
        }

      })
      
      const getGoods= (cid)=>{
        currentCid.value = cid;
        init();
      }
      
      const onClick = (event)=>{
        let text = event.target.innerHTML;
        let index;
        console.log(text);
        switch (text) {
          case('销量排序'):
          case('<span class="van-tab__text van-tab__text--ellipsis">销量排序</span>'):
            index=0;
            break;
          case('价格排序'):
          case('<span class="van-tab__text van-tab__text--ellipsis">价格排序</span>'):
            index=1;
            break;
          case('评论排序'):
          case('<span class="van-tab__text van-tab__text--ellipsis">评论排序</span>'):
            index=2;
            break;
        }
        let orders = ['sales','price','comments_count']
        currentOrder.value = orders[index];
        getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
          goods[currentOrder.value].list = res.goods.data;
        })
      }
      
      return {
        active,
        categories,
        activeName,
        activeKey,
        onClick,
        currentOrder,
        currentCid,
        getGoods,
        bTop,
        goods,
        showGoods,
        isShowBackTop,
        itemClick:(id)=>{
          router.push({path:'/detail',query:{id}});
        },
      }
    }
  };
</script>

<style lang="scss" scoped>
  #mainbox{
    margin-top: 45px;
    display: flex;
    .ordertab{
      flex: 1;
      float: right;
      height: 50px;
      position: fixed;
      top: 45px;
      right: 0;
      left: 130px;
    }
    
    .leftmenu{
      position: fixed;
      top: 95px;
      left: 0;
      width: 130px;
      height: 100vh;
    }
    
    .goodslist{
      flex: 1;
      position: absolute;
      top: 100px;
      left: 130px;
      right: 0;
      height: 85vh;
      padding: 10px;
      text-align: left;
      overflow: hidden;
      .content{
        padding-bottom: 150px;
      }
    }
  }
</style>
