// AI Agents System - Handles all platform operations
class AIAgentSystem {
    constructor() {
        this.agents = {
            courseAgent: new CourseManagementAgent(),
            teacherAgent: new TeacherAgent(),
            enrollmentAgent: new EnrollmentAgent(),
            paymentAgent: new PaymentAgent(),
            supportAgent: new SupportAgent()
        };
        this.init();
    }

    init() {
        console.log('🤖 AI Agent System initialized');
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Global event delegation for all AI agent interactions
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        document.addEventListener('submit', (e) => this.handleGlobalSubmit(e));
    }

    handleGlobalClick(e) {
        const target = e.target.closest('[data-agent]');
        if (!target) return;

        const agentType = target.dataset.agent;
        const action = target.dataset.action;
        const data = JSON.parse(target.dataset.data || '{}');

        this.delegateToAgent(agentType, action, data, e);
    }

    handleGlobalSubmit(e) {
        const form = e.target;
        const agentType = form.dataset.agent;
        if (!agentType) return;

        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        this.delegateToAgent(agentType, 'submit', data, e);
    }

    delegateToAgent(agentType, action, data, event) {
        const agent = this.agents[agentType];
        if (!agent) {
            console.error(`Agent ${agentType} not found`);
            return;
        }

        agent.handleAction(action, data, event);
    }
}

// Course Management Agent
class CourseManagementAgent {
    constructor() {
        this.courses = {};
        this.loadCourses();
    }

    loadCourses() {
        // Load all course data
        if (typeof ENHANCED_COURSES !== 'undefined') {
            this.courses = ENHANCED_COURSES;
        }
    }

    handleAction(action, data, event) {
        switch (action) {
            case 'browse':
                this.browseCourses(data);
                break;
            case 'filter':
                this.filterCourses(data);
                break;
            case 'search':
                this.searchCourses(data);
                break;
            case 'recommend':
                this.recommendCourses(data);
                break;
        }
    }

    browseCourses(filters = {}) {
        const { category = 'all', priceRange = 'all', level = 'all' } = filters;
        
        if (window.enhancedCourseSystem) {
            window.enhancedCourseSystem.renderCourses(category, priceRange);
        }
    }

    filterCourses(criteria) {
        // Advanced filtering logic
        let filtered = [];
        
        Object.values(this.courses).forEach(categoryData => {
            filtered = filtered.concat(categoryData.filter(course => {
                return this.matchesCriteria(course, criteria);
            }));
        });

        this.displayFilteredCourses(filtered);
    }

    matchesCriteria(course, criteria) {
        if (criteria.maxPrice && course.price > criteria.maxPrice) return false;
        if (criteria.minPrice && course.price < criteria.minPrice) return false;
        if (criteria.level && course.level !== criteria.level) return false;
        if (criteria.duration && !course.duration.includes(criteria.duration)) return false;
        return true;
    }

    recommendCourses(userProfile) {
        // AI-powered course recommendations
        const recommendations = this.generateRecommendations(userProfile);
        this.displayRecommendations(recommendations);
    }

    generateRecommendations(profile) {
        // Simple recommendation algorithm
        const { experience = 'beginner', interests = [], budget = 5000 } = profile;
        
        let recommended = [];
        
        Object.values(this.courses).forEach(categoryData => {
            categoryData.forEach(course => {
                if (course.price <= budget) {
                    let score = 0;
                    
                    // Experience matching
                    if (course.level.toLowerCase() === experience.toLowerCase()) score += 3;
                    
                    // Interest matching
                    interests.forEach(interest => {
                        if (course.title.toLowerCase().includes(interest.toLowerCase()) ||
                            course.description.toLowerCase().includes(interest.toLowerCase())) {
                            score += 2;
                        }
                    });
                    
                    if (score > 0) {
                        recommended.push({ ...course, score });
                    }
                }
            });
        });

        return recommended.sort((a, b) => b.score - a.score).slice(0, 6);
    }

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-container');
        if (!container) return;

