// Enhanced Course System with All Price Ranges
const ENHANCED_COURSES = {
    // Children's Courses (₹300-₹1500)
    children: [
        {
            id: 'kids-coding-basics',
            title: 'Coding for Kids (Age 8-12)',
            price: 300,
            duration: '4 weeks',
            level: 'Beginner',
            description: 'Fun introduction to programming with Scratch and basic concepts',
            features: ['Visual Programming', 'Games & Animations', 'Logic Building', 'Creative Projects'],
            ageGroup: '8-12 years',
            category: 'children'
        },
        {
            id: 'kids-web-design',
            title: 'Web Design for Teens (Age 13-16)',
            price: 500,
            duration: '6 weeks',
            level: 'Beginner',
            description: 'Create amazing websites with HTML, CSS and basic JavaScript',
            features: ['HTML/CSS Basics', 'Responsive Design', 'Interactive Elements', 'Portfolio Creation'],
            ageGroup: '13-16 years',
            category: 'children'
        },
        {
            id: 'kids-python-fun',
            title: 'Python Adventures for Kids',
            price: 800,
            duration: '8 weeks',
            level: 'Intermediate',
            description: 'Learn Python through games, stories and fun projects',
            features: ['Python Basics', 'Game Development', 'Story Telling with Code', 'Math with Programming'],
            ageGroup: '10-15 years',
            category: 'children'
        },
        {
            id: 'kids-ai-basics',
            title: 'AI for Young Minds',
            price: 1200,
            duration: '10 weeks',
            level: 'Intermediate',
            description: 'Introduction to AI concepts through interactive projects',
            features: ['What is AI?', 'Machine Learning Games', 'Chatbot Creation', 'AI Art Projects'],
            ageGroup: '12-16 years',
            category: 'children'
        },
        {
            id: 'kids-robotics',
            title: 'Robotics & Arduino for Kids',
            price: 1500,
            duration: '12 weeks',
            level: 'Advanced',
            description: 'Build and program robots with Arduino and sensors',
            features: ['Arduino Programming', 'Sensor Integration', 'Robot Building', 'IoT Projects'],
            ageGroup: '11-16 years',
            category: 'children'
        }
    ],

    // Budget Courses (₹300-₹2000)
    budget: [
        {
            id: 'html-css-basics',
            title: 'HTML & CSS Fundamentals',
            price: 300,
            duration: '3 weeks',
            level: 'Beginner',
            description: 'Master the building blocks of web development',
            features: ['HTML5 Structure', 'CSS3 Styling', 'Responsive Design', 'Flexbox & Grid'],
            category: 'budget'
        },
        {
            id: 'javascript-starter',
            title: 'JavaScript for Beginners',
            price: 500,
            duration: '4 weeks',
            level: 'Beginner',
            description: 'Learn programming fundamentals with JavaScript',
            features: ['Variables & Functions', 'DOM Manipulation', 'Event Handling', 'Basic Projects'],
            category: 'budget'
        },
        {
            id: 'python-basics',
            title: 'Python Programming Basics',
            price: 800,
            duration: '5 weeks',
            level: 'Beginner',
            description: 'Start your programming journey with Python',
            features: ['Python Syntax', 'Data Structures', 'File Handling', 'Simple Projects'],
            category: 'budget'
        },
        {
            id: 'git-github',
            title: 'Git & GitHub Mastery',
            price: 600,
            duration: '3 weeks',
            level: 'Beginner',
            description: 'Version control and collaboration essentials',
            features: ['Git Commands', 'GitHub Workflow', 'Branching & Merging', 'Open Source Contribution'],
            category: 'budget'
        },
        {
            id: 'sql-databases',
            title: 'SQL & Database Fundamentals',
            price: 1000,
            duration: '6 weeks',
            level: 'Beginner',
            description: 'Master database design and SQL queries',
            features: ['Database Design', 'SQL Queries', 'Joins & Relationships', 'Database Optimization'],
            category: 'budget'
        },
        {
            id: 'digital-marketing-basics',
            title: 'Digital Marketing Essentials',
            price: 1200,
            duration: '6 weeks',
            level: 'Beginner',
            description: 'Complete digital marketing foundation course',
            features: ['SEO Basics', 'Social Media Marketing', 'Content Strategy', 'Analytics'],
            category: 'budget'
        },
        {
            id: 'psychology-basics',
            title: 'Psychology Fundamentals',
            price: 1800,
            duration: '8 weeks',
            level: 'Beginner',
            description: 'Introduction to psychology principles and human behavior',
            features: ['Cognitive Psychology', 'Behavioral Science', 'Research Methods', 'Statistics'],
            category: 'budget'
        },
        {
            id: 'social-media-marketing',
            title: 'Social Media Marketing Pro',
            price: 2000,
            duration: '8 weeks',
            level: 'Intermediate',
            description: 'Advanced social media strategies and content creation',
            features: ['Content Creation', 'Paid Advertising', 'Analytics', 'Brand Building'],
            category: 'budget'
        },
        {
            id: 'ui-ux-intro',
            title: 'UI/UX Design Introduction',
            price: 1500,
            duration: '7 weeks',
            level: 'Beginner',
            description: 'Learn design principles and user experience',
            features: ['Design Principles', 'Figma Basics', 'User Research', 'Prototyping'],
            category: 'budget'
        },
        {
            id: 'excel-advanced',
            title: 'Advanced Excel & Data Analysis',
            price: 800,
            duration: '4 weeks',
            level: 'Intermediate',
            description: 'Master Excel for business and data analysis',
            features: ['Advanced Formulas', 'Pivot Tables', 'Data Visualization', 'Macros & VBA'],
            category: 'budget'
        },
        {
            id: 'wordpress-development',
            title: 'WordPress Website Development',
            price: 1800,
            duration: '8 weeks',
            level: 'Beginner',
            description: 'Build professional websites with WordPress',
            features: ['WordPress Setup', 'Theme Customization', 'Plugin Development', 'SEO Optimization'],
            category: 'budget'
        },
        {
            id: 'photoshop-design',
            title: 'Photoshop & Graphic Design',
            price: 2000,
            duration: '8 weeks',
            level: 'Beginner',
            description: 'Master Photoshop for graphic design and photo editing',
            features: ['Photoshop Tools', 'Photo Editing', 'Logo Design', 'Print Design'],
            category: 'budget'
        }
    ],

    // Intermediate Courses (₹2000-₹5000)
    intermediate: [
        {
            id: 'react-development',
            title: 'React.js Complete Course',
            price: 2500,
            duration: '10 weeks',
            level: 'Intermediate',
            description: 'Build modern web applications with React',
            features: ['React Fundamentals', 'Hooks & Context', 'State Management', 'Real Projects'],
            category: 'intermediate'
        },
        {
            id: 'node-backend',
            title: 'Node.js Backend Development',
            price: 3000,
            duration: '12 weeks',
            level: 'Intermediate',
            description: 'Build scalable backend applications with Node.js',
            features: ['Express.js', 'Database Integration', 'API Development', 'Authentication'],
            category: 'intermediate'
        },
        {
            id: 'python-django',
            title: 'Django Web Framework',
            price: 3500,
            duration: '12 weeks',
            level: 'Intermediate',
            description: 'Build web applications with Python Django',
            features: ['Django Fundamentals', 'Models & Views', 'REST APIs', 'Deployment'],
            category: 'intermediate'
        },
        {
            id: 'mobile-app-flutter',
            title: 'Flutter Mobile App Development',
            price: 4000,
            duration: '14 weeks',
            level: 'Intermediate',
            description: 'Build cross-platform mobile apps with Flutter',
            features: ['Dart Programming', 'Flutter Widgets', 'State Management', 'App Store Deployment'],
            category: 'intermediate'
        },
        {
            id: 'data-science-python',
            title: 'Data Science with Python',
            price: 4500,
            duration: '16 weeks',
            level: 'Intermediate',
            description: 'Complete data science course with Python',
            features: ['Pandas & NumPy', 'Data Visualization', 'Machine Learning', 'Real Projects'],
            category: 'intermediate'
        },
        {
            id: 'aws-cloud-basics',
            title: 'AWS Cloud Fundamentals',
            price: 3500,
            duration: '10 weeks',
            level: 'Intermediate',
            description: 'Master Amazon Web Services cloud platform',
            features: ['EC2 & S3', 'Lambda Functions', 'Database Services', 'Security & IAM'],
            category: 'intermediate'
        },
        {
            id: 'cybersecurity-basics',
            title: 'Cybersecurity Fundamentals',
            price: 4000,
            duration: '12 weeks',
            level: 'Intermediate',
            description: 'Learn cybersecurity principles and practices',
            features: ['Network Security', 'Ethical Hacking', 'Security Tools', 'Incident Response'],
            category: 'intermediate'
        },
        {
            id: 'blockchain-development',
            title: 'Blockchain & Smart Contracts',
            price: 5000,
            duration: '14 weeks',
            level: 'Advanced',
            description: 'Build decentralized applications with blockchain',
            features: ['Blockchain Basics', 'Solidity Programming', 'Smart Contracts', 'DApp Development'],
            category: 'intermediate'
        },
        {
            id: 'biotech-basics',
            title: 'Biotechnology Fundamentals',
            price: 4500,
            duration: '12 weeks',
            level: 'Intermediate',
            description: 'Introduction to biotechnology and bioinformatics',
            features: ['Molecular Biology', 'Bioinformatics', 'Lab Techniques', 'Genetic Engineering'],
            category: 'intermediate'
        },
        {
            id: 'pharma-basics',
            title: 'Pharmaceutical Sciences',
            price: 4800,
            duration: '14 weeks',
            level: 'Intermediate',
            description: 'Drug development, pharmacology, and regulatory affairs',
            features: ['Pharmacology', 'Drug Development', 'Regulatory Affairs', 'Clinical Research'],
            category: 'intermediate'
        },
        {
            id: 'fashion-design-tech',
            title: 'Fashion Design & Technology',
            price: 3500,
            duration: '10 weeks',
            level: 'Intermediate',
            description: 'Digital fashion design tools and e-commerce strategies',
            features: ['Design Software', 'Fashion Trends', 'E-commerce', 'Brand Development'],
            category: 'intermediate'
        }
    ],

    // Advanced Courses (₹5000-₹8000)
    advanced: [
        {
            id: 'biotech-ai',
            title: 'Biotech & AI Integration',
            price: 7500,
            duration: '20 weeks',
            level: 'Advanced',
            description: 'AI applications in biotechnology, drug discovery, and genomics',
            features: ['Bioinformatics', 'Drug Discovery AI', 'Genomic Analysis', 'Medical AI'],
            category: 'advanced'
        },
        {
            id: 'psychology-data',
            title: 'Psychology & Data Science',
            price: 6500,
            duration: '16 weeks',
            level: 'Advanced',
            description: 'Behavioral analytics, psychological research methods with data science',
            features: ['Behavioral Analytics', 'Research Methods', 'Statistical Psychology', 'Mental Health AI'],
            category: 'advanced'
        },
        {
            id: 'pharma-tech',
            title: 'Pharmaceutical Technology',
            price: 8000,
            duration: '22 weeks',
            level: 'Expert',
            description: 'Digital transformation in pharmaceutical industry with AI and automation',
            features: ['Drug Development', 'Regulatory Tech', 'Clinical Trials AI', 'Pharma Analytics'],
            category: 'advanced'
        },
        {
            id: 'social-media-ai',
            title: 'Social Media AI & Analytics',
            price: 5500,
            duration: '14 weeks',
            level: 'Advanced',
            description: 'AI-powered social media management, content creation, and analytics',
            features: ['Content AI', 'Sentiment Analysis', 'Influencer Analytics', 'Social Automation'],
            category: 'advanced'
        },
        {
            id: 'fashion-tech',
            title: 'Fashion Technology & AI',
            price: 6800,
            duration: '18 weeks',
            level: 'Advanced',
            description: 'AI in fashion design, trend prediction, and e-commerce optimization',
            features: ['Fashion AI', 'Trend Prediction', 'Virtual Try-on', 'Supply Chain Tech'],
            category: 'advanced'
        },
        {
            id: 'fullstack-mern',
            title: 'Full-Stack MERN Development',
            price: 6000,
            duration: '16 weeks',
            level: 'Advanced',
            description: 'Complete MERN stack development course',
            features: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Real-world Projects'],
            category: 'advanced'
        },
        {
            id: 'ai-machine-learning',
            title: 'AI & Machine Learning Mastery',
            price: 7000,
            duration: '18 weeks',
            level: 'Advanced',
            description: 'Comprehensive AI and ML course with projects',
            features: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP Projects'],
            category: 'advanced'
        },
        {
            id: 'devops-kubernetes',
            title: 'DevOps & Kubernetes',
            price: 6500,
            duration: '16 weeks',
            level: 'Advanced',
            description: 'Master DevOps practices and container orchestration',
            features: ['Docker Containers', 'Kubernetes', 'CI/CD Pipelines', 'Infrastructure as Code'],
            category: 'advanced'
        },
        {
            id: 'cloud-architect',
            title: 'Cloud Solutions Architect',
            price: 8000,
            duration: '20 weeks',
            level: 'Expert',
            description: 'Become a certified cloud solutions architect',
            features: ['Multi-Cloud Strategy', 'Architecture Design', 'Cost Optimization', 'Security Best Practices'],
            category: 'advanced'
        },
        {
            id: 'data-engineering',
            title: 'Data Engineering Pipeline',
            price: 7500,
            duration: '18 weeks',
            level: 'Advanced',
            description: 'Build scalable data processing systems',
            features: ['Apache Spark', 'Data Warehousing', 'ETL Pipelines', 'Big Data Technologies'],
            category: 'advanced'
        },
        {
            id: 'microservices-architecture',
            title: 'Microservices Architecture',
            price: 6800,
            duration: '16 weeks',
            level: 'Advanced',
            description: 'Design and build microservices systems',
            features: ['Service Design', 'API Gateway', 'Service Mesh', 'Monitoring & Logging'],
            category: 'advanced'
        }
    ]
};

