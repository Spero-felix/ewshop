<template>
  <div class="order-box">
    <nav-bar class="nav-bar">
      <template v-slot:default>
        定单列表
      </template>
    </nav-bar>
    
    <div class="tabs">
      <van-tabs v-model:active="active" @click-tab="onClickTab">
        <van-tab title="全部"></van-tab>
        <van-tab title="待付款"></van-tab>
        <van-tab title="已支付"></van-tab>
        <van-tab title="发货"></van-tab>
        <van-tab title="交易完成"></van-tab>
        <van-tab title="过期"></van-tab>
      </van-tabs>
    </div>
    
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div @click="goTo(item.id)" class="order-item-box" v-for="(item,index) in list" :key="index">
            <div class="order-item-header">
              <span style="line-height: 30px">订单号:{{item.order_no}} <br> 创建时间:{{item.created_at}}}</span>
            </div>
            <van-card
              v-for="sub in item.orderDetails.data"
              :key="sub.id"
              :num="sub.num"
              :price="sub.goods.price"
              :desc="sub.goods.description"
              :title="sub.goods.description"
              :thumb="sub.goods.cover_url"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import { ref,reactive, toRefs, onMounted,computed } from 'vue'
  import NavBar from "components/common/navbar/NavBar";
  import { getOrderList,getOrderDetail, confirmOrder, payOrder,payOrderStatus,viewExpress } from 'network/order'
  import {showLoadingToast,closeToast,showDialog,showConfirmDialog  ,showToast} from 'vant'
  import { useRoute, useRouter } from 'vue-router'
  export default {
    name: "OrderView",
    components:{
      NavBar,
    },
    setup(){
      const route = useRoute()
      const router = useRouter()
      const active = ref(0);
      let tabs = ref(null);
      const state = reactive({
        loading:false,
        finished:false,
        refreshing:false,
        list:[],
        page:0,
        totalPage:1,
        status:0,
      })
      
      
      const loadData = ()=>{
        getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res=>{
          state.list.push(...res.data);
          state.totalPage = res.meta.pagination.total_pages;
          
          state.loading = false;
        })
      }

      const goTo = (id)=>{
        router.push({path:'/orderdetail',query:{id}});
      }
      
      const onLoad = () => {
        if(state.refreshing){
          state.list = [];
        }
        console.log(state)
        if(state.page>=state.totalPage){
          state.finished = true;
        }else{
          state.page++;
          loadData();
        }
        state.loading = false;
      };
      
      const onClickTab = ({name})=>{
        state.status = name;
        onRefresh();
      }

      const onRefresh = () => {
        state.refreshing = true;
        // 清空列表数据
        state.finished = false;
        
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        state.loading = true;
        state.page = 0;
        onLoad();
        state.refreshing = false;
      };
      
      return {
        ...toRefs(state),
        active,
        onLoad,
        onRefresh,
        onClickTab,
        goTo,
      }
    
    }
  }
</script>

<style lang="scss" scoped>
  
  .order-box {
    text-align: left;
    position: fixed;
    top: 50px;
    right: 0;
    left: 0;
    bottom: 45px;
    .tabs{
      position: fixed;
      top: 45px;
      z-index: 10;
    }
    .order-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      width:100%;
      height:44px;
      line-height: 44px;
      padding: 0 10px;
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      margin-top: 44px;
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    
    
    .content {
      height:100vh;
      overflow: hidden;
      overflow-y: scroll;
      padding-top: 45px;
      padding-bottom: 45px;
    }
    .order-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      
      .order-item-box {
        margin: 20px 10px;
        background-color: #FAFAFA;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #FFFFFF;
          border-radius: 3px;
          margin-top: 10px;
        }
      }
    }
  }
</style>