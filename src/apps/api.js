import ApiRequest from "../utils/requests";

export default class Api extends ApiRequest {
    constructor(url) {super(url)}

    signUp = (username, email, password, fullname) => this.post('/users', {username, email, password, fullname});
    signIn = (username, password) => this.post('/user/auth', {username, password});
    getUser = () => this.get('/user');
    signOut = () => this.delete('/user/session');

    createTask = (taskData) => this.post(`/tasks`, taskData);
    getTasks = () => this.get(`/tasks`);
    getTask = (id) => this.get(`/tasks/${id}`);
    updateTask = (id, taskData) => this.put(`/tasks/${id}`, taskData);
    deleteTask = (id) => this.post(`/tasks/${id}`);

    sendSolution = (id, solution) => this.post(`/tasks/${id}/solutions`, solution);
    getSolutions = (id) => this.get(`/tasks/${id}/solutions`);
    getSolution = (taskId, solutionId) => this.get(`/tasks/${taskId}/solutions/${solutionId}`);
    deleteSolution = (taskId, solutionId) => this.delete(`/tasks/${taskId}/solutions/${solutionId}`);
}
