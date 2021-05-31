import request from '@/utils/request'

export function getSubjectSG() {
  return request({
    url: '/Subject',
    method: 'get'
  })
}

export function addSubject(data) {
  return request({
    url: '/Subject',
    method: 'post',
    data
  })
}

export function updateSubject(data, id) {
  return request({
    url: '/Subject/' + id,
    method: 'put',
    data
  })
}

export function deleteSubject(id) {
  return request({
    url: '/Subject/' + id,
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
