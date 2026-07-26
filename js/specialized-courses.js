// Specialized Courses System for AxonFlow Academy
class SpecializedCourses {
    constructor() {
        this.courses = this.initializeCourses();
        this.init();
    }

    init() {
        console.log('🎓 Specialized Courses System Initialized');
    }

    initializeCourses() {
        return {
            'cloud-certifications': {
                title: 'Cloud Certifications',
                icon: '☁️',
                courses: [
                    {
                        id: 'gcp-professional',
                        title: 'Google Cloud Professional',
                        price: 45000,
                        duration: '3 months',
                        description: 'Complete GCP certification preparation with hands-on labs',
                        skills: ['GCP Services', 'Cloud Architecture', 'DevOps', 'Security'],
                        certification: 'Google Cloud Professional Cloud Architect'
                    },
                    {
                        id: 'azure-fundamentals',
                        title: 'Microsoft Azure Fundamentals',
                        price: 42000,
                        duration: '3 months',
                        description: 'Azure certification with practical cloud deployment experience',
                        skills: ['Azure Services', 'Cloud Computing', 'Security', 'Compliance'],
                        certification: 'Microsoft Azure Fundamentals AZ-900'
                    },
                    {
                        id: 'aws-solutions-architect',
                        title: 'AWS Solutions Architect',
                        price: 48000,
                        duration: '4 months',
                        description: 'Complete AWS certification with real-world projects',
                        skills: ['AWS Services', 'Architecture Design', 'Cost Optimization', 'Security'],
                        certification: 'AWS Certified Solutions Architect'
                    }
                ]
            },
            'advanced-development': {
                title: 'Advanced Development',
                icon: '⚡',
                courses: [
                    {
                        id: 'microservices-architecture',
                        title: 'Microservices Architecture',
                        price: 35000,
                        duration: '3 months',
                        description: 'Design and build scalable microservices systems',
                        skills: ['Docker', 'Kubernetes', 'API Gateway', 'Service Mesh'],
                        projects: ['E-commerce Microservices', 'Chat Application', 'Payment Gateway']
                    },
                    {
                        id: 'devops-engineering',
                        title: 'DevOps Engineering',
                        price: 32000,
                        duration: '3 months',
                        description: 'Complete CI/CD pipeline and infrastructure automation',
                        skills: ['Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'Monitoring'],
                        projects: ['Automated Deployment Pipeline', 'Infrastructure as Code', 'Monitoring Dashboard']
                    },
                    {
                        id: 'mobile-development',
                        title: 'Mobile App Development',
                        price: 28000,
                        duration: '3 months',
                        description: 'Cross-platform mobile apps with React Native',
                        skills: ['React Native', 'Mobile UI/UX', 'App Store Deployment', 'Push Notifications'],
                        projects: ['Social Media App', 'E-commerce App', 'Fitness Tracker']
                    }
                ]
            },
            'ai-specializations': {
                title: 'AI Specializations',
                icon: '🧠',
                courses: [
                    {
                        id: 'computer-vision',
                        title: 'Computer Vision & Image Processing',
                        price: 38000,
                        duration: '4 months',
                        description: 'Advanced computer vision with deep learning',
                        skills: ['OpenCV', 'TensorFlow', 'PyTorch', 'Image Processing', 'Object Detection'],
                        projects: ['Face Recognition System', 'Object Detection App', 'Medical Image Analysis']
                    },
                    {
                        id: 'nlp-advanced',
                        title: 'Advanced Natural Language Processing',
                        price: 40000,
                        duration: '4 months',
                        description: 'Build sophisticated NLP applications and chatbots',
                        skills: ['Transformers', 'BERT', 'GPT', 'Sentiment Analysis', 'Text Generation'],
                        projects: ['Advanced Chatbot', 'Document Summarizer', 'Language Translator']
                    },
                    {
                        id: 'mlops',
                        title: 'MLOps & Model Deployment',
                        price: 36000,
                        duration: '3 months',
                        description: 'Production-ready ML model deployment and monitoring',
                        skills: ['MLflow', 'Kubeflow', 'Model Serving', 'A/B Testing', 'Model Monitoring'],
                        projects: ['ML Pipeline', 'Model API', 'Monitoring Dashboard']
                    }
                ]
            },
            'business-skills': {
                title: 'Business & Leadership',
                icon: '💼',
                courses: [
                    {
                        id: 'product-management',
                        title: 'Product Management',
                        price: 25000,
                        duration: '2 months',
                        description: 'Learn to build and manage successful products',
                        skills: ['Product Strategy', 'User Research', 'Analytics', 'Roadmapping'],
                        projects: ['Product Launch Plan', 'User Research Study', 'Analytics Dashboard']
                    },
                    {
                        id: 'digital-marketing-advanced',
                        title: 'Advanced Digital Marketing',
                        price: 22000,
                        duration: '2 months',
                        description: 'Master digital marketing with AI tools',
                        skills: ['SEO/SEM', 'Social Media Marketing', 'Content Strategy', 'Analytics'],
                        projects: ['Marketing Campaign', 'Content Calendar', 'Performance Dashboard']
                    },
                    {
                        id: 'startup-fundamentals',
                        title: 'Startup Fundamentals',
                        price: 20000,
                        duration: '2 months',
                        description: 'Build and launch your own startup',
                        skills: ['Business Model', 'Fundraising', 'MVP Development', 'Go-to-Market'],
                        projects: ['Business Plan', 'MVP Prototype', 'Pitch Deck']
                    }
                ]
            }
        };
    }

    renderSpecializedCourses() {
        const container = document.createElement('div');
        container.className = 'specialized-courses-container';
        
        Object.entries(this.courses).forEach(([categoryId, category]) => {
            const categorySection = this.createCategorySection(categoryId, category);
            container.appendChild(categorySection);
        });
        
        return container;
    }

    createCategorySection(categoryId, category) {
        const section = document.createElement('div');
        section.className = 'mb-16';
        
        section.innerHTML = `
            <div class="text-center mb-8">
                <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full px-6 py-2 mb-4">
                    <span class="text-2xl">${category.icon}</span>
                    <span class="text-purple-300 font-bold">${category.title.toUpperCase()}</span>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${category.courses.map(course => this.createCourseCard(course)).join('')}
            </div>
        `;
        
        return section;
    }

    createCourseCard(course) {
        return `
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 card-hover">
                <h3 class="text-2xl font-bold text-white mb-4">${course.title}</h3>
                <p class="text-gray-300 mb-6">${course.description}</p>
                
                <div class="space-y-2 mb-6">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Duration:</span>
                        <span class="text-white">${course.duration}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Price:</span>
                        <span class="text-cyan-400 font-bold">₹${course.price.toLocaleString()}</span>
                    </div>
                    ${course.certification ? `
                        <div class="flex justify-between">
                            <span class="text-gray-400">Certification:</span>
                            <span class="text-green-400 text-sm">${course.certification}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="mb-6">
                    <h4 class="text-white font-semibold mb-2">Skills You'll Learn:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${course.skills.map(skill => `
                            <span class="bg-cyan-900/50 text-cyan-300 text-xs font-medium px-3 py-1 rounded-full">${skill}</span>
                        `).join('')}
                    </div>
                </div>
                
                ${course.projects ? `
                    <div class="mb-6">
                        <h4 class="text-white font-semibold mb-2">Projects:</h4>
                        <ul class="text-gray-300 text-sm space-y-1">
                            ${course.projects.map(project => `<li>• ${project}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="space-y-3">
                    <button onclick="showEnrollmentForm('${course.id}', '${course.title}', ${course.price})" 
                            class="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl hover:bg-cyan-300 transition-all duration-300">
                        Enroll Now - ₹${course.price.toLocaleString()}
                    </button>
                </div>
            </div>
        `;
    }

    getCourseById(courseId) {
        for (const category of Object.values(this.courses)) {
            const course = category.courses.find(c => c.id === courseId);
            if (course) return course;
        }
        return null;
    }

    getAllCourses() {
        const allCourses = [];
        Object.values(this.courses).forEach(category => {
            allCourses.push(...category.courses);
        });
        return allCourses;
    }

    searchCourses(query) {
        const allCourses = this.getAllCourses();
        return allCourses.filter(course => 
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.description.toLowerCase().includes(query.toLowerCase()) ||
            course.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
        );
    }

    getCoursesInPriceRange(minPrice, maxPrice) {
        const allCourses = this.getAllCourses();
        return allCourses.filter(course => 
            course.price >= minPrice && course.price <= maxPrice
        );
    }

    getCoursesByDuration(duration) {
        const allCourses = this.getAllCourses();
        return allCourses.filter(course => course.duration === duration);
    }
}

// Initialize specialized courses system
window.specializedCourses = new SpecializedCourses();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpecializedCourses;
}