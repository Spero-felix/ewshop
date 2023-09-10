<template>
  <div>
    <nav-bar>
      <template v-slot:default>用户注册</template>
    </nav-bar>
    <div style="margin-top: 50px">
      <div style="text-align:center;">
        <van-image
          style="margin-top: 30px"
          width="10%"
          lazy-load
          src="https://img.yzcdn.cn/public_files/2017/12/18/fd78cf6bb5d12e2a119d0576bedfd230.png"
        />
      </div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="password_confirmation"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="输入一致密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="email"
            name="电子邮箱"
            label="电子邮箱"
            placeholder="电子邮箱"
            :rules="[{ required: true, message: '请填写电子邮箱' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <div class="ling-login" @click="$router.push({path:'/login'})">
            已有账号，立即登陆
          </div>
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>

</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import {ref,reactive,toRefs} from 'vue';
  import {register} from "@/network/user";
  import { Notify } from 'vant';
  import {useRouter} from "vue-router";

  export default {
    name: "RegisterVie",
    components:{
      NavBar,
    },
    setup(){
      const router = useRouter();
      const userInfo = reactive({
        name:'',
        password:'',
        password_confirmation:'',
        email:'',
      })
      
      const onSubmit = ()=>{
        // 先验证
        if(userInfo.password != userInfo.password_confirmation){
          alert('两次密码不一致');
        }else{
          // 提交给服务器
          register(userInfo).then(res=>{
            // console.log(res);
            if(res!=undefined){
              if(res.status=='201'){
                alert('注册成功!');
              }
              setTimeout(()=>{
                router.push({path:'/login'})
              },1000);
              userInfo.password='';
              userInfo.password_confirmation='';
            }
          })
        }
        
      }
      
      return {
        ...toRefs(userInfo),
        onSubmit,
      }
    }
  }
</script>

<style scoped>
  .ling-login{
    font-size: 14px;
    margin: 10px 10px 20px;
    color: #42b983;
    display: inline-block;
    float: left;
  }
</style>