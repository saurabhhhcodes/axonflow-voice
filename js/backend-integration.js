// Backend Integration for AxonFlow Platform
const BACKEND_URL = 'http://localhost:5000/api';

class BackendAPI {
    async signup(name, email, provider = 'email') {
        try {
            const response = await fetch(`${BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email, provider})
            });
            return await response.json();
        } catch (e) {
            console.error('Signup error:', e);
            return {success: false, error: e.message};
        }
    }

    async enroll(userId, courseId, courseName, price, transactionId) {
        try {
            const response = await fetch(`${BACKEND_URL}/enroll`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: userId, course_id: courseId, course_name: courseName, price, transaction_id: transactionId})
            });
            return await response.json();
        } catch (e) {
            console.error('Enrollment error:', e);
            return {success: false, error: e.message};
        }
    }

    async getAnalytics() {
        try {
            const response = await fetch(`${BACKEND_URL}/admin/analytics`);
            return await response.json();
        } catch (e) {
            console.error('Analytics error:', e);
            return {};
        }
    }

    async getUsers() {
        try {
            const response = await fetch(`${BACKEND_URL}/admin/users`);
            return await response.json();
        } catch (e) {
            console.error('Users error:', e);
            return {users: []};
        }
    }

    async getEnrollments() {
        try {
            const response = await fetch(`${BACKEND_URL}/admin/enrollments`);
            return await response.json();
        } catch (e) {
            console.error('Enrollments error:', e);
            return {enrollments: []};
        }
    }
}

window.backendAPI = new BackendAPI();
