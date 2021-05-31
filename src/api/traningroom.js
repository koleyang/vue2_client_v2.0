import request from '@/utils/request'

export function getTrainingRoomInfo() {
  return request({
    url: '/TranningRoomInfo',
    method: 'get'
  })
}

export function addTrainingRoom(data) {
  return request({
    url: '/TranningRoomInfo',
    method: 'post',
    data
  })
}

export function updateTrainingRoom(data, id) {
  return request({
    url: '/TranningRoomInfo/' + id,
    method: 'put',
    data
  })
}

export function deleteTrainingRoom(id) {
  return request({
    url: '/TranningRoomInfo/' + id,
    method: 'delete'
  })
}

export function getEnvironmentalParameters(id) {
  return request({
    url: '/EnvironmentalParameters/getEnvironmentalParameters/' + id,
    method: 'get'
  })
}

export function addEnvironmentalParameters(data) {
  return request({
    url: '/EnvironmentalParameters',
    method: 'post',
    data
  })
}

export function updateEnvironmentalParameters(data, id) {
  return request({
    url: '/EnvironmentalParameters/' + id,
    method: 'put',
    data
  })
}

export function deleteEnvironmentalParameters(id) {
  return request({
    url: '/EnvironmentalParameters/' + id,
    method: 'delete'
  })
}

export function getScoringParameters(id) {
  return request({
    url: '/ScoringParameters/getScoringParameters/' + id,
    method: 'get'
  })
}

export function addScoringParameters(data) {
  return request({
    url: '/ScoringParameters',
    method: 'post',
    data
  })
}

export function updateScoringParameters(data, id) {
  return request({
    url: '/ScoringParameters/' + id,
    method: 'put',
    data
  })
}

export function deleteScoringParameters(id) {
  return request({
    url: '/ScoringParameters/' + id,
    method: 'delete'
  })
}
