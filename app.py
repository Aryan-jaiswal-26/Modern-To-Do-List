from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
socketio = SocketIO(app, cors_allowed_origins="*")

# Supabase configuration
url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
supabase: Client = create_client(url, key)

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
mail = Mail(app)

# Supabase helper functions
def get_user_by_username(username):
    result = supabase.table('users').select('*').eq('username', username).execute()
    return result.data[0] if result.data else None

def create_user(username, email, password):
    try:
        result = supabase.table('users').insert({
            'username': username,
            'email': email,
            'password': generate_password_hash(password)
        }).execute()
        print(f"Insert result: {result}")
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Create user error: {e}")
        return None

def send_streak_reminder(user_email, username, missed_goals):
    try:
        msg = Message(
            'Streakify - Don\'t Break Your Streak!',
            sender=app.config['MAIL_USERNAME'],
            recipients=[user_email]
        )
        msg.html = render_template('email/streak_reminder.html', 
                                 username=username, 
                                 missed_goals=missed_goals)
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")

def check_streaks():
    """Check for missed streaks and send notifications"""
    today = datetime.now().date().isoformat()
    yesterday = (datetime.now().date() - timedelta(days=1)).isoformat()
    
    # Find goals that weren't completed yesterday
    goals_result = supabase.table('goals').select('*, users(email, username)').eq('is_active', True).execute()
    progress_result = supabase.table('goal_progress').select('goal_id').eq('completed_date', yesterday).execute()
    
    completed_goal_ids = [p['goal_id'] for p in progress_result.data]
    missed_goals = [g for g in goals_result.data if g['id'] not in completed_goal_ids]
    
    # Group by user and send notifications
    user_missed = {}
    for goal in missed_goals:
        email = goal['users']['email']
        username = goal['users']['username']
        if email not in user_missed:
            user_missed[email] = {'username': username, 'goals': []}
        user_missed[email]['goals'].append(goal['title'])
    
    for email, data in user_missed.items():
        send_streak_reminder(email, data['username'], data['goals'])

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=check_streaks, trigger="cron", hour=9, minute=0)  # Daily at 9 AM
scheduler.start()

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session.get('username'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        user = get_user_by_username(data['username'])
        
        if user and check_password_hash(user['password'], data['password']):
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        try:
            data = request.json
            print(f"Registration data: {data}")
            
            # Check if user exists
            username_check = supabase.table('users').select('id').eq('username', data['username']).execute()
            email_check = supabase.table('users').select('id').eq('email', data['email']).execute()
            print(f"Username check: {username_check.data}, Email check: {email_check.data}")
            
            if username_check.data or email_check.data:
                return jsonify({'success': False, 'message': 'Username or email already exists'}), 400
            
            # Create user
            user = create_user(data['username'], data['email'], data['password'])
            print(f"Created user: {user}")
            
            if not user:
                return jsonify({'success': False, 'message': 'Registration failed'}), 400
            
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({'success': True})
        except Exception as e:
            print(f"Registration error: {e}")
            return jsonify({'success': False, 'message': str(e)}), 400
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# Tasks API
@app.route('/api/tasks', methods=['GET', 'POST'])
def tasks_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        result = supabase.table('tasks').select('*').eq('user_id', session['user_id']).order('created_at', desc=True).execute()
        return jsonify(result.data)
    
    elif request.method == 'POST':
        data = request.json
        result = supabase.table('tasks').insert({
            'user_id': session['user_id'],
            'title': data['title'],
            'description': data.get('description', ''),
            'priority': data.get('priority', 'medium'),
            'due_date': data.get('due_date')
        }).execute()
        return jsonify({'success': True})

@app.route('/api/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def task_item_api(task_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'PUT':
        data = request.json
        supabase.table('tasks').update({
            'title': data['title'],
            'description': data.get('description', ''),
            'completed': data.get('completed', False),
            'priority': data.get('priority', 'medium'),
            'due_date': data.get('due_date')
        }).eq('id', task_id).eq('user_id', session['user_id']).execute()
        return jsonify({'success': True})
    
    elif request.method == 'DELETE':
        supabase.table('tasks').delete().eq('id', task_id).eq('user_id', session['user_id']).execute()
        return jsonify({'success': True})

# Goals API
@app.route('/api/goals', methods=['GET', 'POST'])
def goals_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        result = supabase.table('goals').select('*').eq('user_id', session['user_id']).eq('is_active', True).order('created_at', desc=True).execute()
        return jsonify(result.data)
    
    elif request.method == 'POST':
        data = request.json
        supabase.table('goals').insert({
            'user_id': session['user_id'],
            'title': data['title'],
            'description': data.get('description', ''),
            'target_days': data['target_days']
        }).execute()
        return jsonify({'success': True})

@app.route('/api/goals/<int:goal_id>/complete', methods=['POST'])
def complete_goal(goal_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    today = datetime.now().date().isoformat()
    
    # Check if already completed today
    existing = supabase.table('goal_progress').select('id').eq('goal_id', goal_id).eq('user_id', session['user_id']).eq('completed_date', today).execute()
    
    if existing.data:
        return jsonify({'success': False, 'message': 'Already completed today'})
    
    # Add completion record
    data = request.json
    supabase.table('goal_progress').insert({
        'goal_id': goal_id,
        'user_id': session['user_id'],
        'completed_date': today,
        'notes': data.get('notes', '')
    }).execute()
    
    # Update streak
    goal_result = supabase.table('goals').select('*').eq('id', goal_id).execute()
    goal = goal_result.data[0]
    yesterday = (datetime.now().date() - timedelta(days=1)).isoformat()
    
    if goal['last_completed'] == yesterday:
        new_streak = goal['current_streak'] + 1
    else:
        new_streak = 1
    
    best_streak = max(goal['best_streak'], new_streak)
    
    supabase.table('goals').update({
        'current_streak': new_streak,
        'best_streak': best_streak,
        'last_completed': today
    }).eq('id', goal_id).execute()
    
    return jsonify({'success': True, 'new_streak': new_streak})

# Workbench API
@app.route('/api/workbenches', methods=['GET', 'POST'])
def workbenches_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        # Get workbenches where user is member or owner
        member_result = supabase.table('workbench_members').select('workbench_id').eq('user_id', session['user_id']).execute()
        workbench_ids = [m['workbench_id'] for m in member_result.data]
        
        if workbench_ids:
            result = supabase.table('workbenches').select('*, users(username)').in_('id', workbench_ids).execute()
        else:
            result = supabase.table('workbenches').select('*, users(username)').eq('owner_id', session['user_id']).execute()
        
        return jsonify(result.data)
    
    elif request.method == 'POST':
        data = request.json
        invite_code = str(uuid.uuid4())[:8]
        
        wb_result = supabase.table('workbenches').insert({
            'name': data['name'],
            'description': data.get('description', ''),
            'owner_id': session['user_id'],
            'invite_code': invite_code
        }).execute()
        
        workbench_id = wb_result.data[0]['id']
        
        # Add owner as member
        supabase.table('workbench_members').insert({
            'workbench_id': workbench_id,
            'user_id': session['user_id'],
            'role': 'owner'
        }).execute()
        
        return jsonify({'success': True, 'invite_code': invite_code})

@app.route('/api/workbenches/join', methods=['POST'])
def join_workbench():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    
    workbench_result = supabase.table('workbenches').select('*').eq('invite_code', data['invite_code']).execute()
    
    if not workbench_result.data:
        return jsonify({'success': False, 'message': 'Invalid invite code'})
    
    workbench = workbench_result.data[0]
    
    # Check if already a member
    existing = supabase.table('workbench_members').select('id').eq('workbench_id', workbench['id']).eq('user_id', session['user_id']).execute()
    
    if existing.data:
        return jsonify({'success': False, 'message': 'Already a member'})
    
    supabase.table('workbench_members').insert({
        'workbench_id': workbench['id'],
        'user_id': session['user_id']
    }).execute()
    
    return jsonify({'success': True})

@app.route('/api/workbenches/<int:workbench_id>/goals', methods=['GET', 'POST'])
def workbench_goals_api(workbench_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Verify membership
    member = supabase.table('workbench_members').select('id').eq('workbench_id', workbench_id).eq('user_id', session['user_id']).execute()
    
    if not member.data:
        return jsonify({'error': 'Not a member'}), 403
    
    if request.method == 'GET':
        result = supabase.table('workbench_goals').select('*, goals(*, users(username))').eq('workbench_id', workbench_id).execute()
        return jsonify(result.data)
    
    elif request.method == 'POST':
        data = request.json
        goal_id = data['goal_id']
        
        # Verify goal ownership
        goal = supabase.table('goals').select('id').eq('id', goal_id).eq('user_id', session['user_id']).execute()
        
        if not goal.data:
            return jsonify({'error': 'Goal not found'}), 404
        
        supabase.table('workbench_goals').insert({
            'workbench_id': workbench_id,
            'goal_id': goal_id
        }).execute()
        
        return jsonify({'success': True})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)