export const Routes = {
  home: {
    toString: () => "/" as const,
  },
  login: {
    toString: () => "/login" as const,
  },
  register: {
    toString: () => "/register" as const,
  },
  verify: {
    toString: () => "/verify" as const,
  },
  forgotPassword: {
    toString: () => "/password" as const,
  },
  admin: {
    toString: () => "/admin" as const,
  },
  neighborhood:{
    toString : () => "/neighborhood" as const,
  },
  chat: {
    toString: () => "/chat" as const,
  },

  undefined: {
    toString: () => "/#" as const,
  },
}
