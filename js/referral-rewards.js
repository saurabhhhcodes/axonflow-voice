// Enhanced Referral & Rewards System
class ReferralRewards {
    constructor() {
        this.init();
    }

    init() {
        this.setupReferralTracking();
        this.displayReferralStatus();
    }

    setupReferralTracking() {
        // Generate unique referral code for user
        const user = JSON.parse(localStorage.getItem('axonflow_user') || '{}');
        if (user.uid && !user.referralCode) {
            user.referralCode = this.generateReferralCode(user.uid);
            localStorage.setItem('axonflow_user', JSON.stringify(user));
        }
    }

    generateReferralCode(uid) {
        return 'AXN' + uid.substring(0, 6).toUpperCase() + Math.random().toString(36).substr(2, 3).toUpperCase();
    }

    trackReferral(referralCode, newUserId) {
        const referrals = JSON.parse(localStorage.getItem('referrals') || '{}');
        const referrer = this.findUserByReferralCode(referralCode);
        
        if (referrer) {
            if (!referrals[referrer.uid]) {
                referrals[referrer.uid] = [];
            }
            
            referrals[referrer.uid].push({
                userId: newUserId,
                timestamp: new Date().toISOString(),
                status: 'pending',
                reward: 0
            });
            
            localStorage.setItem('referrals', JSON.stringify(referrals));
            this.checkReferralMilestones(referrer.uid);
        }
    }

    processReferralPayment(referrerId, amount) {
        const referrals = JSON.parse(localStorage.getItem('referrals') || '{}');
        const rewards = JSON.parse(localStorage.getItem('referral_rewards') || '{}');
        
        if (!rewards[referrerId]) {
            rewards[referrerId] = {
                totalEarnings: 0,
                pendingPayouts: 0,
                paidOut: 0,
                referralCount: 0,
                milestoneRewards: []
            };
        }
        
        const commission = Math.round(amount * 0.1); // 10% commission
        rewards[referrerId].totalEarnings += commission;
        rewards[referrerId].pendingPayouts += commission;
        rewards[referrerId].referralCount += 1;
        
        localStorage.setItem('referral_rewards', JSON.stringify(rewards));
        
        // Check for milestone rewards
        this.checkReferralMilestones(referrerId);
        
        // Show notification
        this.showReferralEarning(commission);
    }

    checkReferralMilestones(userId) {
        const rewards = JSON.parse(localStorage.getItem('referral_rewards') || '{}');
        const userRewards = rewards[userId];
        
        if (!userRewards) return;
        
        const milestones = [
            { count: 7, reward: 'free_premium_course', title: 'Free Premium Course' },
            { count: 15, reward: 'bonus_5000', title: '₹5,000 Bonus' },
            { count: 25, reward: 'free_certification', title: 'Free Certification' },
            { count: 50, reward: 'mentor_program', title: 'Mentor Program Access' }
        ];
        
        milestones.forEach(milestone => {
            if (userRewards.referralCount >= milestone.count && 
                !userRewards.milestoneRewards.includes(milestone.reward)) {
                
                userRewards.milestoneRewards.push(milestone.reward);
                this.awardMilestoneReward(userId, milestone);
            }
        });
        
        localStorage.setItem('referral_rewards', JSON.stringify(rewards));
    }

    awardMilestoneReward(userId, milestone) {
        if (milestone.reward === 'free_premium_course') {
            this.showFreeCourseModal(userId);
        } else {
            this.showMilestoneReward(milestone);
        }
    }

    showFreeCourseModal(userId) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-2xl w-full border border-green-500/30 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-3xl">🎉</span>
                        </div>
                        <h3 class="text-3xl font-bold text-white mb-2">Congratulations!</h3>
                        <p class="text-green-300 text-lg">You've earned a FREE Premium Course!</p>
                        <p class="text-slate-300 text-sm mt-2">7 successful referrals milestone reached</p>
                    </div>
                    
