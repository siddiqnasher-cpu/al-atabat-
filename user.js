// Ensure user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(sessionStorage.getItem('al_atbat_user'));
    
    if (!session) {
        // Not logged in, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // Populate user info
    document.getElementById('logged-user-name').textContent = `مرحباً، ${session.name}`;
    document.getElementById('sidebar-user-name').textContent = session.name;
    document.getElementById('sidebar-user-email').textContent = session.email;
    document.getElementById('welcome-name').textContent = session.name;

    // Settings form
    document.getElementById('set-name').value = session.name;
    document.getElementById('set-email').value = session.email;

    // Navigation setup
    setupNavigation();
    
    // Forms setup
    setupSettingsForm(session);
    setupMessaging(session);
    
    // Logout
    document.getElementById('logout-main-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('al_atbat_user');
        window.location.href = 'index.html';
    });
});

// ... [Navigation code restored] ...
function setupNavigation() {
    const navLinks = document.querySelectorAll('.user-nav a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            document.querySelectorAll('.user-page').forEach(p => p.classList.add('hidden'));
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.classList.remove('hidden');
            }
        });
    });
}

function setupSettingsForm(currentSession) {
    // ... [Settings code remains intact] ...
    document.getElementById('user-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newName = document.getElementById('set-name').value.trim();
        const newPass = document.getElementById('set-pass').value;
        const successMsg = document.getElementById('settings-success');

        // Update local storage DB
        const users = JSON.parse(localStorage.getItem('al_atbat_users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentSession.email);
        
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            if (newPass) {
                users[userIndex].password = newPass;
            }
            localStorage.setItem('al_atbat_users', JSON.stringify(users));
            
            // Update session
            currentSession.name = newName;
            if (newPass) currentSession.password = newPass;
            sessionStorage.setItem('al_atbat_user', JSON.stringify(currentSession));

            // Update UI instantly
            document.getElementById('logged-user-name').innerHTML = `<i class="fas fa-user-circle"></i> مرحباً، ${newName}`;
            document.getElementById('sidebar-user-name').textContent = newName;
            document.getElementById('welcome-name').textContent = newName;

            document.getElementById('set-pass').value = ''; 
            
            successMsg.style.display = 'block';
            setTimeout(() => successMsg.style.display = 'none', 3000);
        }
    });
}

function setupMessaging(session) {
    loadUserMessages(session);

    document.getElementById('user-msg-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('user-msg-text').value.trim();
        if (!text) return;

        const messages = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
        messages.unshift({
            id: Date.now(),
            name: session.name,
            email: session.email,
            phone: '',
            message: text,
            date: new Date().toLocaleString('ar-SA'),
            read: false,
            replies: []
        });
        localStorage.setItem('al_atbat_messages', JSON.stringify(messages));
        
        document.getElementById('user-msg-form').reset();
        loadUserMessages(session);
    });
}

function loadUserMessages(session) {
    const container = document.getElementById('user-messages-list');
    if (!container) return;
    
    const allMsgs = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
    const myMsgs = allMsgs.filter(m => m.email === session.email);
    
    container.innerHTML = '';
    
    if (myMsgs.length === 0) {
        container.innerHTML = `
            <div class="glass" style="padding:30px;display:flex;align-items:center;justify-content:center;">
                <div class="activity-empty">
                    <i class="fas fa-inbox" style="font-size:3rem;color:#ddd;margin-bottom:10px;"></i>
                    <p>لا توجد رسائل بينك وبين الإدارة حالياً.</p>
                </div>
            </div>`;
        return;
    }

    myMsgs.forEach(msg => {
        let repliesHtml = '';
        if (msg.replies && msg.replies.length > 0) {
            repliesHtml = '<div style="margin-top:15px;padding-top:15px;border-top:1px dashed #ccc;">';
            msg.replies.forEach(r => {
                repliesHtml += `
                    <div style="background:rgba(13,59,50,0.05);padding:15px;border-radius:10px;margin-bottom:10px;">
                        <strong style="color:var(--primary-color);font-size:0.95rem;">رد الإدارة:</strong>
                        <span style="float:left;font-size:0.8rem;color:#777;">${r.date}</span>
                        <p style="margin-top:8px;font-size:0.95rem;color:#444;">${r.text}</p>
                    </div>
                `;
            });
            repliesHtml += '</div>';
        }

        const card = document.createElement('div');
        card.className = 'glass';
        card.style.padding = '20px';
        card.style.marginBottom = '20px';
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <strong style="color:#555;">رسالتك:</strong>
                <span style="font-size:0.85rem;color:#888;">${msg.date}</span>
            </div>
            <p style="color:#333;line-height:1.6;">${msg.message}</p>
            ${repliesHtml}
        `;
        container.appendChild(card);
    });
}

