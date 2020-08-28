import request from '@/utils/request'

export function initWorkFlowState(id) {
  return request({
    url: 'api/workflow_test/?id=' + id,
    method: 'get'
  })
}
export function newTicket(data) {
  return request({
    url: 'api/new_ticket/',
    method: 'post',
    data
  })
}
export function getTickets(data) {
  return request({
    url: 'api/get_tickets/',
    method: 'get',
    data
  })
}
export function getTicketDetail(id) {
  return request({
    url: 'api/get_ticket_detail/?id=' + id,
    method: 'get'
  })
}
export function getTicketFlowStep(id) {
  return request({
    url: 'api/get_ticket_flowstep/?id=' + id,
    method: 'get'
  })
}
export function getTicketFlowLogs(id) {
  return request({
    url: 'api/get_ticket_flowlogs/?id=' + id,
    method: 'get'
  })
}
export function getTicketTransitions(id) {
  return request({
    url: 'api/get_ticket_transitions/?id=' + id,
    method: 'get'
  })
}
export function handleTicket(id, data) {
  return request({
    url: 'api/handle_ticket/?id=' + id,
    method: 'patch',
    data
  })
}
