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
        dashboard: {
            toString: () => "/admin/dashboard" as const,
        }
    },
    neighborhood: {
        toString: () => "/neighborhood" as const,
    },
    chat: {
        toString: () => "/chat" as const,
    },
    troc: {
        toString: () => "/troc" as const,
        objet: {
            toString: (id: string) => `/troc/objet/${id}` as const,
            modify: {
                toString: (id: string) => `/troc/objet/${id}/modify` as const,
            },
            create: {
                toString: () => "/troc/objet/create" as const,
            },
        },
        create: {
            toString: () => "/troc/create" as const,
        },
        accept: {
            toString: (id:string) => `/troc/accept/${id}` as const,
        },
        confirm: {
            toString: (id:string) => `/troc/confirm/${id}` as const,
        }
    },

    undefined: {
        toString: () => "/#" as const,
    },
}