                    <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                        <h4 class="text-green-300 font-bold mb-2">🎁 Choose Your Free Premium Course</h4>
                        <p class="text-green-200 text-sm">Select any premium course worth up to ₹25,000 - completely free!</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors" onclick="referralRewards.claimFreeCourse('${userId}', 'ai-agent', 'AI Agent Development', 25000)">
                            <div class="flex items-center mb-2">
                                <span class="text-2xl mr-3">🤖</span>
                                <div>
                                    <h5 class="text-white font-semibold">AI Agent Development</h5>
                                    <p class="text-slate-300 text-sm">Worth ₹25,000</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors" onclick="referralRewards.claimFreeCourse('${userId}', 'data-analysis', 'Data Analysis', 20000)">
                            <div class="flex items-center mb-2">
                                <span class="text-2xl mr-3">📊</span>
                                <div>
                                    <h5 class="text-white font-semibold">Data Analysis</h5>
                                    <p class="text-slate-300 text-sm">Worth ₹20,000</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors" onclick="referralRewards.claimFreeCourse('${userId}', 'fullstack', 'Full-Stack Development', 18000)">
                            <div class="flex items-center mb-2">
                                <span class="text-2xl mr-3">💻</span>
                                <div>
                                    <h5 class="text-white font-semibold">Full-Stack Development</h5>
                                    <p class="text-slate-300 text-sm">Worth ₹18,000</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors" onclick="referralRewards.claimFreeCourse('${userId}', 'n8n', 'N8N Automation', 15000)">
                            <div class="flex items-center mb-2">
                                <span class="text-2xl mr-3">⚡</span>
                                <div>
                                    <h5 class="text-white font-semibold">N8N Automation</h5>
                                    <p class="text-slate-300 text-sm">Worth ₹15,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="this.closest('.fixed').remove()" class="w-full bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition-colors">
                        Choose Later
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    claimFreeCourse(userId, courseId, courseName, originalPrice) {
        // Close modal
        document.querySelector('.fixed')?.remove();
        
        // Add free course to enrollments
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const freeEnrollment = {
            id: 'FREE_' + Date.now().toString(36).toUpperCase(),
            courseId: courseId,
            courseName: courseName,
            userDetails: JSON.parse(localStorage.getItem('axonflow_user') || '{}'),
            paymentData: {
                method: 'referral_reward',
                originalPrice: originalPrice,
                paidAmount: 0,
                rewardType: '7_referral_milestone'
            },
            enrollmentDate: new Date().toISOString(),
            status: 'active',
            accessLevel: 'premium',
            rewardCourse: true
        };
        
        enrollments.push(freeEnrollment);
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        
        // Add to enrolled courses
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        enrolledCourses.push(courseId);
        localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
        
        // Show success
        this.showCourseClaimedSuccess(courseName, originalPrice);
        
        // Update UI
        this.updateCourseUI(courseId);
    }

    showCourseClaimedSuccess(courseName, originalPrice) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-green-500/30">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🎁</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">Course Claimed!</h3>
                    <div class="space-y-2 text-sm text-slate-300 mb-6">
                        <p><strong>Free Course:</strong> ${courseName}</p>
                        <p><strong>Original Value:</strong> ₹${originalPrice.toLocaleString()}</p>
                        <p><strong>You Saved:</strong> <span class="text-green-400">₹${originalPrice.toLocaleString()}</span></p>
                    </div>
                    <div class="space-y-3">
                        <button onclick="this.closest('.fixed').remove(); window.aiTeacher?.toggleChat()" 
                                class="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors">
                            🤖 Start Learning Now
                        </button>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="w-full bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition-colors">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => modal.remove(), 8000);
    }

    updateCourseUI(courseId) {
        const courseCards = document.querySelectorAll(`[data-course-id="${courseId}"]`);
        courseCards.forEach(card => {
            if (card.classList.contains('enroll-btn')) {
                card.className = 'enroll-btn w-full py-3 px-4 rounded-lg font-medium transition-all bg-green-500/20 text-green-300 border border-green-500/30';
                card.textContent = '🎁 Free Course - Access Now';
                card.onclick = () => this.accessFreeCourse(courseId);
            }
        });
    }

    displayReferralStatus() {
        const user = JSON.parse(localStorage.getItem('axonflow_user') || '{}');
        const rewards = JSON.parse(localStorage.getItem('referral_rewards') || '{}');
        
        if (!user.uid) return;
        
        const userRewards = rewards[user.uid] || { referralCount: 0, totalEarnings: 0 };
        const referralsToFreeCourse = Math.max(0, 7 - userRewards.referralCount);
        
        // Add referral widget to page
        const widget = document.createElement('div');
        widget.className = 'fixed bottom-4 right-4 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl p-4 text-white shadow-2xl z-40 max-w-sm';
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-bold">Referral Progress</h4>
                <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white">×</button>
            </div>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span>Referrals:</span>
                    <span class="font-bold">${userRewards.referralCount}/7</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2">
                    <div class="bg-white rounded-full h-2 transition-all" style="width: ${Math.min(100, (userRewards.referralCount / 7) * 100)}%"></div>
                </div>
                <p class="text-xs text-center">
                    ${referralsToFreeCourse > 0 
                        ? `${referralsToFreeCourse} more for FREE premium course!` 
                        : '🎉 Free course available!'}
                </p>
                <div class="flex justify-between text-xs">
                    <span>Earnings:</span>
                    <span class="font-bold">₹${userRewards.totalEarnings.toLocaleString()}</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Auto-hide after 10 seconds
        setTimeout(() => widget.remove(), 10000);
    }

    showReferralEarning(amount) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
        toast.innerHTML = `
            <div class="flex items-center">
                <span class="text-xl mr-2">💰</span>
                <div>
                    <p class="font-bold">Referral Earned!</p>
                    <p class="text-sm">+₹${amount.toLocaleString()}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    findUserByReferralCode(code) {
        // In production, this would query the database
        const users = JSON.parse(localStorage.getItem('all_users') || '[]');
        return users.find(user => user.referralCode === code);
    }
}

// Initialize referral system
document.addEventListener('DOMContentLoaded', () => {
    window.referralRewards = new ReferralRewards();
});