import request from '@/utils/request'

export function getStudentSG() {
  return request({
    url: '/Student',
    method: 'get'
  })
}

export function addStudent(data) {
  return request({
    url: '/Student',
    method: 'post',
    data
  })
}

export function updateStudent(data, id) {
  return request({
    url: '/Student/' + id,
    method: 'put',
    data
  })
}

export function deleteStudent(id) {
  return request({
    url: '/Student/' + id,
    method: 'delete'
  })
}
