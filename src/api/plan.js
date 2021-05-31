import request from '@/utils/request'

export function list() {
  return request({
    url: '/vue-element-admin/plan/list',
    method: 'get'
  })
}
