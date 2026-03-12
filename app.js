// 全局变量
let currentUser = null;
let currentBoard = null;
let leadsByBoard = JSON.parse(localStorage.getItem('leadsByBoard')) || {};
let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

// 权限配置
const permissions = {
    'ROW': ['ROW'],
    'Oceania': ['Oceania'],
    'EU': ['EU'],
    'HUGH': ['HUGH'],
    'fernando': ['fernando'],
    'alice': ['alice'],
    'nicklas': ['nicklas'],
    'latam': ['latam'],
    'end-users': []
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化登录表单
    initLoginForm();
    
    // 初始化退出登录按钮
    initLogoutButton();
    
    // 初始化导航
    initNavigation();
    
    // 初始化线索表单
    initLeadForm();
    
    // 初始化售后工单表单
    initTicketForm();
    
    // 初始化线索板块选择
    initLeadBoards();
    
    // 初始化返回看板按钮
    initBackToDashboard();
    
    // 检查是否已登录
    checkLoginStatus();
});

// 检查登录状态
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
    }
}

// 初始化登录表单
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 简单验证，实际项目中应该使用更安全的验证方式
        if (username && password === '123456') {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            showMainApp();
        } else {
            alert('用户名或密码错误');
        }
    });
}

// 初始化退出登录按钮
function initLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            currentUser = null;
            currentBoard = null;
            localStorage.removeItem('currentUser');
            showLoginForm();
        });
    }
}

// 显示登录表单
function showLoginForm() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
}

// 显示主应用
function showMainApp() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    document.getElementById('current-user').textContent = `当前用户: ${currentUser}`;
    
    // 根据用户类型显示不同的导航选项
    const navLinks = document.querySelectorAll('.nav-link');
    if (currentUser === 'end-users') {
        // 售后账号只显示售后板块
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === 'leads') {
                link.style.display = 'none';
            } else {
                link.style.display = 'block';
            }
        });
        // 直接显示售后板块
        document.getElementById('leads').style.display = 'none';
        document.getElementById('after-sales').style.display = 'block';
        navLinks[1].classList.add('active');
    } else {
        // 销售账号只显示线索板块
        navLinks.forEach(link => {
            if (link.getAttribute('data-section') === 'after-sales') {
                link.style.display = 'none';
            } else {
                link.style.display = 'block';
            }
        });
        // 直接显示线索板块
        document.getElementById('after-sales').style.display = 'none';
        document.getElementById('leads').style.display = 'block';
        navLinks[0].classList.add('active');
    }
    
    // 渲染线索板块
    renderLeadBoards();
    
    // 渲染工单列表
    renderTickets();
}

// 初始化导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.style.display = 'none');
            
            // 添加活动状态
            this.classList.add('active');
            const targetSection = this.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            section.style.display = 'block';
            
            // 如果是线索模块，显示看板
            if (targetSection === 'leads') {
                document.querySelector('.leads-dashboard').style.display = 'block';
                document.getElementById('lead-management').style.display = 'none';
            }
        });
    });
}

// 初始化线索板块选择
function initLeadBoards() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const board = this.getAttribute('data-lead-board');
            
            // 检查权限
            if (permissions[currentUser].includes(board)) {
                currentBoard = board;
                showLeadManagement(board);
            } else {
                alert('您没有权限访问此板块');
            }
        });
    });
}

// 渲染线索板块
function renderLeadBoards() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        const board = card.getAttribute('data-lead-board');
        if (permissions[currentUser].includes(board)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 显示线索管理界面
function showLeadManagement(board) {
    document.querySelector('.leads-dashboard').style.display = 'none';
    document.getElementById('lead-management').style.display = 'block';
    document.getElementById('current-board-title').textContent = board;
    
    // 渲染当前板块的线索
    renderLeads();
}

// 初始化返回看板按钮
function initBackToDashboard() {
    const backBtn = document.getElementById('back-to-dashboard');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            document.querySelector('.leads-dashboard').style.display = 'block';
            document.getElementById('lead-management').style.display = 'none';
            currentBoard = null;
        });
    }
}

// 初始化线索表单
function initLeadForm() {
    const leadForm = document.getElementById('lead-form');
    
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentBoard) {
            alert('请先选择线索板块');
            return;
        }
        
        const lead = {
            id: Date.now(),
            name: document.getElementById('lead-name').value,
            phone: document.getElementById('lead-phone').value,
            email: document.getElementById('lead-email').value,
            source: document.getElementById('lead-source').value,
            status: document.getElementById('lead-status').value,
            createdAt: new Date().toISOString()
        };
        
        // 确保当前板块的线索数组存在
        if (!leadsByBoard[currentBoard]) {
            leadsByBoard[currentBoard] = [];
        }
        
        leadsByBoard[currentBoard].push(lead);
        saveLeads();
        renderLeads();
        leadForm.reset();
    });
}

