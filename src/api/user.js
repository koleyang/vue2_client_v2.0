import request from '@/utils/request'

export function zhuce(data) {
  console.log(data)
  return request({
    url: '/zhuce',
    method: 'post',
    data
  })
}

export function login(data) {
  console.log('data: ', data)
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function loginSG(data) {
  console.log('data: ', data)
  return request({
    url: '/Author/Login',
    method: 'post',
    data
  })
}

export function getInfoSG(token) {
  return request({
    url: '/user-info',
    method: 'get',
    params: { token }
  })
}

export function addUserSG(data) {
  return request({
    url: '/User',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function getUsersSG() {
  return request({
    url: '/User',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user-info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function updateUser(data, id) {
  return request({
    url: '/User/' + id,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/User/' + id,
    method: 'delete'
  })
}

export function resetPassword(id) {
  return request({
    url: '/User/ResetPassword/' + id,
    method: 'post'
  })
}
