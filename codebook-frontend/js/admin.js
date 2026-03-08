// ========================================
// CODEBOOK ADMIN - JAVASCRIPT
// ========================================

// API Base URL (use relative path when served from same server)
const API_BASE_URL = '/api';

// Auth token
let authToken = localStorage.getItem('adminToken');
let adminData = JSON.parse(localStorage.getItem('adminData') || 'null');

// Helper function to get auth headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
}

// Helper function for authenticated fetch
async function authFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    });

    // Handle token expiration
    if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
    }

    return response;
}

// Check login on page load
document.addEventListener('DOMContentLoaded', () => {
    if (authToken && adminData) {
        showAdminPanel(adminData);
    } else {
        showLoginForm();
    }
});

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and admin data
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminData', JSON.stringify(data));
                authToken = data.token;
                adminData = data;

                showAdminPanel(data);
            } else {
                errorDiv.textContent = data.message || 'Login xatosi';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            errorDiv.textContent = 'Server bilan bog\'lanish xatosi';
            errorDiv.style.display = 'block';
        }
    });
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    authToken = null;
    adminData = null;
    showLoginForm();
}

// Show login form
function showLoginForm() {
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('admin-wrapper').style.display = 'none';
}

// Show admin panel
function showAdminPanel(data) {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('admin-wrapper').style.display = 'flex';

    // Update admin name
    const adminName = document.querySelector('#dashboard .section-header p');
    if (adminName) {
        adminName.textContent = `Xush kelibsiz, ${data.name}!`;
    }

    // Load data
    loadDashboard();
}

// Current editing item
let currentEditId = null;
let currentSection = '';

// Form configurations
const formConfigs = {
    portfolio: [
        { name: 'title', label: 'Sarlavha', type: 'text', required: true },
        { name: 'description', label: 'Tavsif', type: 'textarea', required: true },
        { name: 'image', label: 'Rasm URL', type: 'url', required: true },
        { name: 'category', label: 'Kategoriya', type: 'select', options: ['web', 'mobile', 'design', 'other'], required: true },
        { name: 'client', label: 'Mijoz', type: 'text' },
        { name: 'liveUrl', label: 'Live URL', type: 'url' },
        { name: 'technologies', label: 'Texnologiyalar (vergul bilan)', type: 'text' },
        { name: 'featured', label: 'Featured', type: 'checkbox' }
    ],
    services: [
        { name: 'title', label: 'Sarlavha', type: 'text', required: true },
        { name: 'description', label: 'Tavsif', type: 'textarea', required: true },
        { name: 'icon', label: 'Icon (font-awesome)', type: 'text', placeholder: 'masalan: code, mobile-alt' },
        { name: 'order', label: 'Tartib raqami', type: 'number' },
        { name: 'featured', label: 'Featured', type: 'checkbox' }
    ],
    team: [
        { name: 'name', label: 'Ism', type: 'text', required: true },
        { name: 'position', label: 'Lavozim', type: 'text', required: true },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'image', label: 'Rasm URL', type: 'url' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Telefon', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn', type: 'url' },
        { name: 'github', label: 'GitHub', type: 'url' },
        { name: 'twitter', label: 'Twitter', type: 'url' },
        { name: 'order', label: 'Tartib raqami', type: 'number' }
    ]
};

// ========================================
// NAVIGATION
// ========================================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        showSection(section);
    });
});

function showSection(sectionId) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    // Load data for section
    currentSection = sectionId;
    switch (sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'portfolio':
            loadPortfolio();
            break;
        case 'services':
            loadServices();
            break;
        case 'team':
            loadTeam();
            break;
    }
}