// Course Management System
class EnhancedCourseSystem {
    constructor() {
        this.courses = ENHANCED_COURSES;
        this.enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        this.init();
    }

    init() {
        this.renderCourseCategories();
        this.setupEventListeners();
    }

    renderCourseCategories() {
        const container = document.getElementById('enhanced-courses-container');
        if (!container) return;

        container.innerHTML = `
            <div class="course-categories">
                <div class="category-tabs flex flex-wrap gap-4 mb-8 justify-center">
                    <button class="category-tab active" data-category="all">All Courses</button>
                    <button class="category-tab" data-category="children">Kids & Teens</button>
                    <button class="category-tab" data-category="budget">Budget Friendly</button>
                    <button class="category-tab" data-category="intermediate">Intermediate</button>
                    <button class="category-tab" data-category="advanced">Advanced</button>
                </div>
                
                <div class="price-filter mb-8">
                    <div class="flex items-center justify-center gap-4">
                        <label class="text-slate-300">Price Range:</label>
                        <select id="price-filter" class="bg-slate-800 text-white px-4 py-2 rounded-lg">
                            <option value="all">All Prices</option>
                            <option value="0-500">₹0 - ₹500</option>
                            <option value="500-1500">₹500 - ₹1,500</option>
                            <option value="1500-3000">₹1,500 - ₹3,000</option>
                            <option value="3000-5000">₹3,000 - ₹5,000</option>
                            <option value="5000-8000">₹5,000 - ₹8,000</option>
                        </select>
                    </div>
                </div>
                
                <div id="courses-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Courses will be rendered here -->
                </div>
            </div>
        `;

        this.renderCourses('all');
    }

