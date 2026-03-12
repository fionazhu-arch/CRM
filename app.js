// 全局变量
let leads = JSON.parse(localStorage.getItem('leads')) || [];
let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航
    initNavigation();
    
    // 初始化线索表单
    initLeadForm();
    
    // 初始化售后工单表单
    initTicketForm();
    
    // 渲染线索列表
    renderLeads();
    
    // 渲染工单列表
    renderTickets();
});

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
            document.getElementById(targetSection).style.display = 'block';
        });
    });
}

// 初始化线索表单
function initLeadForm() {
    const leadForm = document.getElementById('lead-form');
    
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const lead = {
            id: Date.now(),
            name: document.getElementById('lead-name').value,
            phone: document.getElementById('lead-phone').value,
            email: document.getElementById('lead-email').value,
            source: document.getElementById('lead-source').value,
            status: document.getElementById('lead-status').value,
            createdAt: new Date().toISOString()
        };
        
        leads.push(lead);
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
    localStorage.setItem('leads', JSON.stringify(leads));
}

// 保存工单数据到localStorage
function saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(tickets));
}

// 渲染线索列表
function renderLeads() {
    const tbody = document.querySelector('#leads-table tbody');
    tbody.innerHTML = '';
    
    leads.forEach(lead => {
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
    const lead = leads.find(l => l.id === id);
    if (lead) {
        document.getElementById('lead-name').value = lead.name;
        document.getElementById('lead-phone').value = lead.phone;
        document.getElementById('lead-email').value = lead.email;
        document.getElementById('lead-source').value = lead.source;
        document.getElementById('lead-status').value = lead.status;
        
        // 移除原线索
        leads = leads.filter(l => l.id !== id);
        saveLeads();
        renderLeads();
    }
}

// 删除线索
function deleteLead(id) {
    if (confirm('确定要删除这条线索吗？')) {
        leads = leads.filter(l => l.id !== id);
        saveLeads();
        renderLeads();
    }
}

// 更新线索状态
function updateLeadStatus(id, status) {
    const lead = leads.find(l => l.id === id);
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