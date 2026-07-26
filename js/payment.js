// Enhanced Payment System for AxonFlow Academy
class PaymentSystem {
    constructor() {
        this.upiId = 'saurabh@paytm';
        this.init();
    }

    init() {
        console.log('💳 Payment System initialized');
    }

    generateQRCode(amount, description) {
        // Generate UPI QR code URL
        const upiUrl = `upi://pay?pa=${this.upiId}&pn=AxonFlow Academy&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
        
        // For demo, return a placeholder QR code
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
    }

    showPaymentModal(courseId, courseName, price, userDetails) {
        const modal = document.createElement('div');
        modal.id = 'payment-modal-dynamic';
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        
        const qrCodeUrl = this.generateQRCode(price, `Payment for ${courseName}`);
        
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl max-w-lg w-full border border-gray-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">Complete Payment</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="bg-gray-800 rounded-lg p-4">
                            <h4 class="text-white font-bold mb-2">Order Summary</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-300">Course:</span>
                                    <span class="text-white">${courseName}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-300">Student:</span>
                                    <span class="text-white">${userDetails.name}</span>
                                </div>
                                <div class="flex justify-between font-bold">
                                    <span class="text-gray-300">Total:</span>
                                    <span class="text-cyan-400">₹${price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <h4 class="text-green-400 font-bold mb-3 flex items-center">
                                <span class="mr-2">📱</span> Pay via UPI
                            </h4>
                            <div class="text-center">
                                <div class="bg-white p-4 rounded-lg inline-block mb-4">
                                    <img src="${qrCodeUrl}" alt="UPI QR Code" class="w-48 h-48">
                                </div>
                                <p class="text-white font-semibold mb-2">Scan QR Code or Pay to UPI ID:</p>
                                <div class="bg-gray-800 rounded-lg p-3 mb-4">
                                    <p class="text-cyan-400 font-mono text-lg">${this.upiId}</p>
                                    <button onclick="navigator.clipboard.writeText('${this.upiId}'); alert('UPI ID copied!')" class="text-sm text-gray-400 hover:text-white">Click to copy</button>
                                </div>
                                <p class="text-sm text-gray-300 mb-4">Amount: <span class="text-cyan-400 font-bold">₹${price.toLocaleString()}</span></p>
                            </div>
                        </div>
                        
                        <div class="space-y-3">
                            <input type="text" id="transaction-id-${courseId}" placeholder="Enter UPI Transaction ID" class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-green-500 focus:outline-none">
                            <button onclick="paymentSystem.confirmPayment('${courseId}', '${courseName}', ${price}, ${JSON.stringify(userDetails).replace(/"/g, '&quot;')})" class="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
                                Confirm Payment & Enroll
                            </button>
                        </div>
                        
                        <p class="text-xs text-gray-400 text-center">
                            After payment, enter your transaction ID above and click confirm. You'll receive course access within 2 hours.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    confirmPayment(courseId, courseName, price, userDetails) {
        const transactionId = document.getElementById(`transaction-id-${courseId}`).value;
        
        if (!transactionId) {
            alert('Please enter your UPI transaction ID');
            return;
        }
        
        // Store payment data
        const paymentData = {
            courseId,
            courseName,
            price,
            userDetails: typeof userDetails === 'string' ? JSON.parse(userDetails.replace(/&quot;/g, '"')) : userDetails,
            transactionId,
            timestamp: new Date().toISOString(),
            status: 'pending_verification',
            paymentMethod: 'UPI'
        };
        
        // Save to database
        if (window.academyDB) {
            window.academyDB.savePayment(paymentData);
            window.academyDB.saveEnrollment({
                ...paymentData,
                enrollmentStatus: 'pending_payment_verification'
            });
        }
        
        // Close modal
        document.getElementById('payment-modal-dynamic').remove();
        
        // Show success message
        this.showSuccessMessage(courseName, transactionId);
    }

    showSuccessMessage(courseName, transactionId) {
        const successModal = document.createElement('div');
        successModal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        
        successModal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl max-w-md w-full border border-green-500/30 p-6">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">✅</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">Enrollment Submitted!</h3>
                    <div class="space-y-2 text-left bg-gray-800 rounded-lg p-4 mb-6">
                        <p class="text-gray-300"><strong class="text-white">Course:</strong> ${courseName}</p>
                        <p class="text-gray-300"><strong class="text-white">Transaction ID:</strong> ${transactionId}</p>
                        <p class="text-gray-300"><strong class="text-white">Status:</strong> <span class="text-yellow-400">Pending Verification</span></p>
                    </div>
                    <p class="text-gray-300 mb-6">You'll receive course access within 2 hours. Check your email for updates.</p>
                    <button onclick="this.closest('.fixed').remove()" class="w-full bg-cyan-500 text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-colors">
                        Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(successModal)) {
                successModal.remove();
            }
        }, 10000);
    }

    // Razorpay integration (for future use)
    initRazorpay(amount, courseName, userDetails) {
        const options = {
            key: 'rzp_test_your_key_here', // Replace with actual Razorpay key
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'AxonFlow Academy',
            description: `Payment for ${courseName}`,
            image: '/logo.svg',
            handler: function(response) {
                paymentSystem.handleRazorpaySuccess(response, courseName, amount, userDetails);
            },
            prefill: {
                name: userDetails.name,
                email: userDetails.email,
                contact: userDetails.phone
            },
            theme: {
                color: '#06b6d4'
            }
        };
        
        if (typeof Razorpay !== 'undefined') {
            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            console.log('Razorpay not loaded, falling back to UPI');
            this.showPaymentModal(courseId, courseName, amount, userDetails);
        }
    }

    handleRazorpaySuccess(response, courseName, amount, userDetails) {
        const paymentData = {
            paymentId: response.razorpay_payment_id,
            courseName,
            amount,
            userDetails,
            timestamp: new Date().toISOString(),
            status: 'completed',
            paymentMethod: 'Razorpay'
        };
        
        if (window.academyDB) {
            window.academyDB.savePayment(paymentData);
        }
        
        alert(`🎉 Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    }
}

// Initialize payment system
window.paymentSystem = new PaymentSystem();