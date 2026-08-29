/**
 * admin.js - لوحة تحكم المدير الفخمة لمنصة أبو ندم
 */

let currentEditingAccountId = null;

function openAdminDashboard() {
    if (!isAdmin()) {
        openAuthModal('admin');
        return;
    }
    
    const modal = document.getElementById('admin-dashboard-modal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // تحميل البيانات الحالية
    loadProfileSettingsToForm();
    renderAdminAccountsList();
    renderAdminAnalytics();
    switchAdminTab('accounts');
}

function closeAdminDashboard() {
    const modal = document.getElementById('admin-dashboard-modal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function switchAdminTab(tabId) {
    const tabs = ['accounts', 'profile', 'analytics', 'backup'];
    tabs.forEach(t => {
        const btn = document.getElementById(dmin-tab-btn-);
        const content = document.getElementById(dmin-tab-content-);
        
        if (btn && content) {
            if (t === tabId) {
                btn.className = 'px-4 py-2.5 rounded-xl font-bold transition-all text-black bg-gradient-to-r from-amber-400 to-yellow-500 shadow-md shadow-amber-500/20 flex items-center gap-2 text-sm';
                content.classList.remove('hidden');
            } else {
                btn.className = 'px-4 py-2.5 rounded-xl font-medium transition-all text-zinc-400 hover:text-white hover:bg-zinc-800/60 flex items-center gap-2 text-sm';
                content.classList.add('hidden');
            }
        }
    });
}

function renderAdminAccountsList() {
    const container = document.getElementById('admin-accounts-list');
    if (!container) return;
    
    const data = getPlatformData();
    const accounts = data.accounts || [];
    
    if (accounts.length === 0) {
        container.innerHTML = 
            <div class="text-center py-12 text-zinc-500">
                <i class="fa-solid fa-folder-open text-4xl mb-3 text-zinc-600"></i>
                <p>لا توجد حسابات مضافة حالياً. اضغط على زر "إضافة حساب جديد" للبدء!</p>
            </div>
        ;
        return;
    }
    
    container.innerHTML = accounts.map((acc, index) => 
        <div class="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-lg hover:shadow-black/50">
            <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white shadow-inner flex-shrink-0" style="background-color: ; box-shadow: 0 0 15px 40;">
                    <i class=""></i>
                </div>
                <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="font-bold text-white text-base truncate"></h4>
                        
                        
                    </div>
                    <p class="text-xs text-zinc-400 truncate mt-0.5"></p>
                    <div class="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                        <span><i class="fa-solid fa-users text-amber-500/70"></i> </span>
                        <span><i class="fa-solid fa-arrow-pointer text-blue-400"></i>  نقرة</span>
                        <span class="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400"></span>
                    </div>
                </div>
            </div>
            
            <div class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap border-t border-zinc-800/80 md:border-t-0 pt-3 md:pt-0">
                <button onclick="toggleAccountActiveStatus('')" class="p-2 rounded-lg  border border-zinc-700 hover:bg-zinc-700 transition-colors" title="">
                    <i class="fa-solid "></i>
                </button>
                <button onclick="toggleAccountPinnedStatus('')" class="p-2 rounded-lg  border border-zinc-700 hover:bg-zinc-700 transition-colors" title="تثبيت في الأعلى">
                    <i class="fa-solid fa-thumbtack"></i>
                </button>
                <button onclick="openEditAccountModal('')" class="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5">
                    <i class="fa-solid fa-pen-to-square"></i> تعديل
                </button>
                <button onclick="deleteAccount('')" class="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-bold transition-all flex items-center gap-1.5">
                    <i class="fa-solid fa-trash-can"></i> حذف
                </button>
            </div>
        </div>
    ).join('');
}

function getCategoryName(catId) {
    const data = getPlatformData();
    const cat = data.categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
}

function openAddAccountModal() {
    currentEditingAccountId = null;
    const modal = document.getElementById('account-editor-modal');
    const form = document.getElementById('account-editor-form');
    const modalTitle = document.getElementById('account-editor-title');
    
    if (form) form.reset();
    if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-plus-circle text-amber-400"></i> إضافة حساب أو قناة جديدة';
    
    // قيم افتراضية
    document.getElementById('acc-color-input').value = '#FF0000';
    document.getElementById('acc-icon-input').value = 'fa-brands fa-youtube';
    document.getElementById('acc-active-input').checked = true;
    document.getElementById('acc-pinned-input').checked = false;
    
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function openEditAccountModal(accId) {
    const data = getPlatformData();
    const acc = data.accounts.find(a => a.id === accId);
    if (!acc) return;
    
    currentEditingAccountId = accId;
    const modal = document.getElementById('account-editor-modal');
    const modalTitle = document.getElementById('account-editor-title');
    
    if (modalTitle) modalTitle.innerHTML = <i class="fa-solid fa-pen text-amber-400"></i> تعديل: ;
    
    document.getElementById('acc-title-input').value = acc.title || '';
    document.getElementById('acc-subtitle-input').value = acc.subtitle || '';
    document.getElementById('acc-url-input').value = acc.url || '';
    document.getElementById('acc-platform-input').value = acc.platform || 'custom';
    document.getElementById('acc-category-input').value = acc.category || 'social';
    document.getElementById('acc-followers-input').value = acc.followers || '';
    document.getElementById('acc-badge-input').value = acc.badge || '';
    document.getElementById('acc-icon-input').value = acc.icon || 'fa-solid fa-link';
    document.getElementById('acc-color-input').value = acc.themeColor || '#D4AF37';
    document.getElementById('acc-active-input').checked = acc.active !== false;
    document.getElementById('acc-pinned-input').checked = acc.isPinned === true;
    
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAccountEditorModal() {
    const modal = document.getElementById('account-editor-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function saveAccountFromForm(e) {
    if (e) e.preventDefault();
    
    const title = document.getElementById('acc-title-input').value.trim();
    const url = document.getElementById('acc-url-input').value.trim();
    if (!title || !url) {
        showToast("تنبيه ⚠️", "يرجى كتابة عنوان الحساب والرابط بشكل صحيح", "warning");
        return;
    }
    
    const data = getPlatformData();
    const accountObj = {
        id: currentEditingAccountId || 'acc_' + Date.now(),
        title: title,
        subtitle: document.getElementById('acc-subtitle-input').value.trim(),
        url: url,
        platform: document.getElementById('acc-platform-input').value,
        category: document.getElementById('acc-category-input').value,
        followers: document.getElementById('acc-followers-input').value.trim() || 'متابع',
        badge: document.getElementById('acc-badge-input').value.trim(),
        icon: document.getElementById('acc-icon-input').value.trim() || 'fa-solid fa-link',
        themeColor: document.getElementById('acc-color-input').value || '#D4AF37',
        isPinned: document.getElementById('acc-pinned-input').checked,
        active: document.getElementById('acc-active-input').checked,
        clicks: 0
    };
    
    if (currentEditingAccountId) {
        const index = data.accounts.findIndex(a => a.id === currentEditingAccountId);
        if (index !== -1) {
            accountObj.clicks = data.accounts[index].clicks || 0;
            data.accounts[index] = accountObj;
            showToast("تم الحفظ بنجاح! ✅", تم تحديث بيانات "", "success");
        }
    } else {
        if (accountObj.isPinned) {
            data.accounts.unshift(accountObj);
        } else {
            data.accounts.push(accountObj);
        }
        showToast("تمت الإضافة بنجاح! 🚀", تم إضافة حساب "" للمنصة, "success");
    }
    
    savePlatformData(data);
    closeAccountEditorModal();
    renderAdminAccountsList();
    if (typeof renderAccounts === 'function') {
        renderAccounts();
    }
}

function deleteAccount(accId) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الحساب نهائياً من المنصة؟")) return;
    
    const data = getPlatformData();
    data.accounts = data.accounts.filter(a => a.id !== accId);
    savePlatformData(data);
    
    showToast("تم الحذف 🗑️", "تم إزالة الحساب من المنصة", "info");
    renderAdminAccountsList();
    if (typeof renderAccounts === 'function') {
        renderAccounts();
    }
}

function toggleAccountActiveStatus(accId) {
    const data = getPlatformData();
    const acc = data.accounts.find(a => a.id === accId);
    if (acc) {
        acc.active = !acc.active;
        savePlatformData(data);
        renderAdminAccountsList();
        if (typeof renderAccounts === 'function') renderAccounts();
        showToast(acc.active ? "تم التفعيل 🟢" : "تم التعطيل 🔴", حالة الحساب الآن: , "info");
    }
}

function toggleAccountPinnedStatus(accId) {
    const data = getPlatformData();
    const acc = data.accounts.find(a => a.id === accId);
    if (acc) {
        acc.isPinned = !acc.isPinned;
        savePlatformData(data);
        renderAdminAccountsList();
        if (typeof renderAccounts === 'function') renderAccounts();
        showToast(acc.isPinned ? "تم التثبيت 📌" : "تم إلغاء التثبيت", حساب "" في المقدمة, "info");
    }
}

// تحميل وتعديل الملف التعريفي
function loadProfileSettingsToForm() {
    const data = getPlatformData();
    const p = data.profile;
    
    document.getElementById('profile-name-input').value = p.name || '';
    document.getElementById('profile-tagline-input').value = p.tagline || '';
    document.getElementById('profile-bio-input').value = p.bio || '';
    document.getElementById('profile-avatar-input').value = p.avatar || '';
    document.getElementById('profile-banner-input').value = p.banner || '';
    document.getElementById('profile-badge-input').value = p.vipBadgeText || '';
    document.getElementById('profile-email-input').value = p.contactEmail || '';
    document.getElementById('profile-location-input').value = p.location || '';
    document.getElementById('profile-pin-input').value = p.adminPin || '1234';
    
    document.getElementById('profile-announcement-input').value = p.announcement || '';
    document.getElementById('profile-announcement-toggle').checked = p.showAnnouncement !== false;
}

function saveProfileSettingsFromForm(e) {
    if (e) e.preventDefault();
    
    const data = getPlatformData();
    data.profile.name = document.getElementById('profile-name-input').value.trim() || data.profile.name;
    data.profile.tagline = document.getElementById('profile-tagline-input').value.trim();
    data.profile.bio = document.getElementById('profile-bio-input').value.trim();
    data.profile.avatar = document.getElementById('profile-avatar-input').value.trim();
    data.profile.banner = document.getElementById('profile-banner-input').value.trim();
    data.profile.vipBadgeText = document.getElementById('profile-badge-input').value.trim() || 'حساب موثق VIP';
    data.profile.contactEmail = document.getElementById('profile-email-input').value.trim();
    data.profile.location = document.getElementById('profile-location-input').value.trim();
    data.profile.adminPin = document.getElementById('profile-pin-input').value.trim() || '1234';
    
    data.profile.announcement = document.getElementById('profile-announcement-input').value.trim();
    data.profile.showAnnouncement = document.getElementById('profile-announcement-toggle').checked;
    
    savePlatformData(data);
    showToast("تم حفظ الإعدادات بنجاح! 👑", "تم تحديث الملف التعريفي والواجهة بالكامل", "success");
    
    if (typeof renderProfileHeader === 'function') renderProfileHeader();
    if (typeof updateAuthUI === 'function') updateAuthUI();
}

// الإحصائيات
function renderAdminAnalytics() {
    const data = getPlatformData();
    const accounts = data.accounts || [];
    
    let totalClicks = 0;
    accounts.forEach(a => { totalClicks += (a.clicks || 0); });
    
    let analyticsData = { totalViews: 120, totalClicks: totalClicks };
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
        if (stored) analyticsData = JSON.parse(stored);
    } catch (e) {}
    
    const statViews = document.getElementById('stat-total-views');
    const statClicks = document.getElementById('stat-total-clicks');
    const statAccounts = document.getElementById('stat-total-accounts');
    const topAccountsList = document.getElementById('admin-top-accounts-list');
    
    if (statViews) statViews.textContent = analyticsData.totalViews || 150;
    if (statClicks) statClicks.textContent = totalClicks;
    if (statAccounts) statAccounts.textContent = accounts.length;
    
    if (topAccountsList) {
        const sorted = [...accounts].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5);
        topAccountsList.innerHTML = sorted.map((acc, idx) => 
            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold "></span>
                    <span class="font-bold text-white text-sm"></span>
                </div>
                <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"> زيارة</span>
            </div>
        ).join('');
    }
}

// النسخ الاحتياطي وتصدير JSON
function exportDataJSON() {
    const data = getPlatformData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", bu-nadam-platform-backup-.json);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("تم التصدير بنجاح! 💾", "تم تنزيل ملف النسخة الاحتياطية لجهازك", "success");
}

function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData && importedData.profile && importedData.accounts) {
                savePlatformData(importedData);
                showToast("تم الاستيراد بنجاح! 🎉", "تمت استعادة كافة البيانات والحسابات", "success");
                loadProfileSettingsToForm();
                renderAdminAccountsList();
                renderAdminAnalytics();
                if (typeof renderProfileHeader === 'function') renderProfileHeader();
                if (typeof renderAccounts === 'function') renderAccounts();
            } else {
                showToast("ملف غير صالح ❌", "هيكل البيانات في الملف غير متوافق", "error");
            }
        } catch (err) {
            showToast("خطأ في قراءة الملف ❌", "يرجى اختيار ملف JSON صالح", "error");
        }
    };
    reader.readAsText(file);
}

