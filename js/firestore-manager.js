// Firestore Manager - Production-ready data persistence
class FirestoreManager {
    constructor() {
        this.db = null;
        this.appId = '__app_id'; // Replace with actual app ID
        this.init();
    }

    init() {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            this.db = firebase.firestore();
        }
    }

    // User Subscriptions
    async getUserSubscription(userId) {
        try {
            const doc = await this.db.collection(`artifacts/${this.appId}/users/${userId}/subscriptions`).doc('current').get();
            return doc.exists ? doc.data() : {tier: 'Free', status: 'active', messagesUsed: 0, messagesLimit: 5};
        } catch (e) {
            console.error('Get subscription error:', e);
            return {tier: 'Free', status: 'active', messagesUsed: 0, messagesLimit: 5};
        }
    }

    async updateSubscription(userId, data) {
        try {
            await this.db.collection(`artifacts/${this.appId}/users/${userId}/subscriptions`).doc('current').set(data, {merge: true});
            return {success: true};
        } catch (e) {
            console.error('Update subscription error:', e);
            return {success: false, error: e.message};
        }
    }

    // Enrollments
    async createEnrollment(userId, courseId) {
        try {
            const enrollmentId = `${userId}_${courseId}`;
            await this.db.collection(`artifacts/${this.appId}/public/data/enrollments`).doc(enrollmentId).set({
                userId,
                courseId,
                status: 'Approved', // Auto-approve for production
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                progress: 0
            });
            return {success: true, enrollmentId};
        } catch (e) {
            console.error('Create enrollment error:', e);
            return {success: false, error: e.message};
        }
    }

    async getEnrollments(userId) {
        try {
            const snapshot = await this.db.collection(`artifacts/${this.appId}/public/data/enrollments`)
                .where('userId', '==', userId)
                .where('status', '==', 'Approved')
                .get();
            return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        } catch (e) {
            console.error('Get enrollments error:', e);
            return [];
        }
    }

    listenToEnrollments(userId, callback) {
        return this.db.collection(`artifacts/${this.appId}/public/data/enrollments`)
            .where('userId', '==', userId)
            .onSnapshot(snapshot => {
                const enrollments = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                callback(enrollments);
            });
    }

    // Courses
    async getCourses() {
        try {
            const snapshot = await this.db.collection(`artifacts/${this.appId}/public/data/courses`).get();
            return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        } catch (e) {
            console.error('Get courses error:', e);
            return [];
        }
    }

    async getCourse(courseId) {
        try {
            const doc = await this.db.collection(`artifacts/${this.appId}/public/data/courses`).doc(courseId).get();
            return doc.exists ? {id: doc.id, ...doc.data()} : null;
        } catch (e) {
            console.error('Get course error:', e);
            return null;
        }
    }

    // Referrals
    async createReferral(referrerId, referredId) {
        try {
            await this.db.collection(`artifacts/${this.appId}/public/data/referrals`).add({
                referrerId,
                referredId,
                status: 'Pending',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            return {success: true};
        } catch (e) {
            console.error('Create referral error:', e);
            return {success: false, error: e.message};
        }
    }

    async updateReferralStatus(referralId, status) {
        try {
            await this.db.collection(`artifacts/${this.appId}/public/data/referrals`).doc(referralId).update({status});
            return {success: true};
        } catch (e) {
            console.error('Update referral error:', e);
            return {success: false, error: e.message};
        }
    }

    async getReferrals(userId) {
        try {
            const snapshot = await this.db.collection(`artifacts/${this.appId}/public/data/referrals`)
                .where('referrerId', '==', userId)
                .get();
            return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        } catch (e) {
            console.error('Get referrals error:', e);
            return [];
        }
    }

    // AI Chat History
    async saveChatMessage(userId, courseId, message) {
        try {
            await this.db.collection(`artifacts/${this.appId}/users/${userId}/chat_history`).add({
                courseId,
                role: message.role,
                content: message.content,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            return {success: true};
        } catch (e) {
            console.error('Save chat error:', e);
            return {success: false, error: e.message};
        }
    }

    async getChatHistory(userId, courseId, limit = 20) {
        try {
            const snapshot = await this.db.collection(`artifacts/${this.appId}/users/${userId}/chat_history`)
                .where('courseId', '==', courseId)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            return snapshot.docs.map(doc => doc.data()).reverse();
        } catch (e) {
            console.error('Get chat history error:', e);
            return [];
        }
    }

    // User Profile
    async getUserProfile(userId) {
        try {
            const doc = await this.db.collection(`artifacts/${this.appId}/users/${userId}/profile`).doc('data').get();
            return doc.exists ? doc.data() : null;
        } catch (e) {
            console.error('Get profile error:', e);
            return null;
        }
    }

    async updateUserProfile(userId, data) {
        try {
            await this.db.collection(`artifacts/${this.appId}/users/${userId}/profile`).doc('data').set(data, {merge: true});
            return {success: true};
        } catch (e) {
            console.error('Update profile error:', e);
            return {success: false, error: e.message};
        }
    }

    // Generate referral code
    generateReferralCode(userId) {
        return btoa(userId).replace(/=/g, '').substring(0, 8).toUpperCase();
    }
}

window.firestoreManager = new FirestoreManager();
