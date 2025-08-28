from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_socketio import SocketIO, emit, join_room, leave_room
import json
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage for demo purposes
users_db = {}
active_sessions = {}

def authenticate_user(username, password):
    user = users_db.get(username)
    return user and check_password_hash(user['password'], password)

def create_user(username, email, password):
    if username in users_db:
        return False
    users_db[username] = {
        'username': username,
        'email': email,
        'password': generate_password_hash(password),
        'theme': 'light'
    }
    return True

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session.get('username'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        
        if authenticate_user(data['username'], data['password']):
            session['user_id'] = data['username']
            session['username'] = data['username']
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.json
        
        if not create_user(data['username'], data['email'], data['password']):
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
        session['user_id'] = data['username']
        session['username'] = data['username']
        return jsonify({'success': True})
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/analytics')
def analytics():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('analytics.html', username=session.get('username'))

# API routes return success - data handled by localStorage
@app.route('/api/todos', methods=['GET', 'POST'])
def todos_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@app.route('/api/todos/<int:todo_id>', methods=['PUT', 'DELETE'])
def todo_item_api(todo_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@app.route('/api/streak', methods=['GET'])
def get_streak():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'streak': 0})

@app.route('/api/goals', methods=['GET', 'POST'])
def goals_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@app.route('/api/goals/<int:goal_id>/progress', methods=['PUT'])
def update_goal_progress(goal_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@app.route('/api/share/<int:todo_id>', methods=['POST'])
def share_todo(todo_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    share_url = f"{request.host_url}shared/{todo_id}"
    return jsonify({'share_url': share_url})

@app.route('/shared/<int:todo_id>')
def view_shared_todo(todo_id):
    return render_template('shared.html', todo_id=todo_id)

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@app.route('/api/workspaces', methods=['GET', 'POST'])
def workspaces_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify([])

@app.route('/api/theme', methods=['POST'])
def set_theme():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'success': True})

@socketio.on('join_workspace')
def on_join_workspace(data):
    if 'user_id' not in session:
        return
    
    workspace_id = data['workspace_id']
    username = session.get('username')
    join_room(f'workspace_{workspace_id}')
    
    emit('user_joined', {
        'username': username,
        'message': f'{username} joined the workspace'
    }, room=f'workspace_{workspace_id}')

@socketio.on('leave_workspace')
def on_leave_workspace(data):
    if 'user_id' not in session:
        return
    
    workspace_id = data['workspace_id']
    username = session.get('username')
    leave_room(f'workspace_{workspace_id}')
    
    emit('user_left', {
        'username': username,
        'message': f'{username} left the workspace'
    }, room=f'workspace_{workspace_id}')

@socketio.on('todo_update')
def on_todo_update(data):
    if 'user_id' not in session:
        return
    
    workspace_id = data.get('workspace_id')
    if workspace_id:
        emit('todo_updated', {
            'todo': data['todo'],
            'action': data['action'],
            'user': session.get('username')
        }, room=f'workspace_{workspace_id}', include_self=False)

@socketio.on('typing')
def on_typing(data):
    if 'user_id' not in session:
        return
    
    workspace_id = data.get('workspace_id')
    if workspace_id:
        emit('user_typing', {
            'user': session.get('username'),
            'typing': data['typing']
        }, room=f'workspace_{workspace_id}', include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)