// ========================================
// DASHBOARD
// ========================================
async function loadDashboard() {
    try {
        const [contactsRes, portfolioRes, servicesRes] = await Promise.all([
            authFetch(`${API_BASE_URL}/contact`),
            authFetch(`${API_BASE_URL}/portfolio`),
            authFetch(`${API_BASE_URL}/services`)
        ]);

        const contacts = contactsRes.ok ? await contactsRes.json() : [];
        const portfolio = portfolioRes.ok ? await portfolioRes.json() : [];
        const services = servicesRes.ok ? await servicesRes.json() : [];

        document.getElementById('total-messages').textContent = contacts.length;
        document.getElementById('unread-messages').textContent = contacts.filter(c => !c.isRead).length;
        document.getElementById('total-projects').textContent = portfolio.length;
        document.getElementById('total-services').textContent = services.length;
        document.getElementById('unread-count').textContent = contacts.filter(c => !c.isRead).length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ========================================
// CONTACTS
// ========================================
async function loadContacts() {
    try {
        const response = await authFetch(`${API_BASE_URL}/contact`);
        const contacts = response.ok ? await response.json() : [];

        const tbody = document.getElementById('contacts-table-body');

        if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="loading">Xabarlar yo‘q</td></tr>';
            return;
        }

        tbody.innerHTML = contacts.map((contact, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone || '-'}</td>
                <td>${contact.subject || '-'}</td>
                <td>${contact.message.substring(0, 50)}...</td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${contact.isRead ? 'read' : 'unread'}">
                        ${contact.isRead ? 'O\'qilgan' : 'O\'qilmagan'}
                    </span>
                </td>
                <td>
                    <div class="action-btns">
                        ${!contact.isRead ? `<button class="edit-btn" onclick="markAsRead('${contact._id}')" title="O'qilgan deb belgilash"><i class="fas fa-check"></i></button>` : ''}
                        <button class="delete-btn" onclick="deleteItem('contact', '${contact._id}')" title="O'chirish"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function markAsRead(id) {
    try {
        const response = await authFetch(`${API_BASE_URL}/contact/${id}/read`, {
            method: 'PUT'
        });

        if (response.ok) {
            loadContacts();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

async function refreshContacts() {
    loadContacts();
    loadDashboard();
}

// ========================================
// PORTFOLIO
// ========================================
async function loadPortfolio() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio`);
        const portfolio = response.ok ? await response.json() : [];

        const container = document.getElementById('portfolio-cards');

        if (portfolio.length === 0) {
            container.innerHTML = '<div class="loading">Loyihalar yo\'q. Yangi loyiha qo\'shing!</div>';
            return;
        }

        container.innerHTML = portfolio.map(item => `
            <div class="card">
                <div class="card-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.description.substring(0, 80)}...</p>
                    <div class="card-footer">
                        <span class="card-category">${item.category}</span>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editItem('portfolio', '${item._id}')"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" onclick="deleteItem('portfolio', '${item._id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
}

// ========================================
// SERVICES
// ========================================
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const services = response.ok ? await response.json() : [];

        const container = document.getElementById('services-cards');

        if (services.length === 0) {
            container.innerHTML = '<div class="loading">Xizmatlar yo\'q. Yangi xizmat qo\'shing!</div>';
            return;
        }

        container.innerHTML = services.map(item => `
            <div class="card">
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <p>${item.description.substring(0, 100)}...</p>
                    <div class="card-footer">
                        <span class="card-category">Order: ${item.order || 0}</span>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editItem('services', '${item._id}')"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" onclick="deleteItem('services', '${item._id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

// ========================================
// TEAM
// ========================================
async function loadTeam() {
    try {
        const response = await fetch(`${API_BASE_URL}/team`);
        const team = response.ok ? await response.json() : [];

        const container = document.getElementById('team-cards');

        if (team.length === 0) {
            container.innerHTML = '<div class="loading">Jamoa a\'zolari yo\'q. Yangi a\'zo qo\'shing!</div>';
            return;
        }

        container.innerHTML = team.map(item => `
            <div class="card">
                <div class="card-image">
                    <img src="${item.image || 'https://via.placeholder.com/300'}" alt="${item.name}">
                </div>
                <div class="card-body">
                    <h3>${item.name}</h3>
                    <p>${item.position}</p>
                    <div class="card-footer">
                        <span class="card-category">${item.email || ''}</span>
                        <div class="action-btns">
                            <button class="edit-btn" onclick="editItem('team', '${item._id}')"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" onclick="deleteItem('team', '${item._id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading team:', error);
    }
}

// ========================================
// MODAL
// ========================================
function openModal(section, item = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const formFields = document.getElementById('form-fields');

    currentEditId = item ? item._id : null;
    modalTitle.textContent = item ? `${section.charAt(0).toUpperCase() + section.slice(1)}ni tahrirlash` : `Yangi ${section}`;

    // Generate form fields
    const fields = formConfigs[section];
    formFields.innerHTML = fields.map(field => {
        let input = '';
        const value = item ? item[field.name] : '';

        if (field.type === 'select') {
            input = `<select name="${field.name}" ${field.required ? 'required' : ''}>
                <option value="">Tanlang</option>
                ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>`;
        } else if (field.type === 'textarea') {
            input = `<textarea name="${field.name}" ${field.required ? 'required' : ''}>${value}</textarea>`;
        } else if (field.type === 'checkbox') {
            input = `<input type="checkbox" name="${field.name}" ${value ? 'checked' : ''}>`;
        } else if (field.type === 'number') {
            input = `<input type="number" name="${field.name}" value="${value || 0}" ${field.required ? 'required' : ''}>`;
        } else {
            input = `<input type="${field.type}" name="${field.name}" value="${value || ''}" ${field.placeholder ? `placeholder="${field.placeholder}"` : ''} ${field.required ? 'required' : ''}>`;
        }

        return `
            <div class="form-group ${field.type === 'checkbox' ? 'checkbox' : ''}">
                <label>${field.label}</label>
                ${input}
            </div>
        `;
    }).join('');

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    currentEditId = null;
}

// Close modal on outside click
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

// ========================================
// CRUD OPERATIONS
// ========================================
document.getElementById('modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Handle checkbox
    data.featured = formData.has('featured');

    // Handle technologies array
    if (data.technologies) {
        data.technologies = data.technologies.split(',').map(t => t.trim());
    }

    // Handle social links for team
    if (currentSection === 'team') {
        data.socialLinks = {
            linkedin: data.linkedin,
            github: data.github,
            twitter: data.twitter
        };
        delete data.linkedin;
        delete data.github;
        delete data.twitter;
    }

    // Convert numbers
    if (data.order) data.order = parseInt(data.order);

    const url = currentEditId
        ? `${API_BASE_URL}/${currentSection}/${currentEditId}`
        : `${API_BASE_URL}/${currentSection}`;

    const method = currentEditId ? 'PUT' : 'POST';

    try {
        const response = await authFetch(url, {
            method,
            body: JSON.stringify(data)
        });

        if (response.ok) {
            closeModal();
            // Reload current section
            switch (currentSection) {
                case 'portfolio':
                    loadPortfolio();
                    break;
                case 'services':
                    loadServices();
                    break;
                case 'team':
                    loadTeam();
                    break;
            }
            alert('Muvaffaqiyatli saqlandi!');
        } else {
            const error = await response.json();
            alert('Xatolik: ' + error.message);
        }
    } catch (error) {
        console.error('Error saving:', error);
        alert('Xatolik yuz berdi');
    }
});

async function editItem(section, id) {
    currentSection = section;
    try {
        const response = await fetch(`${API_BASE_URL}/${section}/${id}`);
        if (response.ok) {
            const item = await response.json();
            openModal(section, item);
        }
    } catch (error) {
        console.error('Error loading item:', error);
    }
}

async function deleteItem(section, id) {
    if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;

    try {
        const response = await authFetch(`${API_BASE_URL}/${section}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Reload current section
            switch (section) {
                case 'contact':
                    loadContacts();
                    loadDashboard();
                    break;
                case 'portfolio':
                    loadPortfolio();
                    break;
                case 'services':
                    loadServices();
                    break;
                case 'team':
                    loadTeam();
                    break;
            }
            alert('Muvaffaqiyatli o\'chirildi!');
        } else {
            alert('Xatolik yuz berdi');
        }
    } catch (error) {
        console.error('Error deleting:', error);
    }
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});
