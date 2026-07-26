// Simple Database System for AxonFlow Academy
class AcademyDatabase {
    constructor() {
        this.init();
    }

    init() {
        // Initialize database tables in localStorage
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('enrollments')) {
            localStorage.setItem('enrollments', JSON.stringify([]));
        }
        if (!localStorage.getItem('payments')) {
            localStorage.setItem('payments', JSON.stringify([]));
        }
        console.log('📊 Academy Database initialized');
    }

    // User Management
    saveUser(userData) {
        const users = this.getUsers();
        const existingUserIndex = users.findIndex(u => u.email === userData.email);
        
        if (existingUserIndex >= 0) {
            users[existingUserIndex] = { ...users[existingUserIndex], ...userData };
        } else {
            userData.id = this.generateId();
            userData.createdAt = new Date().toISOString();
            users.push(userData);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        return userData;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    }

    // Enrollment Management
    saveEnrollment(enrollmentData) {
        const enrollments = this.getEnrollments();
        enrollmentData.id = this.generateId();
        enrollmentData.createdAt = new Date().toISOString();
        enrollmentData.status = enrollmentData.status || 'pending';
        
        enrollments.push(enrollmentData);
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        return enrollmentData;
    }

    getEnrollments() {
        return JSON.parse(localStorage.getItem('enrollments') || '[]');
    }

    getEnrollmentsByUser(userId) {
        const enrollments = this.getEnrollments();
        return enrollments.filter(e => e.userId === userId);
    }

    updateEnrollmentStatus(enrollmentId, status) {
        const enrollments = this.getEnrollments();
        const index = enrollments.findIndex(e => e.id === enrollmentId);
        
        if (index >= 0) {
            enrollments[index].status = status;
            enrollments[index].updatedAt = new Date().toISOString();
            localStorage.setItem('enrollments', JSON.stringify(enrollments));
            return enrollments[index];
        }
        return null;
    }

    // Payment Management
    savePayment(paymentData) {
        const payments = this.getPayments();
        paymentData.id = this.generateId();
        paymentData.createdAt = new Date().toISOString();
        paymentData.status = paymentData.status || 'pending';
        
        payments.push(paymentData);
        localStorage.setItem('payments', JSON.stringify(payments));
        return paymentData;
    }

    getPayments() {
        return JSON.parse(localStorage.getItem('payments') || '[]');
    }

    getPaymentsByUser(userId) {
        const payments = this.getPayments();
        return payments.filter(p => p.userId === userId);
    }

    verifyPayment(transactionId, amount) {
        const payments = this.getPayments();
        const payment = payments.find(p => 
            p.transactionId === transactionId && 
            p.amount === amount && 
            p.status === 'pending'
        );
        
        if (payment) {
            payment.status = 'verified';
            payment.verifiedAt = new Date().toISOString();
            localStorage.setItem('payments', JSON.stringify(payments));
            return payment;
        }
        return null;
    }

    // Analytics
    getStats() {
        const users = this.getUsers();
        const enrollments = this.getEnrollments();
        const payments = this.getPayments();
        
        return {
            totalUsers: users.length,
            totalEnrollments: enrollments.length,
            totalPayments: payments.length,
            totalRevenue: payments
                .filter(p => p.status === 'verified')
                .reduce((sum, p) => sum + p.amount, 0),
            pendingPayments: payments.filter(p => p.status === 'pending').length,
            activeEnrollments: enrollments.filter(e => e.status === 'active').length
        };
    }

    // Course Analytics
    getCourseStats() {
        const enrollments = this.getEnrollments();
        const courseStats = {};
        
        enrollments.forEach(enrollment => {
            if (!courseStats[enrollment.courseId]) {
                courseStats[enrollment.courseId] = {
                    courseName: enrollment.courseName,
                    enrollments: 0,
                    revenue: 0
                };
            }
            courseStats[enrollment.courseId].enrollments++;
            if (enrollment.status === 'active') {
                courseStats[enrollment.courseId].revenue += enrollment.price;
            }
        });
        
        return courseStats;
    }

    // Utility Functions
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    exportData() {
        return {
            users: this.getUsers(),
            enrollments: this.getEnrollments(),
            payments: this.getPayments(),
            exportedAt: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
        if (data.enrollments) localStorage.setItem('enrollments', JSON.stringify(data.enrollments));
        if (data.payments) localStorage.setItem('payments', JSON.stringify(data.payments));
        console.log('Data imported successfully');
    }

    clearAllData() {
        localStorage.removeItem('users');
        localStorage.removeItem('enrollments');
        localStorage.removeItem('payments');
        this.init();
        console.log('All data cleared');
    }

    // Search Functions
    searchUsers(query) {
        const users = this.getUsers();
        return users.filter(user => 
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase())
        );
    }

    searchEnrollments(query) {
        const enrollments = this.getEnrollments();
        return enrollments.filter(enrollment => 
            enrollment.courseName?.toLowerCase().includes(query.toLowerCase()) ||
            enrollment.userDetails?.name?.toLowerCase().includes(query.toLowerCase()) ||
            enrollment.userDetails?.email?.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Backup Functions
    createBackup() {
        const backup = {
            ...this.exportData(),
            backupVersion: '1.0',
            backupId: this.generateId()
        };
        
        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        backups.push(backup);
        
        // Keep only last 5 backups
        if (backups.length > 5) {
            backups.splice(0, backups.length - 5);
        }
        
        localStorage.setItem('backups', JSON.stringify(backups));
        return backup;
    }

    getBackups() {
        return JSON.parse(localStorage.getItem('backups') || '[]');
    }

    restoreBackup(backupId) {
        const backups = this.getBackups();
        const backup = backups.find(b => b.backupId === backupId);
        
        if (backup) {
            this.importData(backup);
            return true;
        }
        return false;
    }
}

// Initialize database
window.academyDB = new AcademyDatabase();

// Enhanced auth system integration
if (typeof auth !== 'undefined') {
    const originalSignIn = auth.signInWithGoogle;
    auth.signInWithGoogle = async function() {
        const result = await originalSignIn.call(this);
        if (result.success) {
            academyDB.saveUser(result.user);
        }
        return result;
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AcademyDatabase;
}