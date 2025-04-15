// Fonction pour récupérer les détails d'un utilisateur

import {API} from "#/lib/fetch";

export const getUserDetails = async (userId: string) => {
    try {
        const userDetails = await API.get(`/users/${userId}`);
        return userDetails;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
        throw error;
    }
};
