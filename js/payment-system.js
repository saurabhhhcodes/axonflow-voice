// Enhanced Payment & Subscription System
class PaymentSystem {
    constructor() {
        this.razorpayKey = 'rzp_test_1234567890'; // Replace with actual key
        this.upiId = 'axonflow.in@ptyes';
        this.msmeNumber = 'UDYAM-MH-12-0012345'; // MSME Registration Number
        this.init();
    }

    init() {
        this.loadRazorpay();
        this.setupEventListeners();
    }

    loadRazorpay() {
        if (!document.getElementById('razorpay-script')) {
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            document.head.appendChild(script);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-payment-action]')) {
                const action = e.target.dataset.paymentAction;
                const data = JSON.parse(e.target.dataset.paymentData || '{}');
                this.handlePaymentAction(action, data);
            }
        });
    }

    handlePaymentAction(action, data) {
        switch (action) {
            case 'razorpay':
                this.initiateRazorpayPayment(data);
                break;
            case 'upi':
                this.showUPIPayment(data);
                break;
            case 'verify':
                this.verifyPayment(data);
                break;
        }
    }

    showPaymentModal(courseId, courseName, price, userDetails) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">Complete Payment</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <!-- MSME Badge -->
                    <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-6">
                        <div class="flex items-center">
                            <span class="text-green-400 mr-2">🏢</span>
                            <div>
                                <p class="text-green-300 font-semibold text-sm">MSME Registered Company</p>
                                <p class="text-green-400 text-xs">UDYAM: ${this.msmeNumber}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Summary -->
                    <div class="bg-slate-800 rounded-lg p-4 mb-6">
                        <h4 class="text-white font-bold mb-3">Order Summary</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-300">Course:</span>
                                <span class="text-white">${courseName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-300">Student:</span>
                                <span class="text-white">${userDetails.name}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-300">GST (18%):</span>
                                <span class="text-white">₹${Math.round(price * 0.18).toLocaleString()}</span>
                            </div>
                            <div class="border-t border-slate-600 pt-2 mt-2">
                                <div class="flex justify-between font-bold">
                                    <span class="text-slate-300">Total Amount:</span>
                                    <span class="text-cyan-400">₹${Math.round(price * 1.18).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Options -->
                    <div class="space-y-4">
                        <button onclick="paymentSystem.initiateRazorpayPayment({courseId: '${courseId}', courseName: '${courseName}', price: ${Math.round(price * 1.18)}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                class="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Pay with Razorpay (Cards/UPI/Wallets)
                        </button>
                        
                        <button onclick="paymentSystem.showUPIPayment({courseId: '${courseId}', courseName: '${courseName}', price: ${Math.round(price * 1.18)}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            Direct UPI Payment
                        </button>
                    </div>
                    
                    <p class="text-xs text-slate-400 text-center mt-4">
                        Secure payment • GST Invoice provided • Instant course access
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    initiateRazorpayPayment(data) {
        const { courseId, courseName, price, userDetails } = data;
        
        if (typeof Razorpay === 'undefined') {
            this.showUPIPayment(data);
            return;
        }

        const options = {
            key: this.razorpayKey,
            amount: price * 100, // Amount in paise
            currency: 'INR',
            name: 'AxonFlow Academy',
            description: courseName,
            image: '/logo.png',
            order_id: this.generateOrderId(),
            handler: (response) => {
                this.handlePaymentSuccess(response, data);
            },
            prefill: {
                name: userDetails.name,
                email: userDetails.email,
                contact: userDetails.phone
            },
            notes: {
                course_id: courseId,
                course_name: courseName,
                msme_number: this.msmeNumber
            },
            theme: {
                color: '#06b6d4'
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment cancelled');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    showUPIPayment(data) {
        const { courseId, courseName, price, userDetails } = data;
        
        // Close existing modal
        document.querySelector('.fixed')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">UPI Payment</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                        <h4 class="text-green-400 font-bold mb-3 flex items-center">
                            <span class="mr-2">📱</span> Pay via UPI
                        </h4>
                        <div class="text-center">
                            <div class="bg-white p-4 rounded-lg inline-block mb-4">
                                <div class="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                                    QR Code for ₹${price.toLocaleString()}
                                </div>
                            </div>
                            <p class="text-white font-semibold mb-2">Scan QR Code or Pay to UPI ID:</p>
                            <div class="bg-slate-800 rounded-lg p-3 mb-4">
                                <p class="text-cyan-400 font-mono text-lg">${this.upiId}</p>
                                <button onclick="navigator.clipboard.writeText('${this.upiId}'); this.textContent='Copied!'" 
                                        class="text-sm text-slate-400 hover:text-white">Click to copy</button>
                            </div>
                            <p class="text-sm text-slate-300 mb-4">Amount: <span class="text-cyan-400 font-bold">₹${price.toLocaleString()}</span></p>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <input type="text" id="transaction-id" placeholder="Enter UPI Transaction ID" 
                               class="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-green-500 focus:outline-none">
                        <button onclick="paymentSystem.verifyPayment({courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}, transactionId: document.getElementById('transaction-id').value})" 
                                class="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
                            Confirm Payment & Activate Course
                        </button>
                    </div>
                    
                    <p class="text-xs text-slate-400 text-center mt-4">
                        After payment, enter your transaction ID above. Course will be activated within 2 hours.
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handlePaymentSuccess(response, data) {
        const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            ...data
        };

        this.activateSubscription(paymentData);
    }

    verifyPayment(data) {
        const { transactionId, courseId, courseName, userDetails } = data;
        
        if (!transactionId) {
            alert('Please enter your UPI transaction ID');
            return;
        }

        // Store payment verification data
        const paymentData = {
            transactionId,
            courseId,
            courseName,
            userDetails,
            timestamp: new Date().toISOString(),
            status: 'pending_verification',
            paymentMethod: 'upi'
        };

        this.activateSubscription(paymentData);
    }

    activateSubscription(paymentData) {
        // Store enrollment and payment data
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        
        const enrollmentData = {
            id: this.generateEnrollmentId(),
            courseId: paymentData.courseId,
            courseName: paymentData.courseName,
            userDetails: paymentData.userDetails,
            paymentData: paymentData,
            enrollmentDate: new Date().toISOString(),
            status: 'active',
            expiryDate: this.calculateExpiryDate(),
            accessLevel: 'premium'
        };

        enrollments.push(enrollmentData);
        subscriptions.push({
            id: enrollmentData.id,
            courseId: paymentData.courseId,
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: enrollmentData.expiryDate,
            features: ['AI Teacher Access', 'Course Materials', 'Certificates', '1:1 Mentorship']
        });

        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        localStorage.setItem('enrolled_courses', JSON.stringify([...JSON.parse(localStorage.getItem('enrolled_courses') || '[]'), paymentData.courseId]));

        // Close payment modal
        document.querySelector('.fixed')?.remove();

        // Show success and activate course
        this.showSuccessMessage(enrollmentData);
        this.activateCourseAccess(enrollmentData);
    }

    showSuccessMessage(enrollmentData) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-green-500/30">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">🎉 Enrollment Successful!</h3>
                    <div class="space-y-2 text-sm text-slate-300 mb-6">
                        <p><strong>Course:</strong> ${enrollmentData.courseName}</p>
                        <p><strong>Enrollment ID:</strong> ${enrollmentData.id}</p>
                        <p><strong>Access:</strong> Lifetime</p>
                        <p><strong>Status:</strong> <span class="text-green-400">Active</span></p>
                    </div>
                    <div class="space-y-3">
                        <button onclick="this.closest('.fixed').remove(); window.aiTeacher?.toggleChat()" 
                                class="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors">
                            🤖 Start Learning with AI Teacher
                        </button>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="w-full bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition-colors">
                            Continue Browsing
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Auto-close after 10 seconds
        setTimeout(() => {
            modal.remove();
        }, 10000);
    }

    activateCourseAccess(enrollmentData) {
        // Update UI to show enrolled status
        const courseCards = document.querySelectorAll(`[data-course-id="${enrollmentData.courseId}"]`);
        courseCards.forEach(card => {
            if (card.classList.contains('enroll-btn')) {
                card.className = 'enroll-btn w-full py-3 px-4 rounded-lg font-medium transition-all bg-green-500/20 text-green-300 border border-green-500/30';
                card.textContent = '✓ Enrolled - Access Course';
                card.onclick = () => this.accessCourse(enrollmentData.courseId);
            }
        });

        // Start AI teacher for this course if available
        if (window.aiTeacher) {
            const course = this.findCourseById(enrollmentData.courseId);
            if (course) {
                setTimeout(() => {
                    window.aiTeacher.startCourse(course);
                }, 2000);
            }
        }
    }

    accessCourse(courseId) {
        // Check if user has active subscription
        const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        const activeSubscription = subscriptions.find(sub => 
            sub.courseId === courseId && sub.status === 'active'
        );

        if (!activeSubscription) {
            alert('Please enroll in this course first');
            return;
        }

        // Open course dashboard or AI teacher
        if (window.aiTeacher) {
            const course = this.findCourseById(courseId);
            if (course) {
                window.aiTeacher.startCourse(course);
                window.aiTeacher.toggleChat();
            }
        }
    }

    findCourseById(courseId) {
        if (typeof ENHANCED_COURSES === 'undefined') return null;
        
        for (const category of Object.values(ENHANCED_COURSES)) {
            const course = category.find(c => c.id === courseId);
            if (course) return course;
        }
        return null;
    }

    generateOrderId() {
        return 'order_' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    generateEnrollmentId() {
        return 'ENR_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    calculateExpiryDate() {
        // Lifetime access - set to 10 years from now
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 10);
        return expiryDate.toISOString();
    }
}

// Initialize Payment System
document.addEventListener('DOMContentLoaded', () => {
    window.paymentSystem = new PaymentSystem();
});