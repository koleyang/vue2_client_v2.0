import request from '@/utils/request'

export function getPermissions(params) {
  return request({
    url: '/permissions',
    method: 'get',
    params
  })
}

export function getPermissionsSG(params) {
  return request({
    url: '/Rights',
    method: 'get'
    // params
  })
}

export function getPermissionDispatch(params) {
  return request({
    url: '/permission/dispatch',
    method: 'get',
    params
  })
}

export function addPermission(data) {
  return request({
    // url: '/permissions',
    url: '/Rights',
    method: 'post',
    data
  })
}

export function updatePermission(data, id) {
  return request({
    url: '/Rights/' + id,
    method: 'put',
    data
  })
}

export function deletePermission(id) {
  return request({
    // url: '/permissions/' + id,
    url: '/Rights/' + id,
    method: 'delete'
  })
}