        container.innerHTML = `
            <div class="mb-8">
                <h3 class="text-2xl font-bold text-white mb-4">🎯 Recommended for You</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${recommendations.map(course => `
                        <div class="glass-card rounded-xl p-6 hover-lift">
                            <div class="flex justify-between items-start mb-4">
                                <span class="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">Recommended</span>
                                <div class="text-right">
                                    <div class="text-xl font-bold text-gradient">₹${course.price.toLocaleString()}</div>
                                </div>
                            </div>
                            <h4 class="text-lg font-bold mb-2">${course.title}</h4>
                            <p class="text-slate-300 text-sm mb-4">${course.description}</p>
                            <button class="w-full btn-primary text-white py-2 rounded-lg" 
                                    data-agent="enrollmentAgent" 
                                    data-action="enroll" 
                                    data-data='{"courseId":"${course.id}"}'>
                                Enroll Now
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Teacher Agent - Enhanced AI Teacher
class TeacherAgent {
    constructor() {
        this.currentStudent = null;
        this.conversationHistory = [];
        this.courseContext = null;
    }

    handleAction(action, data, event) {
        switch (action) {
            case 'startSession':
                this.startTeachingSession(data);
                break;
            case 'askQuestion':
                this.handleQuestion(data);
                break;
            case 'generateQuiz':
                this.generateQuiz(data);
                break;
            case 'explainConcept':
                this.explainConcept(data);
                break;
            case 'provideFeedback':
                this.provideFeedback(data);
                break;
        }
    }

    startTeachingSession(data) {
        const { courseId, studentId } = data;
        this.currentStudent = studentId;
        this.courseContext = this.getCourseContext(courseId);
        
        if (window.aiTeacher) {
            const course = this.findCourseById(courseId);
            if (course) {
                window.aiTeacher.startCourse(course);
            }
        }
    }

    handleQuestion(data) {
        const { question, courseId } = data;
        const response = this.generateContextualResponse(question, courseId);
        
        if (window.aiTeacher) {
            window.aiTeacher.addMessage(response.content, 'ai', response.type);
        }
    }

    generateContextualResponse(question, courseId) {
        const course = this.findCourseById(courseId);
        const lowerQuestion = question.toLowerCase();
        
        // Course-specific responses
        if (course) {
            // AI Agent courses
            if (course.id.includes('ai-agent') || lowerQuestion.includes('agent') || lowerQuestion.includes('ai')) {
                return { content: this.getAIAgentResponse(question), type: 'code' };
            }
            // Full-stack courses
            else if (course.id.includes('fullstack') || course.id.includes('react') || lowerQuestion.includes('react')) {
                return { content: this.getReactResponse(question), type: 'code' };
            }
            // Python courses
            else if (course.id.includes('python') || lowerQuestion.includes('python') || lowerQuestion.includes('function')) {
                return { content: this.getPythonResponse(question), type: 'code' };
            }
            // JavaScript courses
            else if (course.id.includes('javascript') || lowerQuestion.includes('javascript') || lowerQuestion.includes('js')) {
                return { content: this.getJavaScriptResponse(question), type: 'code' };
            }
            // HTML/CSS courses
            else if (course.id.includes('html') || course.id.includes('css') || lowerQuestion.includes('html') || lowerQuestion.includes('css')) {
                return { content: this.getHTMLCSSResponse(question), type: 'code' };
            }
            // Kids courses
            else if (course.category === 'children' || course.ageGroup) {
                return { content: this.getKidsResponse(question, course), type: 'illustration' };
            }
            // Data science courses
            else if (course.id.includes('data') || lowerQuestion.includes('data') || lowerQuestion.includes('pandas')) {
                return { content: this.getDataScienceResponse(question), type: 'code' };
            }
            // Mobile development
            else if (course.id.includes('mobile') || course.id.includes('flutter') || lowerQuestion.includes('mobile')) {
                return { content: this.getMobileResponse(question), type: 'code' };
            }
        }
        
        // Quiz request
        if (lowerQuestion.includes('quiz') || lowerQuestion.includes('test') || lowerQuestion.includes('question')) {
            return window.aiTeacher ? window.aiTeacher.generateMCQResponse(question) : 
                { content: this.getGenericQuiz(), type: 'mcq' };
        }
        
        // General AI response
        return window.aiTeacher ? 
            window.aiTeacher.generateTextResponse(question) : 
            { content: "I'm here to help you learn! What specific topic would you like to explore?", type: 'text' };
    }

    getAIAgentResponse(question) {
        return `# AI Agent Example
class SimpleAIAgent:
    def __init__(self, name, role):
        self.name = name
        self.role = role
        self.memory = []
    
    def process_input(self, user_input):
        # Add to memory
        self.memory.append(user_input)
        
        # Generate response based on role
        if self.role == "assistant":
            return self.generate_helpful_response(user_input)
        elif self.role == "analyzer":
            return self.analyze_data(user_input)
    
    def generate_helpful_response(self, input_text):
        # Simple response generation
        return f"I understand you're asking about: {input_text}"

# Usage
agent = SimpleAIAgent("Helper", "assistant")
response = agent.process_input("How do I create an AI agent?")
print(response)`;
    }

