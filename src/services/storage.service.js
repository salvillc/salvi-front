const TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

function getCookieDomain() {
  if (typeof window === "undefined") return ""
  const hostname = window.location.hostname
  if (hostname.endsWith(".salvi.ua")) {
    return "; domain=.salvi.ua"
  }
  if (hostname === "salvi.ua") {
    return "; domain=.salvi.ua"
  }
  return ""
}

function setAuthCookie(token) {
  if (typeof document === "undefined") return
  const domainPart = getCookieDomain()
  const securePart = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : ""
  if (token) {
    document.cookie = `salvi_token=${encodeURIComponent(token)}; path=/${domainPart}; max-age=2592000; SameSite=Lax${securePart}`
    document.cookie = `access_token=${encodeURIComponent(token)}; path=/${domainPart}; max-age=2592000; SameSite=Lax${securePart}`
  } else {
    document.cookie = `salvi_token=; path=/${domainPart}; max-age=0; SameSite=Lax${securePart}`
    document.cookie = `access_token=; path=/${domainPart}; max-age=0; SameSite=Lax${securePart}`
  }
}

/**
 * Manage the how Access Tokens are being stored and retreived from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instace.
 **/
const TokenService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  saveToken(accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    setAuthCookie(accessToken)
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    setAuthCookie(null)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  saveRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

// Синхронизация куки авторизации для поддоменов .salvi.ua при инициализации
try {
  const existingToken = TokenService.getToken()
  if (existingToken) {
    setAuthCookie(existingToken)
  }
} catch (e) {}

export { TokenService }

