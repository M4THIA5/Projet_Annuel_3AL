export const Routes = {
  home: {
    toString: () => "/" as const,
  },
  auth: {
    login: {
      toString: () => "/login" as const,
    },
    register: {
      toString: () => "/register" as const,
    },
    verify: {
      toString: () => "/verify" as const,
    },
    resetPassword: {
      whithEmail: {
        toString: (email: string) => `/reset-password/${email}` as const,
      },
      toString: () => `/reset-password` as const,
    },
  },
  profile: {
    toString: () => "/profile" as const,
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
