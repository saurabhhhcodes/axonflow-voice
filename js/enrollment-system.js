// Enrollment System - Proper enrollment with status management
class EnrollmentSystem {
    constructor() {
        this.unsubscribe = null;
    }

    async enrollInCourse(userId, courseId) {
        // Check if already enrolled
        const enrollments = await window.firestoreManager.getEnrollments(userId);
        if (enrollments.find(e => e.courseId === courseId)) {
            return {success: false, message: 'Already enrolled in this course'};
        }

        // Check subscription tier access
        const course = await window.firestoreManager.getCourse(courseId);
        const userTier = await window.subscriptionManager.getCurrentTier(userId);
        
        if (!window.subscriptionManager.canAccessCourse(userTier, course.type)) {
            return {
                success: false,
                message: `This is a ${course.type} course. Upgrade to ${course.type === 'Premium' ? 'Premium' : 'Basic'} to access.`,
                requiresUpgrade: true
            };
        }

        // Create enrollment
        const result = await window.firestoreManager.createEnrollment(userId, courseId);
        
        if (result.success) {
            // Check for referral and update status
            await this.checkAndUpdateReferral(userId);
        }

        return result;
    }

    async checkAndUpdateReferral(userId) {
        // Find pending referrals where this user is the referred
        const db = window.firestoreManager.db;
        const snapshot = await db.collection(`artifacts/${window.firestoreManager.appId}/public/data/referrals`)
            .where('referredId', '==', userId)
            .where('status', '==', 'Pending')
            .get();

        // Update referral status to Success
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, {status: 'Success'});
        });
        await batch.commit();

        // Apply referral bonus to referrer
        if (!snapshot.empty) {
            const referral = snapshot.docs[0].data();
            const referrerTier = await window.subscriptionManager.getCurrentTier(referral.referrerId);
            await window.subscriptionManager.applyReferralBonus(referral.referrerId, referrerTier);
        }
    }

    listenToEnrollments(userId, callback) {
        this.unsubscribe = window.firestoreManager.listenToEnrollments(userId, callback);
    }

    stopListening() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    showEnrollmentModal(courseId, courseName, courseType, coursePrice) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-purple-500/30">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">Enroll in Course</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div class="bg-slate-800 rounded-lg p-4 mb-6">
                    <h4 class="font-bold text-lg mb-2">${courseName}</h4>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-400">Type:</span>
                        <span class="font-bold text-cyan-400">${courseType}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Price:</span>
                        <span class="font-bold text-green-400">₹${coursePrice}</span>
                    </div>
                </div>

                <div id="enrollment-status" class="mb-4"></div>

                <button onclick="processEnrollment('${courseId}')" class="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-lg font-bold hover:shadow-lg transition">
                    Enroll Now
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

window.enrollmentSystem = new EnrollmentSystem();

async function processEnrollment(courseId) {
    const user = JSON.parse(localStorage.getItem('axonflow_user'));
    if (!user) {
        alert('Please sign in first');
        return;
    }

    const statusDiv = document.getElementById('enrollment-status');
    statusDiv.innerHTML = '<div class="text-center text-cyan-400">Processing enrollment...</div>';

    const result = await window.enrollmentSystem.enrollInCourse(user.id, courseId);

    if (result.success) {
        statusDiv.innerHTML = '<div class="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-300">✅ Successfully enrolled!</div>';
        setTimeout(() => {
            document.querySelector('.fixed').remove();
            location.reload();
        }, 1500);
    } else {
        if (result.requiresUpgrade) {
            statusDiv.innerHTML = `<div class="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 text-yellow-300">${result.message}</div>`;
            setTimeout(() => {
                document.querySelector('.fixed').remove();
                window.subscriptionManager.showUpgradeModal(await window.subscriptionManager.getCurrentTier(user.id));
            }, 2000);
        } else {
            statusDiv.innerHTML = `<div class="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300">${result.message}</div>`;
        }
    }
}
