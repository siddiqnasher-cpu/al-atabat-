// Simple Login Simulation
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if ((user === 'admin' || user === 'siddiqnasher@gmail.com') && pass === '774246114Aa') {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
  } else {
    alert('بيانات الدخول غير صحيحة');
  }
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');
});

// Navigation Logic
const navLinks = document.querySelectorAll('.sidebar-nav a[data-page]');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.dataset.page;

    // Update active link
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Show page
    document.querySelectorAll('.admin-page').forEach(p => p.classList.add('hidden'));
    document.getElementById(`${pageId}-page`).classList.remove('hidden');

    // Update title
    const titles = {
      'home': 'نظرة عامة',
      'users': 'الأعضاء الجدد',
      'projects': 'إدارة المشاريع',
      'news': 'إدارة الأخبار',
      'messages': 'رسائل التواصل'
    };
    document.getElementById('page-title').textContent = titles[pageId] || pageId;
  });
});

// Admin Project Management logic
let adminProjects = JSON.parse(localStorage.getItem('al_atbat_projects')) || [];

function saveProjects() {
  localStorage.setItem('al_atbat_projects', JSON.stringify(adminProjects));
  loadAdminProjects();
}

function loadAdminProjects() {
  const list = document.getElementById('admin-projects-list');
  if (!list) return;

  list.innerHTML = '';
  adminProjects.forEach((p, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${p.title}</td>
            <td><span class="badge ${p.progress >= 100 ? 'success' : 'info'}">${p.progress >= 100 ? 'مكتمل' : 'نشط'}</span></td>
            <td>${p.progress}%</td>
            <td>
                <button class="btn-sm" onclick="editProject(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn-sm text-danger" onclick="deleteProject(${index})"><i class="fas fa-trash"></i></button>
            </td>
        `;
    list.appendChild(row);
  });
}

const modal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');

document.getElementById('add-project-btn')?.addEventListener('click', () => {
  projectForm.reset();
  document.getElementById('project-id').value = '';
  document.getElementById('modal-title').textContent = 'مشروع جديد';
  modal.classList.remove('hidden');
});

document.getElementById('close-modal')?.addEventListener('click', () => {
  modal.classList.add('hidden');
});

projectForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const newProj = {
    id: id || Date.now(),
    title: document.getElementById('proj-title').value,
    description: document.getElementById('proj-desc').value,
    image: document.getElementById('proj-image').value,
    progress: parseInt(document.getElementById('proj-progress').value)
  };

  if (id) {
    const index = adminProjects.findIndex(p => p.id == id);
    adminProjects[index] = newProj;
  } else {
    adminProjects.push(newProj);
  }

  saveProjects();
  modal.classList.add('hidden');
});

window.deleteProject = (index) => {
  if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
    adminProjects.splice(index, 1);
    saveProjects();
  }
};

window.editProject = (index) => {
  const p = adminProjects[index];
  document.getElementById('project-id').value = p.id;
  document.getElementById('proj-title').value = p.title;
  document.getElementById('proj-desc').value = p.description;
  document.getElementById('proj-image').value = p.image;
  document.getElementById('proj-progress').value = p.progress;
  document.getElementById('modal-title').textContent = 'تعديل مشروع';
  modal.classList.remove('hidden');
};

loadAdminProjects();

// ===== News Management =====
let adminNews = JSON.parse(localStorage.getItem('al_atbat_news') || '[]');

function saveNews() {
  localStorage.setItem('al_atbat_news', JSON.stringify(adminNews));
  loadAdminNews();
}

function loadAdminNews() {
  const container = document.getElementById('admin-news-list');
  if (!container) return;
  container.innerHTML = '';
  if (adminNews.length === 0) {
    container.innerHTML = '<p style="color:#aaa;padding:30px;">لا توجد أخبار مضافة بعد.</p>';
    return;
  }
  adminNews.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'news-admin-card glass';
    card.innerHTML = `
            <div class="news-admin-card-body">
                <p class="news-admin-date">${item.date}</p>
                <h4>${item.title}</h4>
                <p>${item.summary}</p>
            </div>
            <div class="news-admin-actions">
                <button class="btn-sm" onclick="editNews(${index})"><i class="fas fa-edit"></i> تعديل</button>
                <button class="btn-sm text-danger" onclick="deleteNews(${index})"><i class="fas fa-trash"></i> حذف</button>
            </div>
        `;
    container.appendChild(card);
  });
}

const newsModal = document.getElementById('news-modal');
const newsForm = document.getElementById('news-form');

document.getElementById('add-news-btn')?.addEventListener('click', () => {
  newsForm.reset();
  document.getElementById('news-id').value = '';
  document.getElementById('news-modal-title').textContent = 'خبر جديد';
  document.getElementById('news-date').value = new Date().toISOString().split('T')[0];
  newsModal.classList.remove('hidden');
});

document.getElementById('close-news-modal')?.addEventListener('click', () => {
  newsModal.classList.add('hidden');
});

newsForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('news-id').value;
  const item = {
    id: id || Date.now(),
    title: document.getElementById('news-title').value,
    summary: document.getElementById('news-summary').value,
    image: document.getElementById('news-image').value,
    date: document.getElementById('news-date').value
  };
  if (id) {
    const idx = adminNews.findIndex(n => n.id == id);
    adminNews[idx] = item;
  } else {
    adminNews.unshift(item);
  }
  saveNews();
  newsModal.classList.add('hidden');
});

window.deleteNews = (index) => {
  if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
    adminNews.splice(index, 1);
    saveNews();
  }
};

window.editNews = (index) => {
  const n = adminNews[index];
  document.getElementById('news-id').value = n.id;
  document.getElementById('news-title').value = n.title;
  document.getElementById('news-summary').value = n.summary;
  document.getElementById('news-image').value = n.image || '';
  document.getElementById('news-date').value = n.date;
  document.getElementById('news-modal-title').textContent = 'تعديل خبر';
  newsModal.classList.remove('hidden');
};

loadAdminNews();

// ===== Messages =====
function loadAdminMessages() {
  const container = document.getElementById('admin-messages-list');
  if (!container) return;
  const messages = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
  container.innerHTML = '';
  if (messages.length === 0) {
    container.innerHTML = '<p style="color:#aaa;padding:30px;text-align:center;"><i class="fas fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>لا توجد رسائل بعد.</p>';
    return;
  }
  messages.forEach((msg, index) => {
    let repliesHtml = '';
    if (msg.replies && msg.replies.length > 0) {
      repliesHtml = '<div style="margin-top:15px;padding-top:15px;border-top:1px solid #ebebeb;">';
      msg.replies.forEach(r => {
        repliesHtml += `
                    <div style="background:#e8f5e9;padding:12px;border-radius:8px;margin-bottom:10px;">
                        <span style="font-size:0.8rem;color:#2e7d32;float:left;">${r.date}</span>
                        <strong style="color:#1b5e20;font-size:0.9rem;">رد الإدارة:</strong>
                        <p style="margin-top:5px;font-size:0.9rem;color:#333;">${r.text}</p>
                    </div>
                `;
      });
      repliesHtml += '</div>';
    }

    const card = document.createElement('div');
    card.className = 'message-card glass';
    card.style.marginBottom = '15px';
    card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
                <div>
                    <strong style="color:var(--primary-color);font-size:1.05rem;">${msg.name}</strong>
                    ${msg.phone ? `<span style="margin-right:15px;color:#777;font-size:0.85rem;"><i class="fas fa-phone"></i> ${msg.phone}</span>` : ''}
                    ${msg.email ? `<span style="color:#777;font-size:0.85rem;"><i class="fas fa-envelope"></i> ${msg.email}</span>` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="color:#aaa;font-size:0.8rem;">${msg.date}</span>
                    <button class="btn-sm" style="background:#e3f2fd;color:#1976d2;" onclick="openReplyModal(${index})" title="رد"><i class="fas fa-reply"></i> رد</button>
                    <button class="btn-sm text-danger" onclick="deleteMessage(${index})" title="حذف"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <p style="margin-top:15px;padding:15px;background:#f9f9f9;border-radius:10px;line-height:1.7;color:#444;">${msg.message}</p>
            ${repliesHtml}
        `;
    container.appendChild(card);
  });
  // Update stats badge
  updateMsgCount(messages.length);
}

