import request from '@/utils/request'

export function getFolderTree () {
  return request({
    url: 'api/folders/',
    method: 'get'
  })
}
export function newFolder (data) {
  return request({
    url: 'api/folders/',
    method: 'post',
    data
  })
}
export function renameFolder (id, data) {
  return request({
    url: 'api/folders/' + id + '/',
    method: 'put',
    data
  })
}
export function del (id) {
  return request({
    url: 'api/folders/' + id + '/',
    method: 'delete'
  })
}
export function getFiles () {
  return request({
    url: 'api/files/',
    method: 'get'
  })
}
export function delFile (id) {
  return request({
    url: 'api/files/' + id + '/',
    method: 'delete'
  })
}
