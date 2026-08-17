from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import random
from datetime import datetime
from agents.ai_agent_system import agent_system

# Import AxonFlow Voice Engine modules
from axonflow_voice_agent import agent_engine, ExecutionLogger
from voice_marketplace import voice_marketplace
from telephony_bridge import telephony_bridge
from stripe_billing import stripe_billing
from audio_synthesizer import audio_synthesizer

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

app = Flask(__name__)

# CORS configuration
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize Gemini AI
if GEMINI_AVAILABLE:
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
    else:
        model = None
else:
    model = None

# AI Teacher Knowledge Base
AI_TEACHER_KNOWLEDGE = {
    "ai_fundamentals": {
        "topics": ["Machine Learning", "Neural Networks", "Deep Learning", "NLP", "Computer Vision"],
        "responses": {
            "what is ai": "AI (Artificial Intelligence) is the simulation of human intelligence in machines. It includes machine learning, where computers learn from data without explicit programming.",
            "machine learning": "Machine Learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions. There are three main types: supervised, unsupervised, and reinforcement learning.",
            "neural networks": "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information through weighted connections.",
            "deep learning": "Deep Learning uses neural networks with multiple layers to learn complex patterns. It's particularly effective for image recognition, natural language processing, and speech recognition."
        }
    },
    "programming": {
        "topics": ["Python", "JavaScript", "React", "Node.js", "APIs", "Databases"],
        "responses": {
            "python basics": "Python is a high-level programming language known for its simplicity. Key concepts include variables, functions, loops, and object-oriented programming.",
            "javascript": "JavaScript is the language of the web. It runs in browsers and servers (Node.js). Essential concepts include variables, functions, DOM manipulation, and asynchronous programming.",
            "react": "React is a JavaScript library for building user interfaces. It uses components, state management, and a virtual DOM for efficient updates.",
            "apis": "APIs (Application Programming Interfaces) allow different software applications to communicate. REST APIs use HTTP methods like GET, POST, PUT, DELETE."
        }
    },
    "web_development": {
        "topics": ["HTML", "CSS", "JavaScript", "Frontend", "Backend", "Full-Stack"],
        "responses": {
            "html": "HTML (HyperText Markup Language) structures web content using elements like headings, paragraphs, links, and images.",
            "css": "CSS (Cascading Style Sheets) styles HTML elements. It controls layout, colors, fonts, and responsive design.",
            "frontend": "Frontend development focuses on user interfaces using HTML, CSS, JavaScript, and frameworks like React, Vue, or Angular.",
            "backend": "Backend development handles server-side logic, databases, APIs, and authentication using languages like Python, Node.js, or Java."
        }
    }
}

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/voice')
@app.route('/voice-agent')
@app.route('/voice-agent-dashboard')
def serve_voice_dashboard():
    return send_from_directory('../frontend', 'voice-agent-dashboard.html')

@app.route('/<path:filename>')
def serve_static(filename):
    try:
        return send_from_directory('../frontend', filename)
    except:
        return send_from_directory('../frontend', 'index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('../frontend/css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('../frontend/js', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('../frontend/assets', filename)

# API Routes
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'AxonFlow Backend',
        'features': ['AI Teacher', 'Course Management', 'Authentication'],
        'ai_status': {
            'gemini_available': GEMINI_AVAILABLE,
            'gemini_configured': model is not None,
            'api_key_set': bool(os.getenv('GEMINI_API_KEY'))
        }
    })

@app.route('/api/ai-teacher/chat', methods=['POST'])
def ai_teacher_chat():
    data = request.get_json()
    user_message = data.get('message', '').lower().strip()
    course_context = data.get('course', 'general')
    
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Generate AI response
    response = generate_ai_response(user_message, course_context)
    
    return jsonify({
        'response': response,
        'timestamp': datetime.utcnow().isoformat(),
        'course_context': course_context,
        'suggestions': get_follow_up_suggestions(user_message, course_context)
    })

