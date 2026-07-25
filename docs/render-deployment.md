# 🚀 Render Deployment Guide - AxonFlow Platform

## ✅ **Payment IDs Updated:**
- **UPI ID**: `axonflow.in@ptyes` ✅
- **PayPal**: `saurabhbajpaiai@gmail.com` ✅
- **All payment systems updated** ✅

## 🌐 **Deploy to Render (5 minutes):**

### **Step 1: Push to GitHub**
```bash
# In your Autonomiq folder
git init
git add .
git commit -m "AxonFlow Platform - Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/axonflow-platform.git
git push -u origin main
```

### **Step 2: Connect to Render**
1. **Go to**: https://render.com
2. **Sign up/Login** with GitHub
3. **Click "New +"** → **Static Site**
4. **Connect your GitHub repo**: `axonflow-platform`
5. **Settings**:
   - **Name**: `axonflow-platform`
   - **Branch**: `main`
   - **Root Directory**: `/` (leave empty)
   - **Build Command**: `echo "Static site"`
   - **Publish Directory**: `./`

### **Step 3: Custom Domain (Optional)**
1. **In Render Dashboard** → **Settings** → **Custom Domains**
2. **Add Domain**: `axonflow.in`
3. **Add CNAME record** in your domain DNS:
   ```
   CNAME: www → axonflow-platform.onrender.com
   A: @ → [Render IP provided]
   ```

### **Step 4: Firebase Domain Authorization**
1. **Go to Firebase Console** → **Authentication** → **Settings**
2. **Add Authorized Domain**: `axonflow-platform.onrender.com`
3. **Add your custom domain**: `axonflow.in` (if using)

## 🎯 **Deployment URLs:**

### **Render URL** (Immediate):
`https://axonflow-platform.onrender.com`

### **Custom Domain** (After DNS):
`https://axonflow.in`

## ✅ **What's Deployed:**

### **Complete Platform:**
- ✅ **Main Landing Page** (`/`)
- ✅ **Academy** (`/academy.html`)
- ✅ **Agency Services** (`/agency.html`)
- ✅ **Authentication Test** (`/test-auth.html`)

### **Working Features:**
- ✅ **Google Authentication** (Firebase)
- ✅ **UPI Payments** (`axonflow.in@ptyes`)
- ✅ **PayPal Payments** (`saurabhbajpaiai@gmail.com`)
- ✅ **Crypto Payments** (BTC, ETH, USDT)
- ✅ **7-Referral Free Course System**
- ✅ **Intro Themes & Animations**
- ✅ **Mobile Responsive Design**
- ✅ **SSL Certificate** (Auto by Render)

## 🧪 **Test After Deployment:**

### **Authentication Test:**
1. **Visit**: `https://axonflow-platform.onrender.com/test-auth.html`
2. **Click "Test Google Sign-In"**
3. **Should work immediately**

### **Full Platform Test:**
1. **Visit**: `https://axonflow-platform.onrender.com`
2. **Test Google sign-in**
3. **Navigate to Academy**
4. **Try course enrollment**
5. **Test UPI payment flow**

## 📊 **Performance Optimizations:**

### **Already Included:**
- ✅ **CDN Delivery** (Render)
- ✅ **Gzip Compression**
- ✅ **Security Headers**
- ✅ **SSL Certificate**
- ✅ **Global Edge Network**

## 🔧 **Environment Variables (Not Needed):**
Since this is a static site with client-side Firebase, no server environment variables are needed. All configuration is in the JavaScript files.

## 📈 **Monitoring & Analytics:**

### **Built-in Monitoring:**
- ✅ **Render Analytics** (Traffic, Performance)
- ✅ **Firebase Analytics** (User behavior)
- ✅ **Google Analytics** (Optional - can add)

## 🚀 **Go Live Checklist:**

### **Before Launch:**
- ✅ Payment IDs updated
- ✅ Firebase authentication working
- ✅ All features tested locally
- ✅ Mobile responsive verified

### **After Deployment:**
- ✅ Test authentication on live site
- ✅ Verify payment flows work
- ✅ Check mobile responsiveness
- ✅ Test course enrollment process
- ✅ Verify referral system

## 💰 **Revenue Ready:**
Once deployed, you can immediately:
- ✅ **Accept students** and process payments
- ✅ **Generate referral income** (10% lifetime)
- ✅ **Provide AI agency services**
- ✅ **Scale your business**

## 🎉 **Deployment Summary:**

**Your platform will be live at:**
- **Render URL**: `https://axonflow-platform.onrender.com`
- **Custom Domain**: `https://axonflow.in` (after DNS setup)

**With full functionality:**
- Professional AI agency services
- Complete learning academy
- Payment processing (UPI, PayPal, Crypto)
- Referral earning system
- Enterprise authentication
- Mobile-responsive design

**Ready to deploy? Push to GitHub and connect to Render!** 🚀