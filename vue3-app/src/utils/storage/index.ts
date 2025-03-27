import Cookie from './cookie'
import session from './sessionStorage'
import local from './localStorage'


export const cookie = Cookie
export const sessionStorage = session
export const localStorage = local

export default {
  cookie,
  sessionStorage,
  localStorage
}
