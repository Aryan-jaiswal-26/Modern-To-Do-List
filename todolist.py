from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
import json
import os
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

TODOS_FILE = 'todos.json'
USERS_FILE = 'users.json'
GOALS_FILE = 'goals.json'
SHARES_FILE = 'shares.json'

def load_todos():
    if os.path.exists(TODOS_FILE):
        with open(TODOS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_todos(todos):
    with open(TODOS_FILE, 'w') as f:
        json.dump(todos, f, indent=2)

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def load_goals():
    if os.path.exists(GOALS_FILE):
        with open(GOALS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_goals(goals):
    with open(GOALS_FILE, 'w') as f:
        json.dump(goals, f, indent=2)

def load_shares():
    if os.path.exists(SHARES_FILE):
        with open(SHARES_FILE, 'r') as f:
            return json.load(f)
    return []

def save_shares(shares):
    with open(SHARES_FILE, 'w') as f:
        json.dump(shares, f, indent=2)

def calculate_streak(user_id):
    todos = load_todos()
    user_todos = [t for t in todos if t.get('user_id') == user_id and t.get('completed')]
    if not user_todos:
        return 0
    
    dates = set()
    for todo in user_todos:
        date = todo.get('completed_at', todo.get('created_at', ''))[:10]
        dates.add(date)
    
    sorted_dates = sorted(dates, reverse=True)
    streak = 0
    current_date = datetime.now().date()
    
    for date_str in sorted_dates:
        date = datetime.fromisoformat(date_str).date()
        if (current_date - date).days == streak:
            streak += 1
            current_date = date
        else:
            break
    
    return streak

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', username=session.get('username'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        users = load_users()
        user = users.get(data['username'])
        
        if user and check_password_hash(user['password'], data['password']):
            session['user_id'] = data['username']
            session['username'] = user['username']
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.json
        users = load_users()
        
        if data['username'] in users:
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
        users[data['username']] = {
            'username': data['username'],
            'email': data['email'],
            'password': generate_password_hash(data['password'])
        }
        save_users(users)
        
        session['user_id'] = data['username']
        session['username'] = data['username']
        return jsonify({'success': True})
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/api/streak', methods=['GET'])
def get_streak():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    streak = calculate_streak(session['user_id'])
    return jsonify({'streak': streak})

@app.route('/api/goals', methods=['GET'])
def get_goals():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    goals = load_goals()
    user_goals = [g for g in goals if g.get('user_id') == session['user_id']]
    return jsonify(user_goals)

@app.route('/api/goals', methods=['POST'])
def add_goal():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    goals = load_goals()
    new_goal = {
        'id': len(goals) + 1,
        'title': data['title'],
        'target': data['target'],
        'current': 0,
        'created_at': datetime.now().isoformat(),
        'user_id': session['user_id']
    }
    goals.append(new_goal)
    save_goals(goals)
    return jsonify(new_goal), 201

@app.route('/api/share/<int:todo_id>', methods=['POST'])
def share_todo(todo_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    todos = load_todos()
    todo = next((t for t in todos if t['id'] == todo_id and t['user_id'] == session['user_id']), None)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    
    shares = load_shares()
    share_id = f"share_{len(shares) + 1}"
    share = {
        'id': share_id,
        'todo_id': todo_id,
        'todo_text': todo['text'],
        'shared_by': session['user_id'],
        'created_at': datetime.now().isoformat()
    }
    shares.append(share)
    save_shares(shares)
    
    share_url = f"{request.host_url}shared/{share_id}"
    return jsonify({'share_url': share_url})

@app.route('/shared/<share_id>')
def view_shared_todo(share_id):
    shares = load_shares()
    share = next((s for s in shares if s['id'] == share_id), None)
    if not share:
        return "Shared todo not found", 404
    return render_template('shared.html', share=share)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    todos = load_todos()
    user_todos = [t for t in todos if t.get('user_id') == session['user_id']]
    return jsonify(user_todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.json
    todos = load_todos()
    new_todo = {
        'id': len(todos) + 1,
        'text': data['text'],
        'completed': False,
        'created_at': datetime.now().isoformat(),
        'priority': data.get('priority', 'medium'),
        'user_id': session['user_id'],
        'goal_id': data.get('goal_id')
    }
    todos.append(new_todo)
    save_todos(todos)
    return jsonify(new_todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    todos = load_todos()
    for todo in todos:
        if todo['id'] == todo_id:
            if data.get('completed') and not todo.get('completed'):
                data['completed_at'] = datetime.now().isoformat()
            todo.update(data)
            save_todos(todos)
            return jsonify(todo)
    return jsonify({'error': 'Todo not found'}), 404

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todos = load_todos()
    todos = [t for t in todos if t['id'] != todo_id]
    save_todos(todos)
    return '', 204

@app.route('/api/goals/<int:goal_id>/progress', methods=['PUT'])
def update_goal_progress(goal_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    goals = load_goals()
    for goal in goals:
        if goal['id'] == goal_id and goal['user_id'] == session['user_id']:
            goal['current'] = min(goal['current'] + 1, goal['target'])
            save_goals(goals)
            return jsonify(goal)
    return jsonify({'error': 'Goal not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)