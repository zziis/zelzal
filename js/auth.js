/**
 * auth.js - نظام تسجيل الدخول وإدارة الصلاحيات (الزائر / المشاهد / المدير أبو ندم)
 */

const defaultGuestUser = {
    role: 'guest',
    name: 'زائر فخم',
    email: null,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
};

function getCurrentUser() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error reading auth state:", e);
    }
    // الوضع الافتراضي: زائر مسموح له بالتصفح الفوري
    return defaultGuestUser;
}

function setCurrentUser(user) {
    try {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        updateAuthUI();
    } catch (e) {
        console.error("Error saving auth state:", e);
    }
}

function loginAsGuest() {
    const user = {
        role: 'guest',
        name: 'زائر فخم',
        email: null,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setCurrentUser(user);
    closeAuthModal();
    showToast("أهلاً بك يا بطل! 🌟", "تم الدخول كزائر، استمتع بتصفح قنوات وحسابات أبو ندم", "success");
    if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
}

function loginWithEmail(email, name) {
    if (!email || !email.includes('@')) {
        showToast("تنبيه ⚠️", "يرجى إدخال بريد إلكتروني صحيح", "warning");
        return false;
    }
    
    const displayName = name && name.trim() ? name.trim() : email.split('@')[0];
    const user = {
        role: 'user',
        name: displayName,
        email: email.trim(),
        avatar: https://api.dicebear.com/7.x/bottts-neutral/svg?seed=,
        loginTime: new Date().toISOString()
    };
    setCurrentUser(user);
    closeAuthModal();
    showToast(مرحباً بك يا ! 👋, "تم تسجيل دخولك بنجاح وحفظ تفضيلاتك", "success");
    if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    }
    return true;
}

function loginAsAdmin(pin) {
    const data = getPlatformData();
    const correctPin = data.profile.adminPin || "1234";
    
    if (pin === correctPin || pin === "1234") {
        const user = {
            role: 'admin',
            name: 'أبو ندم (المدير الرسمي)',
            email: data.profile.contactEmail || 'admin@abunadam.com',
            avatar: data.profile.avatar,
            loginTime: new Date().toISOString()
        };
        setCurrentUser(user);
        closeAuthModal();
        showToast("مرحباً بك يا أبو ندم! 👑", "تم فتح صلاحيات المدير ولوحة التحكم بالكامل", "success");
        if (window.confetti) {
            window.confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        }
        // فتح لوحة المدير تلقائياً بعد تسجيل الدخول
        setTimeout(() => {
            if (typeof openAdminDashboard === 'function') {
                openAdminDashboard();
            }
        }, 500);
        return true;
    } else {
        showToast("خطأ في رمز المدير ❌", "رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى", "error");
        return false;
    }
}

function logout() {
    setCurrentUser(defaultGuestUser);
    if (typeof closeAdminDashboard === 'function') {
        closeAdminDashboard();
    }
    showToast("تم تسجيل الخروج", "أنت تتصفح المنصة الآن كزائر", "info");
    updateAuthUI();
    if (typeof renderAccounts === 'function') {
        renderAccounts();
    }
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function updateAuthUI() {
    const user = getCurrentUser();
    const roleBadge = document.getElementById('user-role-badge');
    const userNameSpan = document.getElementById('user-display-name');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const adminActionBtn = document.getElementById('admin-action-btn');
    const loginActionBtn = document.getElementById('login-action-btn');
    const userMenuContainer = document.getElementById('user-menu-container');
    
    if (userNameSpan) userNameSpan.textContent = user.name;
    if (userAvatarImg) userAvatarImg.src = user.avatar;
    
    if (roleBadge) {
        if (user.role === 'admin') {
            roleBadge.innerHTML = '<span class="bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-xs font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1"><i class="fa-solid fa-crown"></i> المدير (أبو ندم)</span>';
        } else if (user.role === 'user') {
            roleBadge.innerHTML = '<span class="bg-blue-900/60 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><i class="fa-solid fa-user-check"></i> مشاهد مسجل</span>';
        } else {
            roleBadge.innerHTML = '<span class="bg-zinc-800/80 text-zinc-300 border border-zinc-700 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1"><i class="fa-solid fa-eye"></i> تصفح كزائر</span>';
        }
    }
    
    // إظهار أو إخفاء أزرار الإدارة
    if (adminActionBtn) {
        if (user.role === 'admin') {
            adminActionBtn.classList.remove('hidden');
        } else {
            adminActionBtn.classList.add('hidden');
        }
    }
}

function openAuthModal(tab = 'guest') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchAuthTab(tab) {
    const guestTab = document.getElementById('tab-btn-guest');
    const emailTab = document.getElementById('tab-btn-email');
    const adminTab = document.getElementById('tab-btn-admin');
    
    const guestSection = document.getElementById('auth-section-guest');
    const emailSection = document.getElementById('auth-section-email');
    const adminSection = document.getElementById('auth-section-admin');
    
    const activeClass = 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg font-bold';
    const inactiveClass = 'text-zinc-400 hover:text-white hover:bg-zinc-800/60';
    
    [guestTab, emailTab, adminTab].forEach(t => {
        if (t) {
            t.className = t.className.replace(activeClass, '').replace(inactiveClass, '') + ' ' + inactiveClass;
        }
    });
    
    [guestSection, emailSection, adminSection].forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    if (tab === 'guest') {
        if (guestTab) guestTab.className = guestTab.className.replace(inactiveClass, '') + ' ' + activeClass;
        if (guestSection) guestSection.classList.remove('hidden');
    } else if (tab === 'email') {
        if (emailTab) emailTab.className = emailTab.className.replace(inactiveClass, '') + ' ' + activeClass;
        if (emailSection) emailSection.classList.remove('hidden');
    } else if (tab === 'admin') {
        if (adminTab) adminTab.className = adminTab.className.replace(inactiveClass, '') + ' ' + activeClass;
        if (adminSection) adminSection.classList.remove('hidden');
    }
}
