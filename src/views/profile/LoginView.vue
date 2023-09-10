<template>
  <div>
    <nav-bar>
      <template v-slot:default>登陆</template>
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
            v-model="email"
            name="电子邮箱"
            label="电子邮箱"
            placeholder="电子邮箱"
            :rules="[{ required: true, message: '请填写电子邮箱' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <div class="ling-login" @click="$router.push({path:'/register'})">
            立即注册！
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
  import {login} from "@/network/user";
  import {useRouter} from "vue-router";
  import {useStore} from 'vuex';

  export default {
    name: "LoginView",
    components:{
      NavBar,
    },
    setup(){
      const router = useRouter();
      const store = useStore();
      const userInfo = reactive({
        email:'',
        password:'',
      })

      const onSubmit = ()=>{
        login(userInfo).then(res=>{
          // 将token保存在本地   123456789
          if(res){
            localStorage.setItem('token',res.access_token);
            store.commit('setIsLogin','true');
            alert('登陆成功!');
            userInfo.password='';
            userInfo.email='';
            setTimeout(()=>{
              router.go(-1);
            },500);
          }
        })
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