import { createStore } from 'vuex'
import mutations from './mutations';
import actions from  './actions';
import getters from  './getters';


const state= {
    user:{
      isLogin:localStorage.getItem('token')=='' ? false : true ,
    },
  cartCount:0,
  }

export default createStore({
  state,
  getters,
  mutations,
  actions,
})
