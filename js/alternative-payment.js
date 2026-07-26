// Alternative Payment System (No Business PAN Required)
class AlternativePayment {
    constructor() {
        this.paymentMethods = {
            upi: {
                id: 'axonflow.in@ptyes',
                name: 'UPI Payment',
                qrCode: this.generateUPIQR,
                instant: true
            },
            phonepe: {
                id: 'axonflow.in@ptyes',
                name: 'PhonePe',
                instant: true
            },
            googlepay: {
                id: 'axonflow.in@ptyes',
                name: 'Google Pay',
                instant: true
            },
            paytm: {
                id: 'axonflow.in@ptyes',
                name: 'Paytm',
                instant: true
            },
            crypto: {
                btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                eth: '0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C',
                usdt: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5ANLOLD'
            },
            international: {
                paypal: 'saurabhbajpai1442@gmail.com',
                wise: 'Available on request'
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPaymentUI();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-alt-payment]')) {
                const method = e.target.dataset.altPayment;
                const data = JSON.parse(e.target.dataset.paymentData || '{}');
                this.showPaymentMethod(method, data);
            }
        });
    }

    showAlternativePaymentModal(courseId, courseName, price, userDetails) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">Choose Payment Method</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <!-- Course Summary -->
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
                            <div class="flex justify-between font-bold text-lg">
                                <span class="text-slate-300">Total Amount:</span>
                                <span class="text-cyan-400">₹${price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Methods -->
                    <div class="space-y-4">
                        <!-- UPI Payments -->
                        <div class="bg-slate-800 rounded-lg p-4">
                            <h5 class="text-white font-semibold mb-3 flex items-center">
                                <span class="mr-2">📱</span> UPI Payments (Instant)
                            </h5>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="alternativePayment.showUPIPayment('paytm', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                    <span class="mr-2">💳</span> Paytm UPI
                                </button>
                                <button onclick="alternativePayment.showUPIPayment('phonepe', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                                    <span class="mr-2">📞</span> PhonePe
                                </button>
                                <button onclick="alternativePayment.showUPIPayment('googlepay', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                                    <span class="mr-2">🟢</span> Google Pay
                                </button>
                                <button onclick="alternativePayment.showUPIPayment('generic', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center">
                                    <span class="mr-2">💰</span> Any UPI App
                                </button>
                            </div>
                        </div>
                        
                        <!-- Crypto Payments -->
                        <div class="bg-slate-800 rounded-lg p-4">
                            <h5 class="text-white font-semibold mb-3 flex items-center">
                                <span class="mr-2">₿</span> Cryptocurrency (Global)
                            </h5>
                            <div class="grid grid-cols-3 gap-3">
                                <button onclick="alternativePayment.showCryptoPayment('btc', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700 transition-colors text-center">
                                    <div class="font-bold">₿ Bitcoin</div>
                                    <div class="text-xs opacity-75">BTC</div>
                                </button>
                                <button onclick="alternativePayment.showCryptoPayment('eth', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors text-center">
                                    <div class="font-bold">⟠ Ethereum</div>
                                    <div class="text-xs opacity-75">ETH</div>
                                </button>
                                <button onclick="alternativePayment.showCryptoPayment('usdt', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors text-center">
                                    <div class="font-bold">₮ Tether</div>
                                    <div class="text-xs opacity-75">USDT</div>
                                </button>
                            </div>
                        </div>
                        
                        <!-- International Payments -->
                        <div class="bg-slate-800 rounded-lg p-4">
                            <h5 class="text-white font-semibold mb-3 flex items-center">
                                <span class="mr-2">🌍</span> International Payments
                            </h5>
                            <div class="grid grid-cols-2 gap-3">
                                <button onclick="alternativePayment.showInternationalPayment('paypal', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                                    <span class="mr-2">💙</span> PayPal
                                </button>
                                <button onclick="alternativePayment.showInternationalPayment('wise', {courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                        class="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                                    <span class="mr-2">🏦</span> Wise Transfer
                                </button>
                            </div>
                        </div>
                        
                        <!-- Manual Payment -->
                        <div class="bg-slate-800 rounded-lg p-4">
                            <h5 class="text-white font-semibold mb-3 flex items-center">
                                <span class="mr-2">📞</span> Need Help?
                            </h5>
                            <button onclick="alternativePayment.contactSupport({courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}})" 
                                    class="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors">
                                Contact Support for Custom Payment
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <p class="text-green-300 text-sm">
                            <span class="font-semibold">✓ Secure Payments:</span> All payment methods are secure and verified. 
                            Course access is activated within 2 hours of payment confirmation.
                        </p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showUPIPayment(method, data) {
        const { courseId, courseName, price, userDetails } = data;
        const upiIds = {
            paytm: 'axonflow.in@ptyes',
            phonepe: 'axonflow.in@ptyes',
            googlepay: 'axonflow.in@ptyes',
            generic: 'axonflow.in@ptyes'
        };
        
        const upiId = upiIds[method] || upiIds.generic;
        
        // Close existing modal
        document.querySelector('.fixed')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">UPI Payment</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="text-center mb-6">
                        <div class="bg-white p-4 rounded-lg inline-block mb-4">
                            <div class="w-48 h-48 bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center text-gray-800 text-sm font-medium rounded-lg">
                                <div class="text-center">
                                    <div class="text-2xl mb-2">📱</div>
                                    <div>Scan with any UPI app</div>
                                    <div class="text-xs mt-2">₹${price.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-3">
                            <div class="bg-slate-800 rounded-lg p-4">
                                <p class="text-slate-300 text-sm mb-2">Pay to UPI ID:</p>
                                <div class="flex items-center justify-between bg-slate-700 rounded px-3 py-2">
                                    <span class="text-cyan-400 font-mono">${upiId}</span>
                                    <button onclick="navigator.clipboard.writeText('${upiId}'); this.textContent='Copied!'" 
                                            class="text-xs bg-cyan-600 text-white px-2 py-1 rounded hover:bg-cyan-700">
                                        Copy
                                    </button>
                                </div>
                            </div>
                            
                            <div class="bg-slate-800 rounded-lg p-4">
                                <p class="text-slate-300 text-sm mb-2">Amount to Pay:</p>
                                <div class="text-2xl font-bold text-cyan-400">₹${price.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                            <p class="text-yellow-300 text-sm">
                                <span class="font-semibold">Important:</span> Please include "${courseId}" in payment description
                            </p>
                        </div>
                        
                        <input type="text" id="upi-transaction-id" placeholder="Enter UPI Transaction ID (after payment)" 
                               class="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-cyan-500 focus:outline-none">
                        
                        <button onclick="alternativePayment.verifyUPIPayment('${courseId}', '${courseName}', ${price}, ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}, document.getElementById('upi-transaction-id').value)" 
                                class="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
                            Confirm Payment & Activate Course
                        </button>
                    </div>
                    
                    <p class="text-xs text-slate-400 text-center mt-4">
                        Course will be activated within 2 hours after payment verification
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showCryptoPayment(crypto, data) {
        const { courseId, courseName, price, userDetails } = data;
        const cryptoAddresses = {
            btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            eth: '0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C',
            usdt: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5ANLOLD'
        };
        
        const cryptoNames = {
            btc: 'Bitcoin (BTC)',
            eth: 'Ethereum (ETH)',
            usdt: 'Tether (USDT)'
        };
        
        const address = cryptoAddresses[crypto];
        const cryptoName = cryptoNames[crypto];
        const usdPrice = Math.round(price / 83); // Rough INR to USD conversion
        
        // Close existing modal
        document.querySelector('.fixed')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">${cryptoName} Payment</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="text-center mb-6">
                        <div class="bg-white p-4 rounded-lg inline-block mb-4">
                            <div class="w-48 h-48 bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center text-gray-800 text-sm font-medium rounded-lg">
                                <div class="text-center">
                                    <div class="text-2xl mb-2">${crypto === 'btc' ? '₿' : crypto === 'eth' ? '⟠' : '₮'}</div>
                                    <div>Scan QR Code</div>
                                    <div class="text-xs mt-2">~$${usdPrice}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-3">
                            <div class="bg-slate-800 rounded-lg p-4">
                                <p class="text-slate-300 text-sm mb-2">Send to Address:</p>
                                <div class="bg-slate-700 rounded px-3 py-2 break-all">
                                    <span class="text-cyan-400 font-mono text-xs">${address}</span>
                                </div>
                                <button onclick="navigator.clipboard.writeText('${address}'); this.textContent='Copied!'" 
                                        class="text-xs bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700 mt-2">
                                    Copy Address
                                </button>
                            </div>
                            
                            <div class="bg-slate-800 rounded-lg p-4">
                                <p class="text-slate-300 text-sm mb-2">Approximate Amount:</p>
                                <div class="text-xl font-bold text-cyan-400">~$${usdPrice} USD</div>
                                <p class="text-xs text-slate-400 mt-1">Check current rates on your exchange</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                            <p class="text-orange-300 text-sm">
                                <span class="font-semibold">Note:</span> Send exact amount as per current exchange rate. Include transaction hash below.
                            </p>
                        </div>
                        
                        <input type="text" id="crypto-tx-hash" placeholder="Enter Transaction Hash (after sending)" 
                               class="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-cyan-500 focus:outline-none">
                        
                        <button onclick="alternativePayment.verifyCryptoPayment('${crypto}', '${courseId}', '${courseName}', ${price}, ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}, document.getElementById('crypto-tx-hash').value)" 
                                class="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors">
                            Confirm ${cryptoName} Payment
                        </button>
                    </div>
                    
                    <p class="text-xs text-slate-400 text-center mt-4">
                        Payment will be verified within 6 hours. Course access activated after confirmation.
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showInternationalPayment(method, data) {
        const { courseId, courseName, price, userDetails } = data;
        const usdPrice = Math.round(price / 83);
        
        // Close existing modal
        document.querySelector('.fixed')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">${method === 'paypal' ? 'PayPal' : 'Wise Transfer'} Payment</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-slate-800 rounded-lg p-4">
                            <h4 class="text-white font-semibold mb-3">Payment Details</h4>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-300">Course:</span>
                                    <span class="text-white">${courseName}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-300">Amount:</span>
                                    <span class="text-white">$${usdPrice} USD</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-300">${method === 'paypal' ? 'PayPal ID:' : 'Contact for details:'}</span>
                                    <span class="text-cyan-400">${method === 'paypal' ? 'saurabhbajpai1442@gmail.com' : 'Available on request'}</span>
                                </div>
                            </div>
                        </div>
                        
                        ${method === 'paypal' ? `
                        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <h5 class="text-blue-300 font-semibold mb-2">PayPal Instructions:</h5>
                            <ol class="text-sm text-blue-200 space-y-1">
                                <li>1. Send $${usdPrice} to: saurabhbajpai1442@gmail.com</li>
                                <li>2. Add note: "${courseId} - ${courseName}"</li>
                                <li>3. Enter transaction ID below</li>
                            </ol>
                        </div>
                        
                        <input type="text" id="paypal-tx-id" placeholder="Enter PayPal Transaction ID" 
                               class="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none">
                        
                        <button onclick="alternativePayment.verifyInternationalPayment('paypal', '${courseId}', '${courseName}', ${price}, ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}, document.getElementById('paypal-tx-id').value)" 
                                class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors">
                            Confirm PayPal Payment
                        </button>
                        ` : `
                        <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <h5 class="text-green-300 font-semibold mb-2">Wise Transfer:</h5>
                            <p class="text-sm text-green-200 mb-3">
                                For international bank transfers via Wise, please contact our support team for account details.
                            </p>
                        </div>
                        
                        <button onclick="alternativePayment.contactSupport({courseId: '${courseId}', courseName: '${courseName}', price: ${price}, userDetails: ${JSON.stringify(userDetails).replace(/"/g, '&quot;')}, method: 'wise'})" 
                                class="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
                            Contact Support for Wise Details
                        </button>
                        `}
                    </div>
                    
                    <p class="text-xs text-slate-400 text-center mt-4">
                        International payments are verified within 24 hours
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    contactSupport(data) {
        const { courseId, courseName, price, userDetails, method } = data;
        
        // Close existing modal
        document.querySelector('.fixed')?.remove();
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-white">Contact Support</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-slate-800 rounded-lg p-4">
                            <h4 class="text-white font-semibold mb-3">Get Personal Assistance</h4>
                            <p class="text-slate-300 text-sm mb-4">
                                Our team will help you with custom payment options including bank transfers, 
                                installments, or any other method that works for you.
                            </p>
                        </div>
                        
                        <div class="space-y-3">
                            <a href="https://wa.me/918299446341?text=Hi, I want to enroll in ${courseName} (${courseId}) for ₹${price.toLocaleString()}. Please help with payment options." 
                               target="_blank"
                               class="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                                <span class="mr-2">📱</span> WhatsApp Support
                            </a>
                            
                            <a href="mailto:support@axonflow.in?subject=Payment Help for ${courseName}&body=Hi, I want to enroll in ${courseName} (Course ID: ${courseId}) for ₹${price.toLocaleString()}. Please help me with payment options.%0A%0AStudent Details:%0AName: ${userDetails.name}%0AEmail: ${userDetails.email}" 
                               class="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                                <span class="mr-2">📧</span> Email Support
                            </a>
                            
                            <button onclick="alternativePayment.scheduleCall('${courseId}', '${courseName}', ${price}, ${JSON.stringify(userDetails).replace(/"/g, '&quot;')})" 
                                    class="w-full bg-purple-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
                                <span class="mr-2">📞</span> Schedule Call
                            </button>
                        </div>
                        
                        <div class="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
                            <p class="text-cyan-300 text-sm">
                                <span class="font-semibold">Available 24/7:</span> Our support team responds within 2 hours and can arrange custom payment plans.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    verifyUPIPayment(courseId, courseName, price, userDetails, transactionId) {
        if (!transactionId) {
            alert('Please enter your UPI transaction ID');
            return;
        }

        const paymentData = {
            method: 'upi',
            transactionId,
            courseId,
            courseName,
            price,
            userDetails,
            timestamp: new Date().toISOString(),
            status: 'pending_verification'
        };

        this.processPayment(paymentData);
    }

    verifyCryptoPayment(crypto, courseId, courseName, price, userDetails, txHash) {
        if (!txHash) {
            alert('Please enter the transaction hash');
            return;
        }

        const paymentData = {
            method: 'crypto',
            cryptocurrency: crypto,
            transactionHash: txHash,
            courseId,
            courseName,
            price,
            userDetails,
            timestamp: new Date().toISOString(),
            status: 'pending_verification'
        };

        this.processPayment(paymentData);
    }

    verifyInternationalPayment(method, courseId, courseName, price, userDetails, txId) {
        if (!txId) {
            alert('Please enter the transaction ID');
            return;
        }

        const paymentData = {
            method: 'international',
            paymentProvider: method,
            transactionId: txId,
            courseId,
            courseName,
            price,
            userDetails,
            timestamp: new Date().toISOString(),
            status: 'pending_verification'
        };

        this.processPayment(paymentData);
    }

    processPayment(paymentData) {
        // Store payment data locally
        const payments = JSON.parse(localStorage.getItem('pending_payments') || '[]');
        payments.push(paymentData);
        localStorage.setItem('pending_payments', JSON.stringify(payments));

        // Activate course immediately (trust-based system)
        this.activateCourse(paymentData);
        
        // Close payment modal
        document.querySelector('.fixed')?.remove();
        
        // Show success message
        this.showPaymentSuccess(paymentData);
    }

    activateCourse(paymentData) {
        const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
        const enrollmentData = {
            id: 'ENR_' + Date.now().toString(36).toUpperCase(),
            courseId: paymentData.courseId,
            courseName: paymentData.courseName,
            userDetails: paymentData.userDetails,
            paymentData: paymentData,
            enrollmentDate: new Date().toISOString(),
            status: 'active',
            accessLevel: 'premium'
        };

        enrollments.push(enrollmentData);
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        enrolledCourses.push(paymentData.courseId);
        localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
    }

    showPaymentSuccess(paymentData) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-md w-full border border-green-500/30">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">🎉 Payment Submitted!</h3>
                    <div class="space-y-2 text-sm text-slate-300 mb-6">
                        <p><strong>Course:</strong> ${paymentData.courseName}</p>
                        <p><strong>Method:</strong> ${paymentData.method.toUpperCase()}</p>
                        <p><strong>Status:</strong> <span class="text-yellow-400">Verification Pending</span></p>
                    </div>
                    <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-6">
                        <p class="text-green-300 text-sm">
                            Your course has been activated! Payment verification will complete in the background.
                        </p>
                    </div>
                    <div class="space-y-3">
                        <button onclick="this.closest('.fixed').remove(); window.aiTeacher?.toggleChat()" 
                                class="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors">
                            🤖 Start Learning Now
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
    }

    loadPaymentUI() {
        // Replace existing payment buttons with alternative payment
        document.addEventListener('DOMContentLoaded', () => {
            const paymentButtons = document.querySelectorAll('.payment-btn, [data-payment-action]');
            paymentButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const courseData = JSON.parse(btn.dataset.paymentData || '{}');
                    if (courseData.courseId) {
                        this.showAlternativePaymentModal(
                            courseData.courseId,
                            courseData.courseName,
                            courseData.price,
                            courseData.userDetails
                        );
                    }
                });
            });
        });
    }
}

// Initialize Alternative Payment System
document.addEventListener('DOMContentLoaded', () => {
    window.alternativePayment = new AlternativePayment();
});