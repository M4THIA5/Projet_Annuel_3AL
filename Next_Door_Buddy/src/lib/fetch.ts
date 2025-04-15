class api {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // Méthode pour effectuer une requête GET
    async get(endpoint: string) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la requête GET:', error);
            throw error;
        }
    }

    // Méthode pour effectuer une requête POST
    async post(endpoint: string, data: any) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la requête POST:', error);
            throw error;
        }
    }

    // Méthode pour effectuer une requête PUT
    async put(endpoint: string, data: any) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la requête PUT:', error);
            throw error;
        }
    }

    // Méthode pour effectuer une requête DELETE
    async delete(endpoint: string) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la requête DELETE:', error);
            throw error;
        }
    }
}

export const API = new api('http://localhost:3001');



// Exemple d'une requête GET
// API.get('/tasks').then(data => console.log(data));

// Exemple d'une requête POST
// API.post('/tasks', { name: 'New Task', dueDate: '2025-04-15' }).then(data => console.log(data));

// Exemple d'une requête DELETE
// API.delete('/tasks/1').then(data => console.log(data));
