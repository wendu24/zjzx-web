import request from '@/utils/request'

// 获取舆情列表
export function getYuqingListMethod(data) {
  return request({
    url: '/yuqing/blog/list',
    method: 'post',
    data
  })
}

// 舆情 - 新增
export function addYuqingMethod(data) {
  return request({
    url: '/yuqing/blog/add',
    method: 'post',
    data
  })
}

// 舆情 - 更新
export function updateYuqingMethod(data) {
  return request({
    url: '/yuqing/blog/update',
    method: 'post',
    data
  })
}

// 舆情 - 删除
export function delYuqingMethod(data) {
  return request({
    url: '/yuqing/blog/delete',
    method: 'post',
    data
  })
}

// 舆情 - 修改监测状态
export function changeYuqingStatusMethod(data) {
  return request({
    url: '/yuqing/blog/changeStatus',
    method: 'post',
    data
  })
}

// 舆情 - 查看舆情热度
export function hotRecordMethod(id) {
  return request({
    url: '/yuqing/hotRecord/list/' + id,
    method: 'get'
  })
}

