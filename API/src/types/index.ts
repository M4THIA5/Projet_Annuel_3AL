export interface UserCreated {
  id?: number;
  nom: string;
  email: string;
  prenom:string;
}

export interface Data {
    id?: number;
    data: string;
}

export interface Credentials {
    email:string;
    password:string;
}