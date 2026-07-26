// User-Specific Storage System
class UserStorage {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('axonflow_user') || 'null');
    }

    getUserKey(key) {
        const user = this.getCurrentUser();
        return user ? `${user.id}_${key}` : key;
    }

    // Enrolled Courses
    getEnrolledCourses() {
        return JSON.parse(localStorage.getItem(this.getUserKey('enrolled_courses')) || '[]');
    }

    addEnrolledCourse(courseId, courseData) {
        const courses = this.getEnrolledCourses();
        if (!courses.find(c => c.id === courseId)) {
            courses.push({
                id: courseId,
                ...courseData,
                enrolledAt: new Date().toISOString(),
                progress: 0
            });
            localStorage.setItem(this.getUserKey('enrolled_courses'), JSON.stringify(courses));
        }
    }

    // User Progress
    getUserProgress() {
        return JSON.parse(localStorage.getItem(this.getUserKey('user_progress')) || '{"quizzesTaken":0,"avgScore":0,"certificates":0}');
    }

    updateUserProgress(progress) {
        localStorage.setItem(this.getUserKey('user_progress'), JSON.stringify(progress));
    }

    // Quiz Results
    getQuizResults() {
        return JSON.parse(localStorage.getItem(this.getUserKey('quiz_results')) || '[]');
    }

    addQuizResult(result) {
        const results = this.getQuizResults();
        results.push({...result, timestamp: new Date().toISOString()});
        localStorage.setItem(this.getUserKey('quiz_results'), JSON.stringify(results));
    }

    // Certificates
    getCertificates() {
        return JSON.parse(localStorage.getItem(this.getUserKey('certificates')) || '[]');
    }

    addCertificate(cert) {
        const certs = this.getCertificates();
        certs.push({...cert, issuedAt: new Date().toISOString()});
        localStorage.setItem(this.getUserKey('certificates'), JSON.stringify(certs));
    }

    // Assignments
    getAssignments(courseId = null) {
        const assignments = JSON.parse(localStorage.getItem(this.getUserKey('assignments')) || '[]');
        return courseId ? assignments.filter(a => a.courseId === courseId) : assignments;
    }

    saveQuizResult(courseId, result) {
        const results = JSON.parse(localStorage.getItem(this.getUserKey('quiz_results')) || '[]');
        results.push({courseId, ...result});
        localStorage.setItem(this.getUserKey('quiz_results'), JSON.stringify(results));
    }

    getQuizResults(courseId = null) {
        const results = JSON.parse(localStorage.getItem(this.getUserKey('quiz_results')) || '[]');
        return courseId ? results.filter(r => r.courseId === courseId) : results;
    }

    updateAssignment(assignmentId, data) {
        const assignments = this.getAssignments();
        const index = assignments.findIndex(a => a.id === assignmentId);
        if (index >= 0) {
            assignments[index] = {...assignments[index], ...data};
        } else {
            assignments.push({id: assignmentId, ...data});
        }
        localStorage.setItem(this.getUserKey('assignments'), JSON.stringify(assignments));
    }

    // Clear user data on logout
    clearUserData() {
        const user = this.getCurrentUser();
        if (user) {
            const keys = ['enrolled_courses', 'user_progress', 'quiz_results', 'certificates', 'assignments'];
            keys.forEach(key => localStorage.removeItem(this.getUserKey(key)));
        }
    }
}

window.userStorage = new UserStorage();