function confirmResetData() {
    if (confirm("تحذير: هل أنت متأكد من إعادة ضبط المنصة على الإعدادات الافتراضية؟ سيتم مسح أي حسابات قمت بإضافتها يدوياً ما لم تكن قد قمت بتصديرها.")) {
        resetPlatformDataToDefault();
        showToast("تمت إعادة التعيين", "عادت المنصة إلى حالتها الافتراضية الأصلية", "info");
        loadProfileSettingsToForm();
        renderAdminAccountsList();
        renderAdminAnalytics();
        if (typeof renderProfileHeader === 'function') renderProfileHeader();
        if (typeof renderAccounts === 'function') renderAccounts();
    }
}

// دالة مساعدة لتحديث الأيقونة واللون تلقائياً عند تغيير المنصة في النموذج
function onPlatformSelectChange(platform) {
    const iconInput = document.getElementById('acc-icon-input');
    const colorInput = document.getElementById('acc-color-input');
    
    const presets = {
        youtube: { icon: 'fa-brands fa-youtube', color: '#FF0000' },
        telegram: { icon: 'fa-brands fa-telegram', color: '#229ED9' },
        tiktok: { icon: 'fa-brands fa-tiktok', color: '#00f2fe' },
        instagram: { icon: 'fa-brands fa-instagram', color: '#E1306C' },
        discord: { icon: 'fa-brands fa-discord', color: '#5865F2' },
        kick: { icon: 'fa-solid fa-gamepad', color: '#53FC18' },
        twitch: { icon: 'fa-brands fa-twitch', color: '#9146FF' },
        'x-twitter': { icon: 'fa-brands fa-x-twitter', color: '#ffffff' },
        whatsapp: { icon: 'fa-brands fa-whatsapp', color: '#25D366' },
        email: { icon: 'fa-solid fa-envelope', color: '#D4AF37' },
        custom: { icon: 'fa-solid fa-link', color: '#D4AF37' }
    };
    
    if (presets[platform]) {
        if (iconInput) iconInput.value = presets[platform].icon;
        if (colorInput) colorInput.value = presets[platform].color;
    }
}
