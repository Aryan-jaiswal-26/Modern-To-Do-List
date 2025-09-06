class StreakifyApp {
    constructor() {
        this.currentSection = 'tasks';
        this.tasks = [];
        this.goals = [];
        this.workbenches = [];
        this.socket = io();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.setupSocketEvents();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        // Modal events
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.getElementById('addGoalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
        });

        document.getElementById('createWorkbenchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createWorkbench();
        });

        document.getElementById('joinWorkbenchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.joinWorkbench();
        });

        // Filter events
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `${section}-section`);
        });

        this.currentSection = section;
        this.loadSectionData(section);
    }

    async loadData() {
        await Promise.all([
            this.loadTasks(),
            this.loadGoals(),
            this.loadWorkbenches(),
            this.loadAnalytics()
        ]);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'tasks':
                await this.loadTasks();
                break;
            case 'goals':
                await this.loadGoals();
                break;
            case 'workbench':
                await this.loadWorkbenches();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    // Tasks Management
    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            this.tasks = await response.json();
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async addTask() {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    due_date: dueDate || null
                })
            });

            if (response.ok) {
                this.closeModal('addTaskModal');
                this.clearForm('addTaskForm');
                await this.loadTasks();
                this.showNotification('Task added successfully!', 'success');
            }
        } catch (error) {
            this.showNotification('Error adding task', 'error');
        }
    }

    async toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...task,
                    completed: !task.completed
                })
            });

            if (response.ok) {
                await this.loadTasks();
                this.showNotification(
                    task.completed ? 'Task marked as pending' : 'Task completed!',
                    'success'
                );
            }
        } catch (error) {
            this.showNotification('Error updating task', 'error');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await this.loadTasks();
                this.showNotification('Task deleted successfully', 'success');
            }
        } catch (error) {
            this.showNotification('Error deleting task', 'error');
        }
    }

    renderTasks() {
        const container = document.getElementById('tasksList');
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <h3>No tasks yet</h3>
                    <p>Create your first task to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="app.toggleTask(${task.id})">
                    <div class="task-info">
                        <div class="task-title">${task.title}</div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    </div>
                    <div class="priority-badge priority-${task.priority}">${task.priority}</div>
                </div>
                <div class="task-meta">
                    <span class="task-date">
                        ${task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : 'No due date'}
                    </span>
                    <div class="task-actions">
                        <button onclick="app.deleteTask(${task.id})" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Goals Management
    async loadGoals() {
        try {
            const response = await fetch('/api/goals');
            this.goals = await response.json();
            this.renderGoals();
            this.updateStreakDisplay();
        } catch (error) {
            console.error('Error loading goals:', error);
        }
    }

    async addGoal() {
        const title = document.getElementById('goalTitle').value;
        const description = document.getElementById('goalDescription').value;
        const targetDays = parseInt(document.getElementById('goalTargetDays').value);

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    target_days: targetDays
                })
            });

            if (response.ok) {
                this.closeModal('addGoalModal');
                this.clearForm('addGoalForm');
                await this.loadGoals();
                this.showNotification('Goal created successfully!', 'success');
            }
        } catch (error) {
            this.showNotification('Error creating goal', 'error');
        }
    }

    async completeGoal(goalId) {
        try {
            const response = await fetch(`/api/goals/${goalId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes: ''
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                await this.loadGoals();
                this.showNotification(`Goal completed! Streak: ${result.new_streak} days 🔥`, 'success');
            } else {
                this.showNotification(result.message || 'Error completing goal', 'warning');
            }
        } catch (error) {
            this.showNotification('Error completing goal', 'error');
        }
    }

    renderGoals() {
        const container = document.getElementById('goalsList');
        if (!container) return;

        if (this.goals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bullseye"></i>
                    <h3>No goals yet</h3>
                    <p>Create your first goal to start building streaks!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.goals.map(goal => {
            const progress = (goal.current_streak / goal.target_days) * 100;
            const today = new Date().toISOString().split('T')[0];
            const canComplete = goal.last_completed !== today;

            return `
                <div class="goal-card" data-id="${goal.id}">
                    <div class="goal-header">
                        <div>
                            <div class="goal-title">${goal.title}</div>
                            ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
                        </div>
                        <div class="streak-info">
                            <div class="current-streak">
                                <i class="fas fa-fire"></i>
                                ${goal.current_streak}
                            </div>
                            <div class="best-streak">Best: ${goal.best_streak}</div>
                        </div>
                    </div>
                    
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <div class="progress-text">
                            ${goal.current_streak} / ${goal.target_days} days
                        </div>
                    </div>
                    
                    <div class="goal-actions">
                        <button class="complete-btn" 
                                onclick="app.completeGoal(${goal.id})"
                                ${!canComplete ? 'disabled' : ''}>
                            ${canComplete ? 'Complete Today' : 'Completed Today ✓'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStreakDisplay() {
        const maxStreak = Math.max(...this.goals.map(g => g.current_streak), 0);
        document.getElementById('streakCount').textContent = maxStreak;
    }

    // Workbench Management
    async loadWorkbenches() {
        try {
            const response = await fetch('/api/workbenches');
            this.workbenches = await response.json();
            this.renderWorkbenches();
        } catch (error) {
            console.error('Error loading workbenches:', error);
        }
    }

    async createWorkbench() {
        const name = document.getElementById('workbenchName').value;
        const description = document.getElementById('workbenchDescription').value;

        try {
            const response = await fetch('/api/workbenches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.closeModal('createWorkbenchModal');
                this.clearForm('createWorkbenchForm');
                await this.loadWorkbenches();
                this.showNotification(`Workbench created! Invite code: ${result.invite_code}`, 'success');
            }
        } catch (error) {
            this.showNotification('Error creating workbench', 'error');
        }
    }

    async joinWorkbench() {
        const inviteCode = document.getElementById('inviteCode').value;

        try {
            const response = await fetch('/api/workbenches/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invite_code: inviteCode })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.closeModal('joinWorkbenchModal');
                this.clearForm('joinWorkbenchForm');
                await this.loadWorkbenches();
                this.showNotification('Successfully joined workbench!', 'success');
            } else {
                this.showNotification(result.message || 'Error joining workbench', 'error');
            }
        } catch (error) {
            this.showNotification('Error joining workbench', 'error');
        }
    }

    renderWorkbenches() {
        const container = document.getElementById('workbenchList');
        if (!container) return;

        if (this.workbenches.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No workbenches yet</h3>
                    <p>Create or join a workbench to collaborate with others!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.workbenches.map(wb => `
            <div class="workbench-card" data-id="${wb.id}">
                <div class="workbench-header">
                    <div>
                        <div class="workbench-name">${wb.name}</div>
                        <div class="workbench-description">${wb.description || 'No description'}</div>
                    </div>
                </div>
                
                <div class="workbench-meta">
                    <div class="member-count">
                        <i class="fas fa-users"></i>
                        ${wb.member_count} members
                    </div>
                    <div class="invite-code">
                        Code: ${wb.invite_code}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Analytics
    async loadAnalytics() {
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const currentStreak = Math.max(...this.goals.map(g => g.current_streak), 0);
        const bestStreak = Math.max(...this.goals.map(g => g.best_streak), 0);
        const activeGoals = this.goals.length;

        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('currentStreak').textContent = currentStreak;
        document.getElementById('bestStreak').textContent = bestStreak;
        document.getElementById('activeGoals').textContent = activeGoals;
    }

    // Filter functionality
    setFilter(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Apply filter logic based on current section
        if (this.currentSection === 'tasks') {
            this.filterTasks(filter);
        }
    }

    filterTasks(filter) {
        const taskItems = document.querySelectorAll('.task-item');
        
        taskItems.forEach(item => {
            const taskId = parseInt(item.dataset.id);
            const task = this.tasks.find(t => t.id === taskId);
            let show = true;

            switch (filter) {
                case 'pending':
                    show = !task.completed;
                    break;
                case 'completed':
                    show = task.completed;
                    break;
                case 'high':
                    show = task.priority === 'high';
                    break;
                case 'all':
                default:
                    show = true;
            }

            item.style.display = show ? 'block' : 'none';
        });
    }

    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    // Socket Events
    setupSocketEvents() {
        this.socket.on('goal_completed', (data) => {
            this.showNotification(`${data.user} completed a goal!`, 'success');
            this.loadGoals();
        });

        this.socket.on('workbench_update', (data) => {
            this.showNotification(`Workbench updated: ${data.message}`, 'info');
            this.loadWorkbenches();
        });
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Theme Management
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Global functions for HTML onclick events
function showAddTaskModal() {
    app.showModal('addTaskModal');
}

function showAddGoalModal() {
    app.showModal('addGoalModal');
}

function showCreateWorkbenchModal() {
    app.showModal('createWorkbenchModal');
}

function showJoinWorkbenchModal() {
    app.showModal('joinWorkbenchModal');
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function toggleTheme() {
    app.toggleTheme();
}

// Initialize app
const app = new StreakifyApp();

// Load theme on startup
app.loadTheme();

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-btn');
    
    if (!userBtn.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Add empty state styles
const emptyStateStyles = `
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .empty-state i {
        font-size: 4rem;
        margin-bottom: 20px;
        color: var(--accent);
        opacity: 0.5;
    }
    
    .empty-state h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .empty-state p {
        font-size: 1rem;
        line-height: 1.5;
    }
`;

const style = document.createElement('style');
style.textContent = emptyStateStyles;
document.head.appendChild(style);