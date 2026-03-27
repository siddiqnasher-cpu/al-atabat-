// =========================
// Main Site Logic with Firebase
// =========================

// ---------- عناصر عامة ----------
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('active');
  });
});

// ---------- المشاريع ----------
const projectContainer = document.getElementById('project-container');

async function loadProjects() {
  if (!projectContainer) return;

  try {
    projectContainer.innerHTML = '<p style="padding:20px;">جاري تحميل المشاريع...</p>';

    const q = window.fb.query(
      window.fb.collection(window.db, 'projects'),
      window.fb.orderBy('createdAt', 'desc')
    );

    const snapshot = await window.fb.getDocs(q);

    if (snapshot.empty) {
      projectContainer.innerHTML = '<p style="padding:20px;">لا توجد مشاريع حالياً.</p>';
      return;
    }

    projectContainer.innerHTML = '';

    snapshot.forEach((docSnap) => {
      const project = docSnap.data();

      const card = document.createElement('div');
      card.className = 'project-card glass';
      card.innerHTML = `
        <img src="${escapeHtml(project.image || 'https://via.placeholder.com/600x400?text=Project')}" alt="${escapeHtml(project.title || '')}" class="project-img">
        <div class="project-info">
          <h3>${escapeHtml(project.title || '')}</h3>
          <p>${escapeHtml(project.description || '')}</p>
          <div class="progress-bar">
            <div class="progress" style="width:${Number(project.progress || 0)}%"></div>
          </div>
          <span>${Number(project.progress || 0)}%</span>
        </div>
      `;
      projectContainer.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    projectContainer.innerHTML = '<p style="padding:20px;color:red;">تعذر تحميل المشاريع.</p>';
  }
}

// ---------- الأخبار ----------
const newsContainer = document.getElementById('news-container');

async function loadNews() {
  if (!newsContainer) return;

  try {
    newsContainer.innerHTML = '<p style="padding:20px;">جاري تحميل الأخبار...</p>';

    const q = window.fb.query(
      window.fb.collection(window.db, 'news'),
      window.fb.orderBy('date', 'desc')
    );

    const snapshot = await window.fb.getDocs(q);

    if (snapshot.empty) {
      newsContainer.innerHTML = '<p style="padding:20px;">لا توجد أخبار حالياً.</p>';
      return;
    }

    newsContainer.innerHTML = '';

    snapshot.forEach((docSnap) => {
      const news = docSnap.data();

      const card = document.createElement('div');
      card.className = 'news-card glass';
      card.innerHTML = `
        <img src="${escapeHtml(news.image || 'https://via.placeholder.com/600x400?text=News')}" alt="${escapeHtml(news.title || '')}" class="news-img">
        <div class="news-content">
          <span class="news-date">${escapeHtml(news.date || '')}</span>
          <h3>${escapeHtml(news.title || '')}</h3>
          <p>${escapeHtml(news.summary || '')}</p>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = '<p style="padding:20px;color:red;">تعذر تحميل الأخبار.</p>';
  }
}

// ---------- رسائل التواصل ----------
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-msg').value.trim();

  if (!name || !message) {
    alert('أدخل الاسم والرسالة');
    return;
  }

  try {
    await window.fb.addDoc(window.fb.collection(window.db, 'messages'), {
      name,
      phone,
      email,
      message,
      date: new Date().toLocaleDateString('ar-SA'),
      createdAt: window.fb.serverTimestamp(),
      replies: []
    });

    contactForm.reset();
    if (contactSuccess) {
      contactSuccess.style.display = 'block';
      setTimeout(() => {
        contactSuccess.style.display = 'none';
      }, 4000);
    }
  } catch (error) {
    console.error(error);
    alert('فشل إرسال الرسالة');
  }
});

// ---------- التبرعات ----------
const amountButtons = document.querySelectorAll('.amount-btn');
const customAmount = document.getElementById('custom-amount');
const donationForm = document.getElementById('donation-form');

amountButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    amountButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (customAmount) customAmount.value = btn.dataset.amount || '';
  });
});

donationForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = customAmount?.value?.trim() || '';
  if (!amount) {
    alert('اختر مبلغ التبرع أولاً');
    return;
  }
  alert(`تم اختيار مبلغ ${amount} ر.س. اربط بوابة الدفع لاحقًا لإكمال العملية.`);
});

// ---------- نافذة تسجيل الدخول ----------
const authModal = document.getElementById('auth-modal');
const authModalClose = document.getElementById('auth-modal-close');
const openLoginBtn = document.getElementById('open-login-btn');
const heroLoginBtn = document.getElementById('hero-login-btn');

const authTabs = document.querySelectorAll('.auth-tab');
const loginMainForm = document.getElementById('login-main-form');
const registerForm = document.getElementById('register-form');

const loginError = document.getElementById('login-error');
const regError = document.getElementById('reg-error');

function openAuthModal(defaultTab = 'login') {
  if (!authModal) return;
  authModal.style.display = 'flex';
  switchAuthTab(defaultTab);
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.style.display = 'none';
  if (loginError) loginError.style.display = 'none';
  if (regError) regError.style.display = 'none';
}

function switchAuthTab(tabName) {
  authTabs.forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.auth-tab[data-tab="${tabName}"]`)?.classList.add('active');

  if (tabName === 'login') {
    if (loginMainForm) loginMainForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
  } else {
    if (loginMainForm) loginMainForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
  }
}

openLoginBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openAuthModal('login');
});

heroLoginBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  openAuthModal('login');
});

