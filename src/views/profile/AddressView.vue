<template>
  <div class="address-box">
    <nav-bar>
      <template v-slot:default>地址管理</template>
    </nav-bar>
    
    <div v-show="list.length==0">还没有地址信息，去添加吧！</div>
    
    <div class="address-item">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        disabled-text="以下地址超出配送范围"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
    
    
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {logout,getUser} from "@/network/user";
  import {useRouter} from "vue-router";
  import {useStore} from 'vuex';
  import {ref,toRefs,reactive,onMounted} from 'vue';
  import { showToast } from 'vant';
  import {getAddress} from "@/network/address";
  
  
  export default {
    name: "AddressView",
    components:{
      NavBar,
    },
    setup(){
      const router = useRouter();
      const store = useStore();
      
      onMounted(()=>{
        getAddress().then(res=>{
          if(res.data.length == 0){
            state.list = [];
            return;
          }else{
            state.list = res.data.map(item =>{
              return {
                id:item.id,
                name:item.name,
                tel:item.phone,
                address:`${item.province} ${item.city}${item.county} ${item.address}`,
                isDefault:item.is_default==1?true:false
              }
            });
          }
        })
      })
      
      const state = reactive({
        chosenAddressId:'1',
        list:[]
      })

      const onAdd = () => {
        router.push({path:'/addressedit',query:{type:'add'}})
        showToast('新增地址');
      }
      
      const onEdit = (item, index) => {
        router.push({path:'/addressedit',query:{type:'edit',addressId:item.id}})
        showToast('编辑地址:' + index);
      }
      // const select = (item,index) =>{
      //   router.push({path:'/createorder',query:{addresId:item.id}})
      // }
      
      return {
        ...toRefs(state),
        onAdd,
        onEdit,
        // select,
      }
    }
  }
</script>

<style lang="scss">
  .address-box{
    margin-top: 50px;
    .address-item{
      margin-top: 45px;
      
    }
    .van-address-list__bottom{
       bottom: 70px !important;
     }
  }
  
</style>