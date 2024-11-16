const BASE_ROUTE_PATH = '/api'

export const routeSubPaths = {
  auth: `${BASE_ROUTE_PATH}/auth`,
  accounts: `${BASE_ROUTE_PATH}/accounts`,
}

export const routes = {
  auth: {
    _relative: '/auth',
    _full: `${BASE_ROUTE_PATH}/auth`,
    register: {
      _relative: '/register',
      _full: `${BASE_ROUTE_PATH}/auth/register`,
    },
    login: {
      _relative: '/login',
      _full: `${BASE_ROUTE_PATH}/auth/login`,
    },
  },
  account: {
    _relative: '/accounts',
    _full: `${BASE_ROUTE_PATH}/accounts`,
  },
}
