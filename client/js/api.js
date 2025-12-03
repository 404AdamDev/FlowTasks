const API_BASE_URL = 'http://localhost:3000/api';

export class TaskAPI {

    static async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error("API Error:", err);
            return { error: true, message: err.message };
        }
    }

    static getTasks() {
        return this.request('/tasks');
    }

    static getTasksByUser(userId) {
        return this.request(`/tasks/user/${userId}`);
    }

    static createTask(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData)
        });
    }

    static updateTask(id, taskData) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData)
        });
    }

    static deleteTask(id) {
        return this.request(`/tasks/${id}`, { method: 'DELETE' });
    }

    static getUsers() {
        return this.request('/users');
    }

    static createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userData)
        });
    }
}
