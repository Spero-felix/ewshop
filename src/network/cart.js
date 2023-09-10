import {request} from "@/network/request";

// 得到数据
export function getCart(data){
  return request({
    url:'/api/carts?'+data,
  })
}
// 修改购物车
export function modifyCart(id,data) {
  return request({
    url:`/api/carts/${id}`,
    method:'put',
    data,
  })
}
// 添加购物车
export function addCart(data){
  return request({
    url:'/api/carts',
    method:'post',
    data,
  })
}
// 选择商品的状态  所有选中的id
export function checkedCart(data){
  return request({
    url:'/api/carts/checked',
    method:'patch',
    data,
  })
}
// 删除购物车
export function deleteCartItem(id){
  return request({
    url:`/api/carts/${id}`,
    method:'delete',
  })
}