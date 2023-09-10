import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router';
const home = () => import('../views/home/HomeView');
const category = () => import('../views/category/CategoryView');
const detail = () => import('../views/detail/DetailView');
const profile = () => import('../views/profile/ProfileView');
const shopcart = () => import('../views/shopcart/ShopCartView');
const Register = () => import('../views/profile/RegisterVie')
const Login = () => import('../views/profile/LoginView')
const Address = () => import('../views/profile/AddressView')
const addressedit = () => import('../views/profile/AddressEdit')
const createorder = () => import('../views/order/CreateOrder')
const orderdetail = () =>import('../views/order/OrderDetail')
const order = () =>import('../views/order/OrderView')
const setting = ()=> import('../views/profile/settingView')

import store from '../store';

const routes = [
  {
    path: '/',
    name: 'default',
    component: home,
    meta:{
      title:'图书兄弟'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    meta:{
      title:'图书兄弟'
    }
  },
  {
    path: '/category',
    name: 'category',
    component: category,
    meta:{
      title:'图书兄弟-分类'
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail,
    meta:{
      title:'图书兄弟-商品详情'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    meta:{
      title:'图书兄弟-个人中心',
      isAuthRequired:true,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'图书兄弟-用户注册'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta:{
      title:'图书兄弟-地址管理'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'图书兄弟-用户登陆'
    }
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: shopcart,
    meta:{
      title:'图书兄弟-购物车',
      isAuthRequired:true,
    }
  },
  {
    path: '/addressedit',
    name: 'addressedit',
    component: addressedit,
    meta:{
      title:'图书兄弟-地址编辑',
      isAuthRequired:true,
    }
  },
  {
    path: '/createorder',
    name: 'createorder',
    component: createorder,
    meta:{
      title:'图书兄弟-创建订单',
      isAuthRequired:true,
    }
  },
  {
    path: '/orderdetail',
    name: 'orderdetail',
    component: orderdetail,
    meta:{
      title:'图书兄弟-订单详情',
      isAuthRequired:true,
    }
  },
  {
    path: '/order',
    name: 'order',
    component: order,
    meta:{
      title:'图书兄弟-订单',
      isAuthRequired:true,
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: setting,
    meta:{
      title:'图书兄弟-账号设置',
      isAuthRequired:true,
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to,from,next)=>{
  if (to.meta.isAuthRequired && store.state.user.isLogin == false){
    alert('您还未登陆');
    return next('/login');
  }else{

    next();
  }
  document.title=to.meta.title;
})
export default router;