@app.route('/api/ai-teacher/courses')
def get_ai_courses():
    courses = [
        {
            'id': 'ai_fundamentals',
            'name': 'AI Fundamentals',
            'description': 'Learn the basics of Artificial Intelligence',
            'topics': AI_TEACHER_KNOWLEDGE['ai_fundamentals']['topics'],
            'difficulty': 'Beginner',
            'duration': '2 weeks'
        },
        {
            'id': 'programming',
            'name': 'Programming Essentials',
            'description': 'Master programming concepts and languages',
            'topics': AI_TEACHER_KNOWLEDGE['programming']['topics'],
            'difficulty': 'Beginner to Intermediate',
            'duration': '4 weeks'
        },
        {
            'id': 'web_development',
            'name': 'Web Development',
            'description': 'Build modern web applications',
            'topics': AI_TEACHER_KNOWLEDGE['web_development']['topics'],
            'difficulty': 'Intermediate',
            'duration': '6 weeks'
        }
    ]
    return jsonify({'courses': courses})

@app.route('/api/ai-teacher/lesson', methods=['POST'])
def get_lesson():
    data = request.get_json()
    course_id = data.get('course_id')
    topic = data.get('topic', '').lower()
    
    if course_id not in AI_TEACHER_KNOWLEDGE:
        return jsonify({'error': 'Course not found'}), 404
    
    lesson_content = generate_lesson_content(course_id, topic)
    
    return jsonify({
        'lesson': lesson_content,
        'course_id': course_id,
        'topic': topic,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/auth/sso', methods=['POST'])
def sso_auth():
    data = request.get_json()
    provider = data.get('provider')
    user_data = data.get('userData')
    
    if provider and user_data:
        result = agent_system.agents['auth_agent'].authenticate_sso(provider, user_data)
        return jsonify(result)
    
    return jsonify({'success': False, 'error': 'Invalid SSO data'})

@app.route('/api/courses/enroll', methods=['POST'])
def enroll_course():
    data = request.get_json()
    session_id = data.get('sessionId')
    course_id = data.get('courseId')
    
    # Verify user session
    session = agent_system.agents['auth_agent'].get_user_session(session_id)
    if not session:
        return jsonify({'success': False, 'error': 'Invalid session'})
    
    result = agent_system.agents['course_agent'].enroll_user(session['user_id'], course_id)
    return jsonify(result)

@app.route('/api/courses/my-courses', methods=['POST'])
def get_my_courses():
    data = request.get_json()
    session_id = data.get('sessionId')
    
    # Verify user session
    session = agent_system.agents['auth_agent'].get_user_session(session_id)
    if not session:
        return jsonify({'success': False, 'error': 'Invalid session'})
    
    courses = agent_system.agents['course_agent'].get_user_courses(session['user_id'])
    return jsonify({'success': True, 'courses': courses})

@app.route('/api/enrollment', methods=['POST'])
def course_enrollment():
    data = request.get_json()
    
    enrollment = {
        'id': f"enroll_{datetime.now().timestamp()}",
        'course_id': data.get('course_id'),
        'course_name': data.get('course_name'),
        'user_name': data.get('user_name'),
        'user_email': data.get('user_email'),
        'phone': data.get('phone'),
        'price': data.get('price'),
        'transaction_id': data.get('transaction_id'),
        'status': 'pending_verification',
        'enrolled_at': datetime.utcnow().isoformat()
    }
    
    return jsonify({
        'success': True,
        'message': 'Enrollment submitted successfully',
        'enrollment_id': enrollment['id'],
        'status': enrollment['status']
    })

@app.route('/api/contact', methods=['POST'])
def contact_form():
    data = request.get_json()
    
    contact = {
        'id': f"contact_{datetime.now().timestamp()}",
        'name': data.get('name'),
        'email': data.get('email'),
        'message': data.get('message'),
        'type': data.get('type', 'general'),
        'submitted_at': datetime.utcnow().isoformat()
    }
    
    return jsonify({
        'success': True,
        'message': 'Contact form submitted successfully',
        'contact_id': contact['id']
    })

@app.route('/api/create-payment', methods=['POST'])
def create_payment():
    data = request.get_json()
    user_details = data.get('user_details')
    course_details = data.get('course_details')
    
    if not user_details or not course_details:
        return jsonify({'success': False, 'error': 'Missing details'}), 400
        
    # Use payment agent to create payment intent/order
    result = agent_system.agents['payment_agent'].create_payment_request(
        user_data=user_details,
        course_data=course_details
    )
    
    return jsonify({'success': True, 'payment': result, 'payment_id': result['payment_id']})

@app.route('/api/verify-payment', methods=['POST'])
def verify_payment():
    data = request.get_json()
    payment_id = data.get('payment_id')
    transaction_id = data.get('transaction_id')
    
    if not payment_id or not transaction_id:
        return jsonify({'success': False, 'error': 'Missing payment details'}), 400
        
    # Use payment agent to verify
    result = agent_system.agents['payment_agent'].verify_payment(
        payment_id=payment_id,
        transaction_id=transaction_id
    )
    
    return jsonify(result)

def generate_ai_response(user_message, course_context):
    """Generate contextual AI teacher responses using Gemini AI"""
    
    # Try Gemini AI first
    if model:
        try:
            agent_context = get_agent_context(course_context)
            prompt = f"""
You are {agent_context['name']}, an expert AI teacher specializing in {agent_context['specialty']}.

Context: The student is asking about {course_context} topics.
Student Question: {user_message}

Provide a helpful, educational response that:
1. Directly answers their question
2. Includes practical examples when relevant
3. Suggests next learning steps
4. Keeps responses concise (2-3 paragraphs max)
5. Uses a friendly, encouraging tone

If they ask about AxonFlow courses, mention:
- AI Agent Development (₹25,000) - 3 months with 4 mentorship sessions
- Full-Stack Development (₹18,000) - 3 months with 3 mentorship sessions  
- Testing & QA (₹12,000) - 2 months with 2 mentorship sessions

Response:"""
            
            print(f"[Gemini AI] Sending request for: {user_message[:50]}...")
            response = model.generate_content(prompt)
            
            if response and response.text:
                print(f"[Gemini AI] Success - Response length: {len(response.text)}")
                return response.text
            else:
                print("[Gemini AI] Empty response received")
                return generate_fallback_response(user_message, course_context)
            
        except Exception as e:
            print(f"[Gemini AI] Error: {type(e).__name__} - {str(e)}")
            return generate_fallback_response(user_message, course_context)
    else:
        print("[Gemini AI] Model not initialized, using fallback")
    
    return generate_fallback_response(user_message, course_context)

def get_agent_context(course_context):
    """Get agent personality based on context"""
    contexts = {
        'general': {'name': 'Alex', 'specialty': 'general learning and course guidance'},
        'coding': {'name': 'CodeMaster', 'specialty': 'programming and software development'},
        'visual': {'name': 'GraphGuru', 'specialty': 'data visualization and interactive learning'},
        'quiz': {'name': 'QuizBot', 'specialty': 'assessment and knowledge testing'},
        'slides': {'name': 'SlideTeacher', 'specialty': 'structured presentations and tutorials'}
    }
    return contexts.get(course_context, contexts['general'])

def generate_fallback_response(user_message, course_context):
    """Fallback responses when AI is unavailable"""
    
    # Greeting responses
    greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
    if any(greeting in user_message for greeting in greetings):
        return "Hello! I'm your AI teacher. I'm here to help you learn AI, programming, and web development. What would you like to explore today?"
    
    # Help responses
    if 'help' in user_message or 'what can you do' in user_message:
        return "I can help you with:\n• AI and Machine Learning concepts\n• Programming in Python and JavaScript\n• Web development (HTML, CSS, React)\n• Course recommendations\n• Interactive lessons\n\nJust ask me anything you'd like to learn!"
    
    # Course-specific responses
    if course_context in AI_TEACHER_KNOWLEDGE:
        knowledge_base = AI_TEACHER_KNOWLEDGE[course_context]['responses']
        
        # Find matching response
        for key, response in knowledge_base.items():
            if any(word in user_message for word in key.split()):
                return f"{response}\n\nWould you like me to explain this further or move to a related topic?"
    
    # General AI responses
    ai_keywords = {
        'learn': "Learning is a journey! I recommend starting with fundamentals and building up. What specific topic interests you most?",
        'course': "We offer courses in AI Development (₹25,000), Full-Stack Development (₹18,000), and Testing & QA (₹12,000). Each includes 1:1 mentorship. Which interests you?",
        'career': "Tech careers are booming! AI/ML engineers, full-stack developers, and QA specialists are in high demand. I can help you choose the right path.",
        'project': "Hands-on projects are the best way to learn! I can guide you through building real applications step by step.",
        'difficulty': "Don't worry about difficulty! I adapt to your pace. We'll start with basics and gradually build complexity. Everyone learns differently.",
        'time': "Learning time varies by person and topic. Our courses range from 2-3 months with flexible scheduling. Consistency matters more than speed!",
        'job': "Our courses include job placement assistance! We help with resume building, interview prep, and connecting with hiring partners."
    }
    
    for keyword, response in ai_keywords.items():
        if keyword in user_message:
            return response
    
    # Default response with suggestions
    return "That's an interesting question! I'd love to help you explore that topic. Could you be more specific? For example:\n• Ask about AI concepts\n• Request a programming tutorial\n• Inquire about our courses\n• Get career advice"

def get_follow_up_suggestions(user_message, course_context):
    """Generate contextual follow-up suggestions"""
    
    suggestions = []
    
    if 'ai' in user_message or 'machine learning' in user_message:
        suggestions = [
            "What are neural networks?",
            "Explain deep learning",
            "How does machine learning work?",
            "Show me AI applications"
        ]
    elif 'programming' in user_message or 'code' in user_message:
        suggestions = [
            "Teach me Python basics",
            "How to start coding?",
            "Explain functions in programming",
            "What is object-oriented programming?"
        ]
    elif 'web' in user_message or 'website' in user_message:
        suggestions = [
            "How to build a website?",
            "What is React?",
            "Explain HTML and CSS",
            "Backend vs Frontend development"
        ]
    elif 'course' in user_message or 'learn' in user_message:
        suggestions = [
            "Which course should I choose?",
            "How long does it take to learn?",
            "Do you provide certificates?",
            "What about job placement?"
        ]
    else:
        suggestions = [
            "Tell me about AI fundamentals",
            "How to start programming?",
            "What courses do you offer?",
            "Help me choose a career path"
        ]
    
    return suggestions[:3]  # Return top 3 suggestions

def generate_lesson_content(course_id, topic):
    """Generate structured lesson content"""
    
    if course_id == 'ai_fundamentals' and 'machine learning' in topic:
        return {
            'title': 'Introduction to Machine Learning',
            'duration': '30 minutes',
            'sections': [
                {
                    'title': 'What is Machine Learning?',
                    'content': 'Machine Learning is a method of data analysis that automates analytical model building. It uses algorithms that iteratively learn from data.',
                    'examples': ['Email spam detection', 'Recommendation systems', 'Image recognition']
                },
                {
                    'title': 'Types of Machine Learning',
                    'content': 'There are three main types: Supervised Learning (with labeled data), Unsupervised Learning (finding patterns), and Reinforcement Learning (learning through rewards).',
                    'examples': ['Classification', 'Clustering', 'Game playing AI']
                },
                {
                    'title': 'Getting Started',
                    'content': 'Start with Python and libraries like scikit-learn. Practice with simple datasets and gradually work on complex problems.',
                    'examples': ['Iris flower classification', 'House price prediction', 'Customer segmentation']
                }
            ],
            'quiz': [
                {
                    'question': 'What type of ML uses labeled training data?',
                    'options': ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'],
                    'correct': 0
                }
            ],
            'next_topics': ['Neural Networks', 'Deep Learning', 'Natural Language Processing']
        }
    
    # Default lesson structure
    return {
        'title': f'Introduction to {topic.title()}',
        'duration': '20 minutes',
        'sections': [
            {
                'title': 'Overview',
                'content': f'This lesson covers the fundamentals of {topic}.',
                'examples': ['Basic concepts', 'Real-world applications', 'Best practices']
            }
        ],
        'quiz': [],
        'next_topics': ['Advanced concepts', 'Practical applications', 'Industry use cases']
    }

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    result = agent_system.agents['admin_agent'].authenticate_admin(email, password)
    return jsonify(result)

@app.route('/api/admin/system-status', methods=['GET'])
def get_system_status():
    status = agent_system.agents['admin_agent'].get_system_status()
    return jsonify(status)

@app.route('/api/admin/platform-stats', methods=['GET'])
def get_platform_stats():
    stats = agent_system.agents['admin_agent'].get_platform_stats()
    return jsonify(stats)

# ==========================================
# AXONFLOW VOICE PLATFORM REST API ENDPOINTS
# ==========================================

# 1. Autonomous Agent Execution & Turn Simulation
@app.route('/api/voice/process-turn', methods=['POST'])
def process_voice_turn():
    """Processes a user input turn through the Gemini tool calling agent."""
    data = request.get_json() or {}
    tenant_id = data.get('tenant_id', 'tenant_demo_salon')
    message = data.get('message', '')
    channel = data.get('channel', 'voice')
    session_id = data.get('session_id')
    customer_name = data.get('customer_name', 'Valued Customer')
    customer_phone = data.get('customer_phone', '+91 99887 76655')
    voice_tone = data.get('voice_tone', 'executive')
    voice_rate = data.get('voice_rate', '+1%')

    result = agent_engine.process_turn(
        tenant_id=tenant_id,
        customer_message=message,
        channel=channel,
        session_id=session_id,
        customer_phone=customer_phone,
        customer_name=customer_name,
        voice_tone=voice_tone,
        voice_rate=voice_rate
    )
    return jsonify(result)

# 2. Inbound Telephony / SIP Webhook (Twilio / BYON compatible)
@app.route('/api/voice/webhook', methods=['GET', 'POST'])
def voice_webhook():
    """Inbound voice call webhook that resolves tenant via BYON forward header."""
    req_data = request.values.to_dict() if request.values else (request.get_json() or {})
    parsed = telephony_bridge.parse_sip_or_webhook(req_data)
    
    # Process speech input
    speech_text = parsed.get("speech_text", "")
    if speech_text:
        turn_result = agent_engine.process_turn(
            tenant_id=parsed["tenant_id"],
            customer_message=speech_text,
            channel="voice",
            customer_phone=parsed["caller_number"]
        )
        response_text = turn_result["agent_response"]
    else:
        response_text = f"Hello! Welcome to {parsed['business_name']}. How can I assist you with your booking or order today?"
        
    twiml_xml = telephony_bridge.generate_twiml_response(response_text)
    return twiml_xml, 200, {'Content-Type': 'text/xml'}

# 3. Bring-Your-Own-Number (BYON) Carrier Guides
@app.route('/api/voice/byon-guide', methods=['GET'])
def get_byon_guide():
    phone_number = request.args.get('phone_number', '+91 98765 43210')
    guide = telephony_bridge.get_byon_carrier_guide(phone_number)
    return jsonify(guide)

# 4. Voice Marketplace & Universal Cross-Platform APIs
@app.route('/api/marketplace/voices', methods=['GET'])
def list_marketplace_voices():
    voices = voice_marketplace.list_voices()
    return jsonify({"success": True, "voices": voices})

@app.route('/api/marketplace/upload-voice', methods=['POST'])
def upload_custom_voice():
    """Allows a creator/user to clone, save their live recorded audio, and set as active agent voice."""
    data = request.get_json() or {}
    creator_name = data.get('creator_name', 'Saurabh Kumar Bajpai')
    voice_name = data.get('voice_name', 'Saurabh — Signature Neural Voice')
    description = data.get('description', 'High fidelity custom voice model cloned from live recording.')
    sample_text = data.get('sample_text', 'Hello! This is my official AI voice agent.')
    audio_base64 = data.get('audio_base64')
    
    timestamp_id = int(time.time())
    sample_audio_filename = f"user_voice_{timestamp_id}.mp3"
    audio_bytes = None
    
    # If live recorded or uploaded audio blob is sent, save to disk
    if audio_base64:
        try:
            import base64
            # Remove data URI prefix if present
            if ',' in audio_base64:
                audio_base64 = audio_base64.split(',', 1)[1]
            audio_bytes = base64.b64decode(audio_base64)
            audio_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'assets', 'audio')
            os.makedirs(audio_dir, exist_ok=True)
            
            # Save specific timestamped file and default sample
            sample_path = os.path.join(audio_dir, sample_audio_filename)
            default_path = os.path.join(audio_dir, 'saurabh_voice_sample.mp3')
            with open(sample_path, 'wb') as f:
                f.write(audio_bytes)
            with open(default_path, 'wb') as f:
                f.write(audio_bytes)
        except Exception as e:
            print("Error saving audio sample:", e)

    new_voice = voice_marketplace.register_custom_voice(
        creator_name=creator_name,
        voice_name=voice_name,
        description=description,
        sample_audio_name=sample_audio_filename,
        sample_text=sample_text
    )

    # Train and register inside Neural Audio Synthesizer with matching voice_id
    audio_synthesizer.train_and_register_voice(
        creator_name=creator_name,
        voice_name=voice_name,
        description=description,
        audio_filename=sample_audio_filename,
        setup_fee=499,
        rev_share=15,
        audio_bytes=audio_bytes,
        preferred_gender="male"
    )
    
    # Overwrite default saurabh_energetic_pro model with this user voice
    audio_synthesizer.train_and_register_voice(
        creator_name=creator_name,
        voice_name=voice_name,
        description=description,
        audio_filename=sample_audio_filename,
        setup_fee=499,
        rev_share=15,
        audio_bytes=audio_bytes,
        preferred_gender="male"
    )

    # Immediately set all demo tenants to use this newly cloned voice!
    for t_id, t_data in agent_engine.tenants.items():
        t_data["voice_id"] = new_voice["id"]
        t_data["voice_name"] = new_voice["name"]

    return jsonify({
        "success": True, 
        "voice": new_voice, 
        "message": f"Your recorded voice '{voice_name}' is now cloned, trained, and set as the active voice for all AI agents!"
    })

@app.route('/api/voice/speak-custom-text', methods=['POST'])
def speak_custom_text():
    """Allows instant synthesis of ANY arbitrary text directly in user's cloned voice model."""
    data = request.get_json() or {}
    text = data.get('text', 'Hello, this is my AI voice speaking.')
    voice_id = data.get('voice_id', 'saurabh_energetic_pro')
    voice_tone = data.get('voice_tone', 'natural_conversational')
    
    synth_res = audio_synthesizer.synthesize_speech_stream(
        text=text,
        voice_id=voice_id,
        voice_tone=voice_tone
    )
    return jsonify(synth_res)

@app.route('/api/marketplace/integration-snippets', methods=['GET'])
def get_voice_integration_snippets():
    """Returns copy-paste integration configs for Twilio, Vapi, Retell, and Bland AI."""
    voice_id = request.args.get('voice_id', 'saurabh_energetic_pro')
    snippets = voice_marketplace.get_platform_integration_snippets(voice_id)
    return jsonify({"success": True, "snippets": snippets})

@app.route('/api/marketplace/license', methods=['POST'])
def license_marketplace_voice():
    data = request.get_json() or {}
    tenant_id = data.get('tenant_id', 'tenant_demo_salon')
    voice_id = data.get('voice_id', 'saurabh_energetic_pro')
    result = voice_marketplace.license_voice(tenant_id, voice_id)
    return jsonify(result)

@app.route('/api/marketplace/creator-pnl', methods=['GET'])
def get_creator_pnl():
    pnl = voice_marketplace.get_creator_pnl()
    return jsonify(pnl)

# 5. Durable Execution Logs & Performance Stats (Hackathon Evidence)
@app.route('/api/voice/logs', methods=['GET'])
def get_execution_logs():
    tenant_id = request.args.get('tenant_id')
    limit = int(request.args.get('limit', 50))
    logs = agent_engine.logger.get_logs(tenant_id=tenant_id, limit=limit)
    stats = agent_engine.logger.get_stats(tenant_id=tenant_id)
    return jsonify({
        "success": True,
        "total_returned": len(logs),
        "stats": stats,
        "logs": logs
    })

# 6. Tenant Management & Onboarding
@app.route('/api/voice/tenants', methods=['GET', 'POST'])
def manage_tenants():
    if request.method == 'POST':
        data = request.get_json() or {}
        new_tenant = agent_engine.register_tenant(data)
        return jsonify({"success": True, "tenant": new_tenant})
    else:
        return jsonify({"success": True, "tenants": list(agent_engine.tenants.values())})

@app.route('/api/voice/tenants/<tenant_id>', methods=['GET'])
def get_tenant_details(tenant_id):
    tenant = agent_engine.get_tenant(tenant_id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    return jsonify({"success": True, "tenant": tenant})

# 7. Stripe Billing & P&L Statement
@app.route('/api/billing/checkout', methods=['POST'])
def create_billing_checkout():
    data = request.get_json() or {}
    tenant_id = data.get('tenant_id', 'tenant_demo_salon')
    plan_type = data.get('plan_type', 'subscription_base')
    session = stripe_billing.create_checkout_session(tenant_id, plan_type)
    return jsonify(session)

@app.route('/api/billing/financials', methods=['GET'])
def get_billing_financials():
    financials = stripe_billing.get_financial_summary()
    return jsonify({"success": True, "financials": financials})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(debug=False, host='0.0.0.0', port=port)