import request from '@/utils/request'

export function getModels() {
  return request({
    url: 'api/models/',
    method: 'get'
  })
}
export function getModelDetail(id) {
  return request({
    url: 'api/models/' + id + '/model_detail/',
    method: 'get'
  })
}
export function generaterCode(id, data) {
  console.log(data)
  return request({
    url: 'api/models/' + id + '/code_generate/',
    method: 'post',
    data
  })
}
