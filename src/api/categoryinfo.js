import request from '@/utils/request'

export function getCategoryInfos () {
  return request({
    url: 'api/categoryinfos/',
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: 'api/categoryinfos/',
    method: 'post',
    data
  })
}

export function del (id) {
  return request({
    url: 'api/categoryinfos/' + id + '/',
    method: 'delete'
  })
}

export function edit (id, data) {
  return request({
    url: 'api/categoryinfos/' + id + '/',
    method: 'put',
    data
  })
}
