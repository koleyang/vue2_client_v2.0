import request from '@/utils/request'

export function getAchievementSG() {
  return request({
    url: '/trainingImplementation',
    method: 'get'
  })
}

export function updateAchievement(data, id) {
  return request({
    url: '/trainingImplementation/' + id,
    method: 'put',
    data
  })
}
