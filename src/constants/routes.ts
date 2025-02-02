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

    '/:accountId': {
      _relative: (accountId: string) => `/${accountId}`,
      _full: (accountId: string) => `${BASE_ROUTE_PATH}/accounts/${accountId}`,
    },
  },
  transaction: {
    _relative: '/transactions',
    _full: `${BASE_ROUTE_PATH}/transactions`,

    deposit: {
      _relative: '/deposit',
      _full: `${BASE_ROUTE_PATH}/transactions/deposit`,
    },
    withdraw: {
      _relative: '/withdraw',
      _full: `${BASE_ROUTE_PATH}/transactions/withdraw`,
    },
    transfer: {
      _relative: '/transfer',
      _full: `${BASE_ROUTE_PATH}/transactions/transfer`,
    },
    history: {
      _relative: '/history',
      _full: `${BASE_ROUTE_PATH}/transactions/history`,
    },
  },
}
