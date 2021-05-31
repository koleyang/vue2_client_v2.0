import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserRole = 'role'
const LoadFirst = 'loadfirst'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRoles() {
  return Cookies.get(UserRole)
}

export function setRoles(role) {
  return Cookies.set(UserRole, role)
}

export function removeRoles() {
  return Cookies.remove(UserRole)
}

export function getIsLogin() {
  return Cookies.get(LoadFirst)
}

export function setIsLogin(load) {
  return Cookies.set(LoadFirst, load)
}

export function removeIsLogin() {
  return Cookies.remove(LoadFirst)
}
