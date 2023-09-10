<template>
  <div>
    <nav-bar>
      <template v-slot:default>个人中心</template>
    </nav-bar>
    <div class="wrapper">
      <div class="profile">
        <div class="head">
          <img src="~assets/images/user.png" alt="头像">
        </div>
        <div class="content">
          <p>昵称：{{user.name}}</p>
          <p>登录名：{{user.email}}</p>
          <p>个人签名：飞飞飞飞飞咻咻咻咻</p>
        </div>
      </div>
      <div class="functionlist">
        <ul>
          <li @click="goTo('/collect')"><span>我的收藏</span> <van-icon name="arrow" /></li>
          <li @click="goTo('/order')"><span>我的订单</span> <van-icon name="arrow" /></li>
          <li @click="goTo('/setting')"><span>账号管理</span> <van-icon name="arrow" /></li>
          <li @click="goTo('/address')"><span>地址管理</span> <van-icon name="arrow" /></li>
          <li @click="goTo('/about')"><span>关于我们</span> <van-icon name="arrow" /></li>
        </ul>
      </div>
      <div style="margin: 30px;">
        <van-button @click="tologout" block round color="#44ba80">退出</van-button>
      </div>
    </div>
    
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {logout,getUser} from "@/network/user";
  import {useRouter} from "vue-router";
  import {useStore} from 'vuex';
  import {ref,toRefs,reactive,onMounted} from 'vue';
  
  export default {
    components:{
      NavBar
    },
    setup(){
      const router = useRouter();
      const store = useStore();
      const state = reactive({
        user:{
          name:'',
          email:''
        },
      })

      onMounted(()=>{
        getUser().then(res=>{
          if(res)
            state.user = res;
        })
      })
      
      const goTo = (path,query)=>{
        console.log(query);
        router.push({path,query:query || {}})
      }

      const tologout = ()=>{
        logout().then(res=>{
          if(res && res.status=='204'){
            alert('登出成功！');
            localStorage.setItem('token','');
            store.commit('setIsLogin','false');
            setTimeout(()=>{
              router.push({path:'/login'});
            },500)
          }
        });
      }
      
      return {
        tologout,
        ...toRefs(state),
        goTo,
      }
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper{
    margin-top: 50px;
    
    .profile{
      display: flex;
      justify-content: space-around;
      padding: 10px;
      background-color: rgb(148,200,195);
      border-radius: 5%;
      margin: 5px 5px;
      .head{
      
      }
      .content{
        padding: 10px;
        text-align: left;
        width: 70%;
        p{
          margin-bottom: 5px;
          line-height: 18px;
          white-space:nowrap;
          text-overflow:ellipsis; overflow:hidden;
        }
      }
    }
    
    .functionlist{
      ul{
        margin-top: 15px;
        li{
          display: flex;
          justify-content: space-between;
          height: 40px;
          padding: 10px;
          line-height: 40px;
          margin-bottom: 10px;
        }
      }
    }
    
  }
</style>
