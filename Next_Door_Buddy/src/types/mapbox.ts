import {UserNeighborhood} from "#/types/user"

export type MapboxNeighborhood = {
    status: number;
    district: string | null;
    city: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null
};

export type MapNeighborhoodProps = {
    users: UserNeighborhood[]
}

export type RegisterUserData = {
    email: string | null;
    password: string | null;
    firstName: string | null;
    lastName: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
};


export interface MapboxAdresse {
    city: string | null
    postalCode: string | null
    address: string | null
}
