import axios from 'axios';
import router from "../router";
import {showToast} from 'vant';


export function request(config) {
  const instance = axios.create({
    baseURL: 'https://api.shop.eduwork.cn',
    timeout: 5000,
  });

  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      // 如果有借口需要认知才可以访问 就在这统一设置
      const token = localStorage.getItem('token');
      if(token){
        config.headers.Authorization = 'Bearer '+token;
      }
      // 直接放行
      return config;
    },
    (err) => {

      console.log(err);
    }
  );

  //响应拦截
  instance.interceptors.response.use(
    (res) => {
      console.log(res);
      return res.data ? res.data : res;
    }, (err) => {
      // 需要授权才可以访问的借口，统一去login授权
      if(err.response.status == '401'){
        showToast('未登陆');
        router.push({path:'/login'});
      }else if(err.response.status == '422'){
        // 如果有错误 这里面会处理 显示错误信息
        showToast(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
      }else if(err.response.status == '403'){
        showToast('服务器出错');
      }

    }
  );

  return instance(config);
}
