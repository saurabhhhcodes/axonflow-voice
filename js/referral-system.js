// Referral System - Proper referral tracking and rewards
class ReferralSystem {
    constructor() {
        this.referralCode = null;
    }

    async initializeReferral(userId) {
        // Get or create referral code
        let profile = await window.firestoreManager.getUserProfile(userId);
        
        if (!profile || !profile.referralCode) {
            this.referralCode = window.firestoreManager.generateReferralCode(userId);
            await window.firestoreManager.updateUserProfile(userId, {
                referralCode: this.referralCode
            });
        } else {
            this.referralCode = profile.referralCode;
        }

        return this.referralCode;
    }

    getReferralLink(referralCode) {
        return `${window.location.origin}?ref=${referralCode}`;
    }

    async processReferralSignup(referralCode, newUserId) {
        // Find referrer by code
        const db = window.firestoreManager.db;
        const snapshot = await db.collection(`artifacts/${window.firestoreManager.appId}/users`)
            .where('profile.referralCode', '==', referralCode)
            .limit(1)
            .get();

        if (snapshot.empty) return {success: false, message: 'Invalid referral code'};

        const referrerId = snapshot.docs[0].id;
        
        // Create referral record
        return await window.firestoreManager.createReferral(referrerId, newUserId);
    }

    async getReferralStats(userId) {
        const referrals = await window.firestoreManager.getReferrals(userId);
        
        return {
            total: referrals.length,
            pending: referrals.filter(r => r.status === 'Pending').length,
            success: referrals.filter(r => r.status === 'Success').length,
            referrals: referrals
        };
    }

    showReferralDashboard(userId) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-2xl w-full p-8 border border-purple-500/30">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold">Referral Dashboard</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div id="referral-content" class="space-y-6">
                    <div class="text-center text-gray-400">Loading...</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.loadReferralContent(userId);
    }

    async loadReferralContent(userId) {
        const referralCode = await this.initializeReferral(userId);
        const stats = await this.getReferralStats(userId);
        const referralLink = this.getReferralLink(referralCode);

        const content = document.getElementById('referral-content');
        content.innerHTML = `
            <div class="bg-slate-800 rounded-lg p-6">
                <h3 class="text-xl font-bold mb-4">Your Referral Link</h3>
                <div class="flex items-center space-x-2">
                    <input type="text" value="${referralLink}" readonly class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm">
                    <button onclick="copyReferralLink('${referralLink}')" class="bg-cyan-500 px-4 py-2 rounded-lg font-bold hover:bg-cyan-600">Copy</button>
                </div>
                <p class="text-sm text-gray-400 mt-2">Share this link to earn rewards when friends enroll!</p>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                    <div class="text-3xl font-bold text-cyan-400">${stats.total}</div>
                    <div class="text-sm text-gray-400">Total Referrals</div>
                </div>
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                    <div class="text-3xl font-bold text-yellow-400">${stats.pending}</div>
                    <div class="text-sm text-gray-400">Pending</div>
                </div>
                <div class="bg-slate-800 rounded-lg p-4 text-center">
                    <div class="text-3xl font-bold text-green-400">${stats.success}</div>
                    <div class="text-sm text-gray-400">Successful</div>
                </div>
            </div>

            <div class="bg-slate-800 rounded-lg p-6">
                <h3 class="text-xl font-bold mb-4">Referral Rewards</h3>
                <ul class="space-y-2 text-sm text-gray-300">
                    <li>✓ <strong>Basic Tier:</strong> Get 1 month free when referred user enrolls</li>
                    <li>✓ <strong>Premium Tier:</strong> Get 2 months free when referred user enrolls</li>
                    <li>✓ <strong>Unlimited:</strong> Refer as many friends as you want</li>
                </ul>
            </div>

            ${stats.referrals.length > 0 ? `
                <div class="bg-slate-800 rounded-lg p-6">
                    <h3 class="text-xl font-bold mb-4">Recent Referrals</h3>
                    <div class="space-y-2">
                        ${stats.referrals.slice(0, 5).map(r => `
                            <div class="flex justify-between items-center py-2 border-b border-slate-700">
                                <span class="text-sm text-gray-400">${new Date(r.timestamp?.toDate()).toLocaleDateString()}</span>
                                <span class="px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
                                    ${r.status}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }
}

window.referralSystem = new ReferralSystem();

function copyReferralLink(link) {
    navigator.clipboard.writeText(link);
    alert('✅ Referral link copied to clipboard!');
}

// Check for referral code on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
        localStorage.setItem('pending_referral', refCode);
    }
});
