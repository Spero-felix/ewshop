import { request } from './request';

export function getDetail(id) {
  return request({
    url: '/api/goods/'+id,
  });
}
// 收藏
export function collection(id) {
  return request({
    url:`/api/collects/goods/${id}`,
    method:'post'
  })
} 
