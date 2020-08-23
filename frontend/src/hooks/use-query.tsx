import axios, { Method } from 'axios'
import { useReducer, useEffect } from 'react'
import { storage, api } from '../helpers'

axios.interceptors.request.use(
  async (config) => {
    let token = storage.load('token')
    let serverCallUrl = new URL(config.url)

    if (serverCallUrl.pathname.includes('/token')) return config

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return new Promise((resolve, reject) => {
      const originalRequest = error.config
      const refreshToken = storage.load('refresh_token')
      // Refresh token if 401
      if (error.response && error.response.status === 401 && error.config && !error.config.__isRetryRequest && refreshToken) {
        originalRequest._retry = true

        const response = fetch(api.refreshToken, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        })
          .then((res) => {
            if (res.ok) {
              return res.json()
            } else {
              reject('Error with refresh token')
            }
          })
          .then((res) => {
            storage.save(res.access, 'token')
            return axios(originalRequest)
          })
          .catch((error) => {
            window.location.reload()
            storage.clear('token')
            storage.clear('refresh_token')
            reject(error)
          })
        resolve(response)
      }
      reject(error)
    })
  },
)

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'REQUEST':
      return {
        loading: true,
      }
    case 'SUCCESS':
      return {
        loading: false,
        data: action.payload,
      }
    case 'ERROR':
      return {
        loading: false,
        error: action.error,
      }
    default:
      return state
  }
}

const initialState = { loading: false }

export const useQuery = (url: string): State => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const request: FetchFunction = async ({ localUrl = url, isCancelled = false } = {}) => {
    dispatch({ type: 'REQUEST' })
    try {
      const result = await axios({ url: localUrl })
      !isCancelled && dispatch({ type: 'SUCCESS', payload: result.data || 'Success' })
    } catch (error) {
      !isCancelled && dispatch({ type: 'ERROR', error })
    }
  }

  useEffect(() => {
    let isCancelled = false
    request({ isCancelled })

    return () => {
      isCancelled = true
    }
  }, [])

  return { ...state, request }
}

export const useQueryGenerator = (url: string, method: Method = 'POST'): State => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const request: FetchFunction = async ({ localUrl = url, localData = undefined, localMethod = method, isCancelled } = {}) => {
    dispatch({ type: 'REQUEST' })
    try {
      const result = await axios({ url: localUrl, data: localData, method: localMethod })
      !isCancelled && dispatch({ type: 'SUCCESS', payload: result.data || 'Success' })
    } catch (error) {
      !isCancelled && dispatch({ type: 'ERROR', error })
    }
  }

  return { ...state, request }
}
