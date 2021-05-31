import request from '@/utils/request'

export function getRoles() {
  return request({
    // url: '/roles',
    url: '/Role',
    method: 'get'
  })
}

export function getRolesSG() {
  return request({
    url: '/Role',
    method: 'get'
  })
}

export function getRole(id) {
  return request({
    url: '/Role/' + id,
    method: 'get'
  })
}

export function editRoleRights(data) {
  return request({
    url: '/Role/EditRoleRights',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/Role',
    method: 'post',
    data
  })
}

export function updateRole(data, id) {
  return request({
    // url: '/roles/' + id,
    url: '/Role/' + id,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    // url: '/roles/' + id,
    url: '/Role/' + id,
    method: 'delete'
  })
}