    renderCourses(category = 'all', priceRange = 'all') {
        const grid = document.getElementById('courses-grid');
        if (!grid) return;

        let allCourses = [];
        
        if (category === 'all') {
            Object.values(this.courses).forEach(categoryData => {
                allCourses = allCourses.concat(categoryData);
            });
        } else {
            allCourses = this.courses[category] || [];
        }

        // Apply price filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            allCourses = allCourses.filter(course => course.price >= min && course.price <= max);
        }

        grid.innerHTML = allCourses.map(course => this.createCourseCard(course)).join('');
    }

    createCourseCard(course) {
        const isEnrolled = this.enrolledCourses.includes(course.id);
        const ageGroupBadge = course.ageGroup ? `<span class="bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full text-xs">${course.ageGroup}</span>` : '';
        
        return `
            <div class="glass-card rounded-2xl p-6 hover-lift course-card" data-course-id="${course.id}">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex flex-wrap gap-2">
                        <span class="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">${course.level}</span>
                        ${ageGroupBadge}
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-gradient">₹${course.price.toLocaleString()}</div>
                        <div class="text-sm text-slate-400">${course.duration}</div>
                    </div>
                </div>
                
                <h3 class="text-xl font-bold mb-3">${course.title}</h3>
                <p class="text-slate-300 mb-4 text-sm">${course.description}</p>
                
                <div class="space-y-2 mb-6">
                    ${course.features.map(feature => `
                        <div class="flex items-center text-sm text-slate-300">
                            <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            ${feature}
                        </div>
                    `).join('')}
                </div>
                
                <button class="enroll-btn w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    isEnrolled 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'btn-primary text-white'
                }" data-course-id="${course.id}">
                    ${isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        // Category tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-tab')) {
                document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.dataset.category;
                const priceRange = document.getElementById('price-filter')?.value || 'all';
                this.renderCourses(category, priceRange);
            }
        });

        // Price filter
        document.addEventListener('change', (e) => {
            if (e.target.id === 'price-filter') {
                const activeTab = document.querySelector('.category-tab.active');
                const category = activeTab ? activeTab.dataset.category : 'all';
                this.renderCourses(category, e.target.value);
            }
        });

        // Enroll buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.enroll-btn')) {
                const courseId = e.target.dataset.courseId;
                this.handleEnrollment(courseId);
            }
        });
    }

    handleEnrollment(courseId) {
        const course = this.findCourseById(courseId);
        if (!course) return;

        if (this.enrolledCourses.includes(courseId)) {
            this.showMessage('You are already enrolled in this course!', 'info');
            if (window.aiTeacher) {
                window.aiTeacher.startCourse(course);
            }
            return;
        }

        // Check if user is authenticated
        const user = JSON.parse(localStorage.getItem('axonflow_user') || 'null');
        if (!user) {
            this.showMessage('Please sign in to enroll in courses', 'error');
            if (typeof globalAuth !== 'undefined') {
                globalAuth.showAuthModal();
            }
            return;
        }

        // Show enrollment form with payment
        if (typeof showEnrollmentForm === 'function') {
            showEnrollmentForm(courseId, course.title, course.price);
        } else {
            // Direct enrollment for free courses
            if (course.price === 0) {
                this.enrolledCourses.push(courseId);
                localStorage.setItem('enrolled_courses', JSON.stringify(this.enrolledCourses));
                
                const button = document.querySelector(`.enroll-btn[data-course-id="${courseId}"]`);
                if (button) {
                    button.className = 'enroll-btn w-full py-3 px-4 rounded-lg font-medium transition-all bg-green-500/20 text-green-300 border border-green-500/30';
                    button.textContent = '✓ Enrolled';
                }
                
                this.showMessage(`Successfully enrolled in ${course.title}!`, 'success');
                
                if (window.aiTeacher) {
                    window.aiTeacher.startCourse(course);
                }
            } else {
                this.showMessage(`Course: ${course.title} - ₹${course.price}. Payment integration coming soon!`, 'info');
            }
        }
    }

    findCourseById(courseId) {
        for (const category of Object.values(this.courses)) {
            const course = category.find(c => c.id === courseId);
            if (course) return course;
        }
        return null;
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-medium ${
            type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedCourseSystem = new EnhancedCourseSystem();
    });
} else {
    // DOM already loaded
    window.enhancedCourseSystem = new EnhancedCourseSystem();
}

// CSS for category tabs
const style = document.createElement('style');
style.textContent = `
    .category-tab {
        padding: 0.75rem 1.5rem;
        border-radius: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #94a3b8;
        font-weight: 500;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .category-tab:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .category-tab.active {
        background: linear-gradient(135deg, #06b6d4, #8b5cf6);
        color: white;
        border-color: transparent;
    }
`;
document.head.appendChild(style);