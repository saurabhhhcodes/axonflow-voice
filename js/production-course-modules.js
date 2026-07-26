// Production Course Modules - Real curriculum for each course
const PRODUCTION_MODULES = {
    // AI & ML Courses
    'ai-machine-learning': {
        modules: [
            {id: 1, title: 'Introduction to AI & ML', topics: ['What is AI?', 'ML vs DL', 'Applications', 'Career Paths'], duration: '2h'},
            {id: 2, title: 'Python for AI', topics: ['NumPy', 'Pandas', 'Matplotlib', 'Data Processing'], duration: '4h'},
            {id: 3, title: 'Supervised Learning', topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest'], duration: '6h'},
            {id: 4, title: 'Unsupervised Learning', topics: ['K-Means', 'Hierarchical Clustering', 'PCA', 'Dimensionality Reduction'], duration: '5h'},
            {id: 5, title: 'Neural Networks', topics: ['Perceptron', 'Backpropagation', 'Activation Functions', 'Optimization'], duration: '6h'},
            {id: 6, title: 'Deep Learning', topics: ['CNN', 'RNN', 'LSTM', 'Transfer Learning'], duration: '8h'},
            {id: 7, title: 'NLP Fundamentals', topics: ['Text Processing', 'Word Embeddings', 'Transformers', 'BERT'], duration: '6h'},
            {id: 8, title: 'Computer Vision', topics: ['Image Processing', 'Object Detection', 'Face Recognition', 'GANs'], duration: '7h'},
            {id: 9, title: 'ML Deployment', topics: ['Flask API', 'Docker', 'Cloud Deployment', 'Model Serving'], duration: '5h'},
            {id: 10, title: 'Capstone Project', topics: ['End-to-end ML Project', 'Real Dataset', 'Deployment', 'Presentation'], duration: '10h'}
        ]
    },

    // Full Stack Development
    'fullstack-mern': {
        modules: [
            {id: 1, title: 'Web Fundamentals', topics: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox & Grid'], duration: '3h'},
            {id: 2, title: 'JavaScript Mastery', topics: ['ES6+', 'Async/Await', 'Promises', 'DOM Manipulation'], duration: '5h'},
            {id: 3, title: 'React.js Basics', topics: ['Components', 'Props & State', 'Hooks', 'Event Handling'], duration: '6h'},
            {id: 4, title: 'Advanced React', topics: ['Context API', 'Redux', 'React Router', 'Performance'], duration: '6h'},
            {id: 5, title: 'Node.js & Express', topics: ['Server Setup', 'Routing', 'Middleware', 'REST APIs'], duration: '5h'},
            {id: 6, title: 'MongoDB', topics: ['NoSQL Basics', 'CRUD Operations', 'Mongoose', 'Aggregation'], duration: '4h'},
            {id: 7, title: 'Authentication', topics: ['JWT', 'OAuth', 'Sessions', 'Security'], duration: '4h'},
            {id: 8, title: 'Full Stack Integration', topics: ['Frontend-Backend', 'API Integration', 'State Management', 'Error Handling'], duration: '6h'},
            {id: 9, title: 'Deployment', topics: ['Heroku', 'Vercel', 'MongoDB Atlas', 'CI/CD'], duration: '3h'},
            {id: 10, title: 'Final Project', topics: ['E-commerce App', 'Social Media', 'Dashboard', 'Portfolio'], duration: '12h'}
        ]
    },

    // Data Science
    'data-science-python': {
        modules: [
            {id: 1, title: 'Python Basics', topics: ['Syntax', 'Data Types', 'Functions', 'OOP'], duration: '3h'},
            {id: 2, title: 'NumPy & Pandas', topics: ['Arrays', 'DataFrames', 'Data Cleaning', 'Manipulation'], duration: '5h'},
            {id: 3, title: 'Data Visualization', topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboards'], duration: '4h'},
            {id: 4, title: 'Statistics', topics: ['Descriptive Stats', 'Probability', 'Hypothesis Testing', 'Distributions'], duration: '5h'},
            {id: 5, title: 'SQL & Databases', topics: ['SQL Queries', 'Joins', 'Aggregations', 'Database Design'], duration: '4h'},
            {id: 6, title: 'Machine Learning', topics: ['Scikit-learn', 'Model Training', 'Evaluation', 'Tuning'], duration: '6h'},
            {id: 7, title: 'Feature Engineering', topics: ['Feature Selection', 'Encoding', 'Scaling', 'Creation'], duration: '4h'},
            {id: 8, title: 'Time Series', topics: ['ARIMA', 'Forecasting', 'Seasonality', 'Trends'], duration: '5h'},
            {id: 9, title: 'Big Data', topics: ['Spark', 'Hadoop', 'Distributed Computing', 'Cloud'], duration: '5h'},
            {id: 10, title: 'Capstone', topics: ['Real Dataset', 'EDA', 'Modeling', 'Insights'], duration: '10h'}
        ]
    },

    // Biotechnology
    'biotech-ai': {
        modules: [
            {id: 1, title: 'Biotech Fundamentals', topics: ['Molecular Biology', 'Genetics', 'Cell Biology', 'Biochemistry'], duration: '4h'},
            {id: 2, title: 'Bioinformatics', topics: ['Sequence Analysis', 'BLAST', 'Alignment', 'Databases'], duration: '5h'},
            {id: 3, title: 'Genomics', topics: ['DNA Sequencing', 'Gene Expression', 'RNA-Seq', 'Variants'], duration: '6h'},
            {id: 4, title: 'Proteomics', topics: ['Protein Structure', 'Mass Spectrometry', 'Protein-Protein Interaction'], duration: '5h'},
            {id: 5, title: 'AI in Drug Discovery', topics: ['Molecular Docking', 'QSAR', 'Virtual Screening', 'Lead Optimization'], duration: '6h'},
            {id: 6, title: 'Machine Learning for Biology', topics: ['Classification', 'Clustering', 'Feature Selection', 'Validation'], duration: '6h'},
            {id: 7, title: 'Deep Learning in Genomics', topics: ['CNN for Sequences', 'RNN for Genes', 'Transformers', 'AlphaFold'], duration: '7h'},
            {id: 8, title: 'Clinical AI', topics: ['Medical Imaging', 'Diagnosis', 'Prognosis', 'Personalized Medicine'], duration: '6h'},
            {id: 9, title: 'Regulatory & Ethics', topics: ['FDA Guidelines', 'Clinical Trials', 'Data Privacy', 'Ethics'], duration: '4h'},
            {id: 10, title: 'Research Project', topics: ['Literature Review', 'Hypothesis', 'Analysis', 'Publication'], duration: '12h'}
        ]
    },

    // Psychology
    'psychology-data': {
        modules: [
            {id: 1, title: 'Psychology Basics', topics: ['Cognitive', 'Behavioral', 'Social', 'Developmental'], duration: '4h'},
            {id: 2, title: 'Research Methods', topics: ['Experimental Design', 'Surveys', 'Interviews', 'Ethics'], duration: '5h'},
            {id: 3, title: 'Statistics for Psychology', topics: ['Descriptive Stats', 'Inferential Stats', 'ANOVA', 'Regression'], duration: '6h'},
            {id: 4, title: 'Data Collection', topics: ['Questionnaires', 'Scales', 'Validity', 'Reliability'], duration: '4h'},
            {id: 5, title: 'Behavioral Analytics', topics: ['User Behavior', 'A/B Testing', 'Conversion', 'Engagement'], duration: '5h'},
            {id: 6, title: 'Sentiment Analysis', topics: ['NLP', 'Emotion Detection', 'Text Mining', 'Social Media'], duration: '6h'},
            {id: 7, title: 'Predictive Psychology', topics: ['ML Models', 'Personality Prediction', 'Mental Health AI', 'Risk Assessment'], duration: '6h'},
            {id: 8, title: 'Neuroscience & AI', topics: ['Brain Imaging', 'EEG Analysis', 'Neural Networks', 'Cognitive Models'], duration: '6h'},
            {id: 9, title: 'Clinical Applications', topics: ['Therapy Chatbots', 'Mental Health Apps', 'Diagnosis Support', 'Treatment'], duration: '5h'},
            {id: 10, title: 'Research Project', topics: ['Study Design', 'Data Analysis', 'Interpretation', 'Report'], duration: '10h'}
        ]
    },

    // Pharmaceutical Sciences
    'pharma-tech': {
        modules: [
            {id: 1, title: 'Pharma Basics', topics: ['Pharmacology', 'Drug Classes', 'Mechanisms', 'Therapeutics'], duration: '5h'},
            {id: 2, title: 'Drug Development', topics: ['Discovery', 'Preclinical', 'Clinical Trials', 'Approval'], duration: '6h'},
            {id: 3, title: 'Regulatory Affairs', topics: ['FDA', 'EMA', 'ICH Guidelines', 'Submissions'], duration: '5h'},
            {id: 4, title: 'Clinical Trials', topics: ['Phase I-IV', 'Protocol Design', 'Patient Recruitment', 'Data Management'], duration: '6h'},
            {id: 5, title: 'AI in Drug Discovery', topics: ['Target Identification', 'Lead Optimization', 'ADMET Prediction', 'Repurposing'], duration: '7h'},
            {id: 6, title: 'Pharmacovigilance', topics: ['Adverse Events', 'Signal Detection', 'Risk Management', 'Reporting'], duration: '5h'},
            {id: 7, title: 'Manufacturing Tech', topics: ['GMP', 'Quality Control', 'Process Optimization', 'Automation'], duration: '5h'},
            {id: 8, title: 'Supply Chain', topics: ['Distribution', 'Cold Chain', 'Serialization', 'Track & Trace'], duration: '4h'},
            {id: 9, title: 'Digital Health', topics: ['Telemedicine', 'Wearables', 'Remote Monitoring', 'Patient Apps'], duration: '5h'},
            {id: 10, title: 'Industry Project', topics: ['Case Study', 'Regulatory Submission', 'Market Analysis', 'Strategy'], duration: '12h'}
        ]
    },

    // Default template for other courses
    'default': {
        modules: [
            {id: 1, title: 'Introduction & Fundamentals', topics: ['Overview', 'Core Concepts', 'Prerequisites', 'Tools'], duration: '2h'},
            {id: 2, title: 'Basic Concepts', topics: ['Theory', 'Principles', 'Best Practices', 'Examples'], duration: '3h'},
            {id: 3, title: 'Intermediate Topics', topics: ['Advanced Theory', 'Techniques', 'Patterns', 'Case Studies'], duration: '4h'},
            {id: 4, title: 'Practical Applications', topics: ['Hands-on', 'Projects', 'Real-world', 'Problem Solving'], duration: '5h'},
            {id: 5, title: 'Advanced Concepts', topics: ['Expert Level', 'Optimization', 'Scaling', 'Performance'], duration: '5h'},
            {id: 6, title: 'Tools & Technologies', topics: ['Software', 'Frameworks', 'Libraries', 'Platforms'], duration: '4h'},
            {id: 7, title: 'Industry Standards', topics: ['Best Practices', 'Guidelines', 'Compliance', 'Quality'], duration: '3h'},
            {id: 8, title: 'Capstone Project', topics: ['Planning', 'Implementation', 'Testing', 'Deployment'], duration: '8h'}
        ]
    }
};

// Get modules for a course
function getCourseModules(courseId) {
    return PRODUCTION_MODULES[courseId] || PRODUCTION_MODULES['default'];
}

window.PRODUCTION_MODULES = PRODUCTION_MODULES;
window.getCourseModules = getCourseModules;
