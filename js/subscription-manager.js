// Subscription Manager - SaaS tiered model
class SubscriptionManager {
    constructor() {
        this.tiers = {
            Free: {
                price: 0,
                aiModel: 'Flash',
                messageLimit: 5,
                courseAccess: 'Free',
                referralBenefit: 'None'
            },
            Basic: {
                price: 499,
                aiModel: 'Flash Unlimited',
                messageLimit: -1,
                courseAccess: 'Standard',
                referralBenefit: '1 month free'
            },
            Premium: {
                price: 999,
                aiModel: 'Gemini Pro',
                messageLimit: -1,
                courseAccess: 'All',
                referralBenefit: '2 months free'
            }
        };
    }

    async getCurrentTier(userId) {
        const subscription = await window.firestoreManager.getUserSubscription(userId);
        return subscription.tier || 'Free';
    }

    async upgradeTier(userId, newTier, paymentData) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        const subscriptionData = {
            tier: newTier,
            status: 'active',
            startDate: new Date().toISOString(),
            expiryDate: expiryDate.toISOString(),
            messagesUsed: 0,
            messagesLimit: this.tiers[newTier].messageLimit,
            payment: paymentData
        };

        return await window.firestoreManager.updateSubscription(userId, subscriptionData);
    }

    async applyReferralBonus(userId, referrerTier) {
        const bonusMonths = referrerTier === 'Premium' ? 2 : 1;
        const subscription = await window.firestoreManager.getUserSubscription(userId);
        
        const expiryDate = new Date(subscription.expiryDate || new Date());
        expiryDate.setMonth(expiryDate.getMonth() + bonusMonths);

        return await window.firestoreManager.updateSubscription(userId, {
            expiryDate: expiryDate.toISOString(),
            referralBonus: `${bonusMonths} months added`
        });
    }

    canAccessCourse(userTier, courseType) {
        if (courseType === 'Free') return true;
        if (courseType === 'Standard' && (userTier === 'Basic' || userTier === 'Premium')) return true;
        if (courseType === 'Premium' && userTier === 'Premium') return true;
        return false;
    }

    getTierFeatures(tier) {
        return this.tiers[tier] || this.tiers.Free;
    }

    showUpgradeModal(currentTier) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-4xl w-full p-8 border border-purple-500/30">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold">Upgrade Your Plan</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                    ${Object.entries(this.tiers).map(([tier, features]) => `
                        <div class="bg-slate-800 rounded-xl p-6 border ${currentTier === tier ? 'border-cyan-500' : 'border-slate-700'}">
                            <h3 class="text-2xl font-bold mb-2">${tier}</h3>
                            <div class="text-3xl font-bold text-cyan-400 mb-4">₹${features.price}/mo</div>
                            <ul class="space-y-2 mb-6 text-sm text-gray-300">
                                <li>✓ ${features.aiModel} AI</li>
                                <li>✓ ${features.messageLimit === -1 ? 'Unlimited' : features.messageLimit} messages</li>
                                <li>✓ ${features.courseAccess} courses</li>
                                <li>✓ ${features.referralBenefit} referral</li>
                            </ul>
                            ${currentTier === tier ? 
                                '<button class="w-full bg-gray-600 py-2 rounded-lg font-bold" disabled>Current Plan</button>' :
                                `<button onclick="upgradeTo('${tier}')" class="w-full bg-cyan-500 py-2 rounded-lg font-bold hover:bg-cyan-600">Upgrade</button>`
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

window.subscriptionManager = new SubscriptionManager();

async function upgradeTo(tier) {
    const user = JSON.parse(localStorage.getItem('axonflow_user'));
    if (!user) {
        alert('Please sign in first');
        return;
    }

    // Show payment modal
    const paymentModal = document.createElement('div');
    paymentModal.className = 'fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4';
    paymentModal.innerHTML = `
        <div class="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-cyan-500/30">
            <h3 class="text-2xl font-bold mb-4">Complete Payment</h3>
            <div class="bg-slate-800 rounded-lg p-4 mb-4">
                <div class="flex justify-between mb-2">
                    <span>Plan:</span>
                    <span class="font-bold">${tier}</span>
                </div>
                <div class="flex justify-between">
                    <span>Amount:</span>
                    <span class="font-bold text-cyan-400">₹${window.subscriptionManager.tiers[tier].price}</span>
                </div>
            </div>
            <div class="space-y-3">
                <input type="text" id="payment-txn" placeholder="UPI Transaction ID" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white">
                <button onclick="confirmUpgrade('${tier}')" class="w-full bg-cyan-500 py-3 rounded-lg font-bold hover:bg-cyan-600">Confirm Payment</button>
                <button onclick="this.closest('.fixed').remove()" class="w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(paymentModal);
}

async function confirmUpgrade(tier) {
    const txnId = document.getElementById('payment-txn').value;
    if (!txnId) {
        alert('Please enter transaction ID');
        return;
    }

    const user = JSON.parse(localStorage.getItem('axonflow_user'));
    const result = await window.subscriptionManager.upgradeTier(user.id, tier, {
        transactionId: txnId,
        method: 'UPI',
        amount: window.subscriptionManager.tiers[tier].price,
        date: new Date().toISOString()
    });

    if (result.success) {
        document.querySelectorAll('.fixed').forEach(el => el.remove());
        alert(`✅ Successfully upgraded to ${tier}!`);
        location.reload();
    } else {
        alert('❌ Upgrade failed. Please try again.');
    }
}
