import request from '@/utils/request'

export function getContents() {
  return request({
    url: 'api/contents/',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/contents/',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/contents/' + id + '/',
    method: 'delete'
  })
}

export function edit(id, data) {
  return request({
    url: 'api/contents/' + id + '/',
    method: 'put',
    data
  })
}