function updateMsgCount(count) {
  const link = document.querySelector('.sidebar-nav a[data-page="messages"]');
  if (link && count > 0) {
    link.innerHTML = `<i class="fas fa-envelope"></i> رسائل التواصل <span style="background:#e53935;color:white;border-radius:50%;padding:2px 7px;font-size:0.75rem;margin-right:5px;">${count}</span>`;
  }
}

window.deleteMessage = (index) => {
  if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
    const messages = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
    messages.splice(index, 1);
    localStorage.setItem('al_atbat_messages', JSON.stringify(messages));
    loadAdminMessages();
  }
};

// Reply Logic
const replyModal = document.getElementById('reply-modal');
window.openReplyModal = (index) => {
  const messages = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
  const msg = messages[index];
  document.getElementById('reply-msg-id').value = index;
  document.getElementById('reply-msg-context').textContent = `الرسالة الأصلية: "${msg.message.substring(0, 100)}${msg.message.length > 100 ? '...' : ''}"`;
  document.getElementById('reply-text').value = '';
  replyModal.classList.remove('hidden');
};

document.getElementById('close-reply-modal')?.addEventListener('click', () => {
  replyModal.classList.add('hidden');
});

document.getElementById('reply-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const idx = document.getElementById('reply-msg-id').value;
  const text = document.getElementById('reply-text').value.trim();
  if (!text) return;

  const messages = JSON.parse(localStorage.getItem('al_atbat_messages') || '[]');
  const msg = messages[idx];
  if (!msg.replies) msg.replies = [];

  msg.replies.push({
    text: text,
    date: new Date().toLocaleString('ar-SA')
  });

  localStorage.setItem('al_atbat_messages', JSON.stringify(messages));
  replyModal.classList.add('hidden');
  loadAdminMessages();
});

loadAdminMessages();

// ===== Users Management =====
function loadAdminUsers() {
  const list = document.getElementById('admin-users-list');
  if (!list) return;

  const users = JSON.parse(localStorage.getItem('al_atbat_users') || '[]');
  list.innerHTML = '';

  if (users.length === 0) {
    list.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#777;padding:20px;">لا يوجد أعضاء مسجلين بعد</td></tr>';
    return;
  }

  users.forEach((user, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn-sm text-danger" onclick="deleteUser('${user.email}')" title="حذف العضو"><i class="fas fa-trash"></i></button>
            </td>
        `;
    list.appendChild(row);
  });
}

window.deleteUser = (email) => {
  if (confirm('هل أنت متأكد من حذف هذا العضو؟')) {
    let users = JSON.parse(localStorage.getItem('al_atbat_users') || '[]');
    users = users.filter(u => u.email !== email);
    localStorage.setItem('al_atbat_users', JSON.stringify(users));
    loadAdminUsers();
  }
};

loadAdminUsers();
