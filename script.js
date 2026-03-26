// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mock Project Data (Default)
const defaultProjects = [
    {
        id: 1,
        title: "سقيا الماء للمناطق الجافة",
        description: "توفير مياه نظيفة صالحة للشرب لأكثر من 500 أسرة في المناطق المحتاجة.",
        image: "https://images.unsplash.com/photo-1541810271566-d7547ccf4404?auto=format&fit=crop&w=800&q=80",
        progress: 65
    },
    {
        id: 2,
        title: "كفالة يتيم وبناء مستقبل",
        description: "رعاية شاملة للأيتام تشمل التعليم والمأوى والرعاية الصحية.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
        progress: 40
    },
    {
        id: 3,
        title: "دعم مراكز تعليم القرآن",
        description: "تجهيز وتطوير مراكز تعليم القرآن الكريم في القرى البعيدة.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
        progress: 85
    }
];

function loadProjects() {
    const container = document.getElementById('project-container');
    if (!container) return;

    let projects = JSON.parse(localStorage.getItem('al_atbat_projects'));
    if (!projects || projects.length === 0) {
        projects = defaultProjects;
        localStorage.setItem('al_atbat_projects', JSON.stringify(defaultProjects));
    }

    container.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-img">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div style="margin-top: 15px; background: #eee; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="width: ${project.progress}%; background: var(--secondary-color); height: 100%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.9rem;">
                    <span>اكتمل ${project.progress}%</span>
                    <a href="#donate" style="color: var(--primary-color); font-weight: bold;">ساهم الآن</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Donation Button Logic
const amountBtns = document.querySelectorAll('.amount-btn');
amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('custom-amount').value = btn.dataset.amount;
    });
});

document.getElementById('donation-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('custom-amount').value;
    if (!amount) {
        alert('يرجى اختيار أو إدخال مبلغ التبرع');
        return;
    }
    alert(`شكراً لمبادرتك! سيتم تحويلك لبوابة الدفع للتبرع بمبلغ ${amount} ر.س`);
});

// Contact Form Submission
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg = document.getElementById('contact-msg').value.trim();

    const messages = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
    messages.unshift({
        id: Date.now(),
        name,
        phone,
        email,
        message: msg,
        date: new Date().toLocaleString('ar-SA'),
        read: false
    });
    localStorage.setItem('al_atbat_messages', JSON.stringify(messages));

    // Show success and reset
    document.getElementById('contact-form').reset();
    const success = document.getElementById('contact-success');
    success.style.display = 'block';
    setTimeout(() => success.style.display = 'none', 5000);
});

// Load News on Homepage
function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    const news = JSON.parse(localStorage.getItem('al_atbat_news') || '[]');
    container.innerHTML = '';
    if (news.length === 0) {
        container.innerHTML = '<div class="news-empty"><i class="fas fa-newspaper" style="font-size:3rem;margin-bottom:15px;"></i><p>لا توجد أخبار متاحة حالياً.</p></div>';
        return;
    }
    news.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        const dateStr = item.date ? new Date(item.date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
        const imgHtml = item.image
            ? `<img src="${item.image}" alt="${item.title}" class="news-card-img" onerror="this.style.display='none'">`
            : `<div style="height:180px;background:linear-gradient(135deg,var(--primary-color),var(--accent-color));display:flex;align-items:center;justify-content:center;"><i class="fas fa-newspaper" style="font-size:3rem;color:rgba(255,255,255,0.4);"></i></div>`;
        card.innerHTML = `
            ${imgHtml}
            <div class="news-card-body">
                <p class="news-date">${dateStr}</p>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadNews();
    initAuth();
});

// ===== Auth Logic =====
function initAuth() {
    const session = JSON.parse(sessionStorage.getItem('al_atbat_user'));
    if (session) updateNavForUser(session);

    // Open modal
    document.getElementById('open-login-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('auth-modal').style.display = 'flex';
    });

    // Close modal
    document.getElementById('auth-modal-close')?.addEventListener('click', () => {
        document.getElementById('auth-modal').style.display = 'none';
    });

    // Click outside to close
    document.getElementById('auth-modal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('auth-modal')) {
            document.getElementById('auth-modal').style.display = 'none';
        }
    });

    // Tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById('login-main-form').style.display = target === 'login' ? 'block' : 'none';
            document.getElementById('register-form').style.display = target === 'register' ? 'block' : 'none';
        });
    });

    // Login submit
    document.getElementById('login-main-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value;
        const errEl = document.getElementById('login-error');

        // Check admin
        if (email === 'siddiqnasher@gmail.com' && pass === '774246114Aa') {
            window.location.href = 'admin.html';
            return;
        }

        // Check registered users
        const users = JSON.parse(localStorage.getItem('al_atbat_users') || '[]');
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            sessionStorage.setItem('al_atbat_user', JSON.stringify(user));
            window.location.href = 'user_dashboard.html';
        } else {
            errEl.style.display = 'block';
        }
    });

    // Register submit
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        const errEl = document.getElementById('reg-error');

        const users = JSON.parse(localStorage.getItem('al_atbat_users') || '[]');
        if (users.find(u => u.email === email)) {
            errEl.textContent = 'هذا البريد الإلكتروني مسجل مسبقاً.';
            errEl.style.display = 'block';
            return;
        }

        const newUser = { name, email, password: pass };
        users.push(newUser);
        localStorage.setItem('al_atbat_users', JSON.stringify(users));
        sessionStorage.setItem('al_atbat_user', JSON.stringify(newUser));
        
        window.location.href = 'user_dashboard.html';
    });

    // Logout
    document.getElementById('logout-main-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('al_atbat_user');
        document.getElementById('nav-auth-btn').style.display = '';
        document.getElementById('nav-user-info').style.display = 'none';
    });
}

function updateNavForUser(user) {
    document.getElementById('nav-auth-btn').style.display = 'none';
    document.getElementById('nav-user-info').style.display = 'flex';
    document.getElementById('logged-user-name').innerHTML = `<a href="user_dashboard.html" title="حسابي" style="color:var(--secondary-color);text-decoration:none;"><i class="fas fa-user-circle"></i> مرحباً، ${user.name}</a>`;
}