    getReactResponse(question) {
        return `// React Component Example
import React, { useState, useEffect } from 'react';

function CourseCard({ course }) {
    const [enrolled, setEnrolled] = useState(false);
    
    useEffect(() => {
        // Check enrollment status
        const checkEnrollment = async () => {
            const status = await fetch(\`/api/enrollment/\${course.id}\`);
            setEnrolled(status.enrolled);
        };
        
        checkEnrollment();
    }, [course.id]);
    
    const handleEnroll = async () => {
        try {
            await fetch('/api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course.id })
            });
            setEnrolled(true);
        } catch (error) {
            console.error('Enrollment failed:', error);
        }
    };
    
    return (
        <div className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button 
                onClick={handleEnroll}
                disabled={enrolled}
                className={enrolled ? 'enrolled' : 'enroll-btn'}
            >
                {enrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
        </div>
    );
}

export default CourseCard;`;
    }

    getPythonResponse(question) {
        return `# Python Functions Example
def calculate_course_progress(completed_lessons, total_lessons):
    """Calculate the percentage of course completion"""
    if total_lessons == 0:
        return 0
    
    progress = (completed_lessons / total_lessons) * 100
    return round(progress, 2)

def generate_certificate(student_name, course_name, completion_date):
    """Generate a course completion certificate"""
    certificate = {
        'student': student_name,
        'course': course_name,
        'completion_date': completion_date,
        'certificate_id': f"CERT_{student_name[:3].upper()}_{hash(course_name) % 10000}"
    }
    return certificate

# Usage examples
progress = calculate_course_progress(8, 10)
print(f"Course progress: {progress}%")

cert = generate_certificate("John Doe", "Python Basics", "2024-01-15")
print(f"Certificate ID: {cert['certificate_id']}")`;}

    getJavaScriptResponse(question) {
        return `// JavaScript Fundamentals
const studentName = "Alex";
let courseProgress = 0;

function updateProgress(newProgress) {
    courseProgress = Math.min(newProgress, 100);
    console.log(\`\${studentName}'s progress: \${courseProgress}%\`);
}

const courses = ['HTML', 'CSS', 'JavaScript', 'React'];
const completedCourses = courses.filter(course => course !== 'React');

console.log('Completed courses:', completedCourses);`;
    }

    getHTMLCSSResponse(question) {
        return `<!DOCTYPE html>
<html>
<head>
    <style>
        .course-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 20px;
            color: white;
            transition: transform 0.3s ease;
        }
        .course-card:hover { transform: translateY(-5px); }
    </style>
</head>
<body>
    <div class="course-card">
        <h3>Web Development</h3>
        <p>Learn HTML, CSS, and JavaScript</p>
    </div>
</body>
</html>`;
    }

    getKidsResponse(question, course) {
        return `
            <div class="kids-lesson">
                <h4 class="mb-3 text-pink-400">🎮 Fun Coding for Kids!</h4>
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-4">
                    <div class="text-center text-white">
                        <div class="text-4xl mb-2">🤖</div>
                        <h5 class="font-bold">Let's Build a Robot!</h5>
                    </div>
                </div>
                <div class="space-y-3 text-sm">
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">🔧</span>
                        <span>Step 1: Choose your robot's color</span>
                    </div>
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">⚡</span>
                        <span>Step 2: Give it superpowers</span>
                    </div>
                </div>
            </div>
        `;
    }

    getDataScienceResponse(question) {
        return `# Data Science with Python
import pandas as pd
import numpy as np

data = {'name': ['Alice', 'Bob'], 'score': [85, 92]}
df = pd.DataFrame(data)
print(f"Average: {df['score'].mean()}")`;}

    getMobileResponse(question) {
        return `// Flutter Mobile App
import 'package:flutter/material.dart';

class CourseApp extends StatelessWidget {
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('My Courses')),
        body: Center(child: Text('Welcome to AxonFlow!')),
      ),
    );
  }
}`;}

    getGenericQuiz() {
        return `
            <div class="quiz-question">
                <h4 class="mb-3">What does AI stand for?</h4>
                <div class="space-y-2">
                    <button class="quiz-option w-full text-left p-2 rounded bg-slate-700">A) Artificial Intelligence</button>
                    <button class="quiz-option w-full text-left p-2 rounded bg-slate-700">B) Automated Information</button>
                </div>
            </div>
        `;
    }

