import axios from 'axios';

// Konfigurasi axios
const api = axios.create({
    baseURL: 'http://10.0.2.2:8000/api', // Gunakan 10.0.2.2 untuk Android emulator
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export interface Task {
    id?: string;
    task: string;
    mapel: string;
    deadline: string;
    isCompleted: boolean;
    category: string;
    created_at?: string;
    updated_at?: string;
}

export const taskService = {
    // GET: Mengambil semua tasks
    async getAllTasks(): Promise<Task[]> {
        try {
            const response = await api.get('/tasks');
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    // GET: Mengambil task berdasarkan ID
    async getTaskById(id: number): Promise<Task> {
        try {
            const response = await api.get(`/tasks/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching task with id ${id}:`, error);
            throw error;
        }
    },

    // POST: Membuat task baru
    async createTask(task: Omit<Task, 'id'>): Promise<Task> {
        try {
            const response = await api.post('/tasks', task);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    // PUT: Mengupdate task
    async updateTask(id: string, task: Partial<Task>): Promise<Task> {
        try {
            const response = await api.put(`/tasks/${id}`, task);
            return response.data;
        } catch (error) {
            console.error(`Error updating task with id ${id}:`, error);
            throw error;
        }
    },

    // DELETE: Menghapus task
    async deleteTask(id: string): Promise<void> {
        try {
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error(`Error deleting task with id ${id}:`, error);
            throw error;
        }
    }
}; 