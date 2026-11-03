import axios from "axios"
import { TokenService } from "../services/storage.service"

const ApiService = {
  init(baseURL) {
    axios.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response && error.response.data) {
          if (error.response.data.status == "401") {
            localStorage.clear()
            window.location.href = "/login"
          }
        }
        return Promise.reject(error)
      }
    )
    axios.defaults.baseURL = baseURL
    axios.interceptors.response.use(response => {
      if (
        process.env.VUE_APP_DEBUG_MODE !== undefined &&
        process.env.VUE_APP_DEBUG_MODE == "true"
      ) {
        console.groupCollapsed("API response url:" + response.config.url)
        console.log(response)
        console.trace()
        console.groupEnd()
      }
      return response
    })
  },

  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`
  },

  removeHeader() {
    axios.defaults.headers.common = {}
  },

  get(resource, config) {
    return axios.get(resource, config)
  },

  post(resource, data) {
    return axios.post(resource, data)
  },

  put(resource, data) {
    return axios.put(resource, data)
  },

  delete(resource) {
    return axios.delete(resource)
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data)
  }
}

export default ApiService
