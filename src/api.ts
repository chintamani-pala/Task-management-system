const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const session = localStorage.getItem('session');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (session) {
        const { access_token } = JSON.parse(session);
        headers['Authorization'] = `Bearer ${access_token}`;
    }
    return headers;
};



export const api = {
    auth: {
        signUp: async ({ email, password }: any) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return { data, error: null };
        },
        signIn: async ({ email, password }: any) => {
            const res = await fetch(`${API_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return { data, error: null };
        },
        getUser: async () => {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: getHeaders(),
            });
            if (!res.ok) return { data: { user: null }, error: null };
            const data = await res.json();
            return { data: { user: data.user }, error: null };
        }
    },
    settings: {
        get: async () => {
            const res = await fetch(`${API_URL}/settings`, {
                headers: getHeaders(),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return { data, error: null };
        },
        update: async (settings: any) => {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return { data, error: null };
        }
    },
    tasks: {
        list: async (params?: { page?: number; limit?: number; status?: string; priority?: string }) => {
            const queryParams = new URLSearchParams();
            if (params) {
                if (params.page) queryParams.append('page', params.page.toString());
                if (params.limit) queryParams.append('limit', params.limit.toString());
                if (params.status) queryParams.append('status', params.status);
                if (params.priority) queryParams.append('priority', params.priority);
            }

            const res = await fetch(`${API_URL}/tasks?${queryParams.toString()}`, {
                headers: getHeaders(),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            return { data, error: null };
        },
        create: async (task: any) => {
            const res = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(task),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return { error: null };
        },
        update: async (id: string, updates: any) => {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return { error: null };
        },
        delete: async (id: string) => {
            const res = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            return { error: null };
        }
    }
};