// 初始化售后工单表单
function initTicketForm() {
    const ticketForm = document.getElementById('ticket-form');
    
    ticketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ticket = {
            id: Date.now(),
            customer: document.getElementById('ticket-customer').value,
            contact: document.getElementById('ticket-contact').value,
            type: document.getElementById('ticket-type').value,
            description: document.getElementById('ticket-description').value,
            priority: document.getElementById('ticket-priority').value,
            status: 'open',
            createdAt: new Date().toISOString()
        };
        
        tickets.push(ticket);
        saveTickets();
        renderTickets();
        ticketForm.reset();
    });
}

// 保存线索数据到localStorage
function saveLeads() {
    localStorage.setItem('leadsByBoard', JSON.stringify(leadsByBoard));
}

// 保存工单数据到localStorage
function saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

// 渲染线索列表
function renderLeads() {
    const tbody = document.querySelector('#leads-table tbody');
    tbody.innerHTML = '';
    
    if (!currentBoard) return;
    
    const boardLeads = leadsByBoard[currentBoard] || [];
    
    boardLeads.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lead.name}</td>
            <td>${lead.phone}</td>
            <td>${lead.email}</td>
            <td>${lead.source}</td>
            <td><span class="status ${lead.status}">${getStatusText(lead.status)}</span></td>
            <td>${formatDate(lead.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editLead(${lead.id})" class="btn">编辑</button>
                    <button onclick="deleteLead(${lead.id})" class="btn btn-danger">删除</button>
                    <button onclick="updateLeadStatus(${lead.id}, 'contacted')" class="btn">已联系</button>
                    <button onclick="updateLeadStatus(${lead.id}, 'qualified')" class="btn">已 qualify</button>
                    <button onclick="updateLeadStatus(${lead.id}, 'closed')" class="btn btn-danger">关闭</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 渲染工单列表
function renderTickets() {
    const tbody = document.querySelector('#tickets-table tbody');
    tbody.innerHTML = '';
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.customer}</td>
            <td>${ticket.contact}</td>
            <td>${ticket.type}</td>
            <td><span class="priority ${ticket.priority}">${getPriorityText(ticket.priority)}</span></td>
            <td><span class="status ${ticket.status}">${getStatusText(ticket.status)}</span></td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editTicket(${ticket.id})" class="btn">编辑</button>
                    <button onclick="deleteTicket(${ticket.id})" class="btn btn-danger">删除</button>
                    <button onclick="updateTicketStatus(${ticket.id}, 'in-progress')" class="btn">处理中</button>
                    <button onclick="updateTicketStatus(${ticket.id}, 'resolved')" class="btn">已解决</button>
                    <button onclick="updateTicketStatus(${ticket.id}, 'closed')" class="btn btn-danger">关闭</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'new': '新线索',
        'contacted': '已联系',
        'qualified': '已 qualify',
        'closed': '已关闭',
        'open': '待处理',
        'in-progress': '处理中',
        'resolved': '已解决'
    };
    return statusMap[status] || status;
}

// 获取优先级文本
function getPriorityText(priority) {
    const priorityMap = {
        'low': '低',
        'medium': '中',
        'high': '高'
    };
    return priorityMap[priority] || priority;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 编辑线索
function editLead(id) {
    if (!currentBoard) return;
    
    const boardLeads = leadsByBoard[currentBoard] || [];
    const lead = boardLeads.find(l => l.id === id);
    
    if (lead) {
        document.getElementById('lead-name').value = lead.name;
        document.getElementById('lead-phone').value = lead.phone;
        document.getElementById('lead-email').value = lead.email;
        document.getElementById('lead-source').value = lead.source;
        document.getElementById('lead-status').value = lead.status;
        
        // 移除原线索
        leadsByBoard[currentBoard] = boardLeads.filter(l => l.id !== id);
        saveLeads();
        renderLeads();
    }
}

// 删除线索
function deleteLead(id) {
    if (!currentBoard) return;
    
    if (confirm('确定要删除这条线索吗？')) {
        const boardLeads = leadsByBoard[currentBoard] || [];
        leadsByBoard[currentBoard] = boardLeads.filter(l => l.id !== id);
        saveLeads();
        renderLeads();
    }
}

// 更新线索状态
function updateLeadStatus(id, status) {
    if (!currentBoard) return;
    
    const boardLeads = leadsByBoard[currentBoard] || [];
    const lead = boardLeads.find(l => l.id === id);
    
    if (lead) {
        lead.status = status;
        saveLeads();
        renderLeads();
    }
}

// 编辑工单
function editTicket(id) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
        document.getElementById('ticket-customer').value = ticket.customer;
        document.getElementById('ticket-contact').value = ticket.contact;
        document.getElementById('ticket-type').value = ticket.type;
        document.getElementById('ticket-description').value = ticket.description;
        document.getElementById('ticket-priority').value = ticket.priority;
        
        // 移除原工单
        tickets = tickets.filter(t => t.id !== id);
        saveTickets();
        renderTickets();
    }
}

// 删除工单
function deleteTicket(id) {
    if (confirm('确定要删除这个工单吗？')) {
        tickets = tickets.filter(t => t.id !== id);
        saveTickets();
        renderTickets();
    }
}

// 更新工单状态
function updateTicketStatus(id, status) {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
        ticket.status = status;
        saveTickets();
        renderTickets();
    }
}