authModalClose?.addEventListener('click', closeAuthModal);

authModal?.addEventListener('click', (e) => {
  if (e.target === authModal) closeAuthModal();
});

authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchAuthTab(tab.dataset.tab);
  });
});

// ---------- تسجيل الدخول ----------
loginMainForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value.trim();

  try {
    await window.fb.signInWithEmailAndPassword(window.auth, email, password);
    if (loginError) loginError.style.display = 'none';
    closeAuthModal();
  } catch (error) {
    console.error(error);
    if (loginError) loginError.style.display = 'block';
  }
});

// ---------- إنشاء حساب ----------
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-pass').value.trim();

  try {
    const cred = await window.fb.createUserWithEmailAndPassword(window.auth, email, password);

    if (name) {
      await window.fb.updateProfile(cred.user, {
        displayName: name
      });
    }

    if (regError) {
      regError.style.display = 'none';
      regError.textContent = '';
    }

    closeAuthModal();
  } catch (error) {
    console.error(error);
    if (regError) {
      regError.style.display = 'block';
      regError.textContent = 'فشل إنشاء الحساب: ' + error.message;
    }
  }
});

// ---------- حالة المستخدم ----------
const navAuthBtn = document.getElementById('nav-auth-btn');
const navUserInfo = document.getElementById('nav-user-info');
const loggedUserName = document.getElementById('logged-user-name');
const logoutMainBtn = document.getElementById('logout-main-btn');

window.fb.onAuthStateChanged(window.auth, (user) => {
  if (user) {
    if (navAuthBtn) navAuthBtn.style.display = 'none';
    if (navUserInfo) navUserInfo.style.display = 'list-item';
    if (loggedUserName) loggedUserName.textContent = user.displayName || user.email || 'مستخدم';
  } else {
    if (navAuthBtn) navAuthBtn.style.display = 'list-item';
    if (navUserInfo) navUserInfo.style.display = 'none';
    if (loggedUserName) loggedUserName.textContent = '';
  }
});

logoutMainBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    await window.fb.signOut(window.auth);
  } catch (error) {
    console.error(error);
  }
});

// ---------- تشغيل أولي ----------
loadProjects();
loadNews();

// ---------- مساعد ----------
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}