    findCourseById(courseId) {
        if (typeof ENHANCED_COURSES === 'undefined') return null;
        
        for (const category of Object.values(ENHANCED_COURSES)) {
            const course = category.find(c => c.id === courseId);
            if (course) return course;
        }
        return null;
    }
}

// Enrollment Agent
class EnrollmentAgent {
    handleAction(action, data, event) {
        switch (action) {
            case 'enroll':
                this.handleEnrollment(data);
                break;
            case 'checkStatus':
                this.checkEnrollmentStatus(data);
                break;
        }
    }

    handleEnrollment(data) {
        const { courseId } = data;
        
        // Check authentication
        const user = JSON.parse(localStorage.getItem('axonflow_user') || 'null');
        if (!user) {
            this.showAuthRequired();
            return;
        }

        // Find course and show enrollment form
        const course = this.findCourseById(courseId);
        if (course) {
            this.showEnrollmentForm(course);
        }
    }

    showAuthRequired() {
        if (window.ssoAuth) {
            window.ssoAuth.showMessage('Please sign in to enroll in courses', 'error');
        } else {
            alert('Please sign in to enroll in courses');
        }
    }

    showEnrollmentForm(course) {
        // Use existing enrollment form logic
        if (typeof showEnrollmentForm === 'function') {
            showEnrollmentForm(course.id, course.title, course.price);
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
}

// Payment Agent
class PaymentAgent {
    handleAction(action, data, event) {
        switch (action) {
            case 'processPayment':
                this.processPayment(data);
                break;
            case 'verifyPayment':
                this.verifyPayment(data);
                break;
        }
    }

    processPayment(data) {
        // Use existing payment system
        if (window.paymentSystem) {
            window.paymentSystem.processPayment(data);
        }
    }

    verifyPayment(data) {
        // Payment verification logic
        const { transactionId, courseId } = data;
        
        // Store verification request
        const verificationData = {
            transactionId,
            courseId,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        const verifications = JSON.parse(localStorage.getItem('payment_verifications') || '[]');
        verifications.push(verificationData);
        localStorage.setItem('payment_verifications', JSON.stringify(verifications));
        
        this.showVerificationMessage();
    }

    showVerificationMessage() {
        if (window.ssoAuth) {
            window.ssoAuth.showMessage('Payment verification submitted. You will receive course access within 2 hours.', 'success');
        }
    }
}

// Support Agent
class SupportAgent {
    handleAction(action, data, event) {
        switch (action) {
            case 'help':
                this.showHelp(data);
                break;
            case 'contact':
                this.showContact(data);
                break;
            case 'faq':
                this.showFAQ(data);
                break;
        }
    }

    showHelp(data) {
        const helpModal = document.createElement('div');
        helpModal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
        helpModal.innerHTML = `
            <div class="bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-700">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-white">🤖 AI Support</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div class="space-y-4">
                    <div class="bg-slate-800 rounded-lg p-4">
                        <h4 class="text-cyan-400 font-bold mb-2">Quick Help</h4>
                        <ul class="space-y-2 text-slate-300">
                            <li>• Use Google/Microsoft sign-in for instant access</li>
                            <li>• Browse courses by price range and category</li>
                            <li>• Click the AI teacher button for interactive learning</li>
                            <li>• Pay via UPI for instant enrollment</li>
                            <li>• Earn 10% lifetime commission on referrals</li>
                        </ul>
                    </div>
                    <div class="bg-slate-800 rounded-lg p-4">
                        <h4 class="text-green-400 font-bold mb-2">Course Categories</h4>
                        <ul class="space-y-1 text-slate-300 text-sm">
                            <li>• Kids & Teens: ₹300-₹1,500</li>
                            <li>• Budget Friendly: ₹300-₹2,000</li>
                            <li>• Intermediate: ₹2,000-₹5,000</li>
                            <li>• Advanced: ₹5,000-₹8,000</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);
    }
}

// Initialize AI Agent System
document.addEventListener('DOMContentLoaded', () => {
    window.aiAgentSystem = new AIAgentSystem();
    
    // Enhanced AI Teacher integration
    if (window.aiTeacher) {
        window.aiTeacher.courseAgent = window.aiAgentSystem.agents.courseAgent;
    }
});