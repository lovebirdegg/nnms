import request from '@/utils/request'

export function getNoticeList (noticeType) {
  return request({
    url: 'api/get_notice_list/?notice_type=' + noticeType,
    method: 'get'
  })
}
export function getNoticeCount () {
  return request({
    url: 'api/get_notice_count/',
    method: 'get'
  })
}
export function markAsRead (data) {
  return request({
    url: 'api/mark_as_read/',
    method: 'post',
    data
  })
}
export function markAlAslRead () {
  return request({
    url: 'api/mark_all_as_read/',
    method: 'post'
  })
}
