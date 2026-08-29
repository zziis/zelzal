/**
 * app.js - المحرك التفاعلي وتجربة المستخدم لمنصة أبو ندم
 */

let currentCategory = 'all';
let searchQuery = '';
let showFavoritesOnly = false;
let currentViewMode = 'grid'; // 'grid' | 'list'

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    trackPageView();
    renderProfileHeader();
    renderCategories();
    renderAccounts();
    updateAuthUI();
    setupEventListeners();
    updateFavoritesCounter();
}

function renderProfileHeader() {
    const data = getPlatformData();
    const p = data.profile;
    
    // صورة الغلاف والخلفية
    const bannerEl = document.getElementById('profile-banner');
    if (bannerEl && p.banner) {
        bannerEl.style.backgroundImage = `url('${p.banner}')`;
    }
    
    // الصورة الشخصية
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl && p.avatar) {
        avatarEl.src = p.avatar;
    }
    
    // الاسم والنبذة
    const nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = p.name;
    
    const taglineEl = document.getElementById('profile-tagline');
    if (taglineEl) taglineEl.textContent = p.tagline;
    
    const bioEl = document.getElementById('profile-bio');
    if (bioEl) bioEl.textContent = p.bio;
    
    const locationEl = document.getElementById('profile-location');
    if (locationEl) locationEl.innerHTML = `<i class="fa-solid fa-location-dot text-amber-400"></i> ${p.location || 'المملكة العربية السعودية 🇸🇦'}`;
    
    const vipBadgeEl = document.getElementById('profile-vip-badge');
    if (vipBadgeEl) {
        vipBadgeEl.innerHTML = `<i class="fa-solid fa-certificate text-amber-400"></i> <span>${p.vipBadgeText || 'حساب موثق VIP'}</span>`;
    }
    
    // شريط الإعلانات العاجلة
    const announcementContainer = document.getElementById('announcement-container');
    const announcementText = document.getElementById('announcement-text');
    if (announcementContainer && announcementText) {
        if (p.showAnnouncement && p.announcement && p.announcement.trim()) {
            announcementText.textContent = p.announcement;
            announcementContainer.classList.remove('hidden');
        } else {
            announcementContainer.classList.add('hidden');
        }
    }
}

function renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    const data = getPlatformData();
    const categories = data.categories || [];
    
    container.innerHTML = categories.map(cat => {
        const isActive = currentCategory === cat.id && !showFavoritesOnly;
        return `
            <button onclick="selectCategory('${cat.id}')" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                isActive
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/25 scale-105 border-transparent'
                : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-amber-500/40 hover:text-amber-400 hover:bg-zinc-800/80'
            }">
                <i class="${cat.icon}"></i>
                <span>${cat.name}</span>
            </button>
        `;
    }).join('') + `
        <button onclick="toggleFavoritesFilter()" class="px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            showFavoritesOnly
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/25 scale-105 border-transparent'
            : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-rose-500/40 hover:text-rose-400 hover:bg-zinc-800/80'
        }">
            <i class="fa-solid fa-star text-amber-400"></i>
            <span>المفضلة</span>
            <span id="fav-count-badge" class="bg-zinc-800 px-2 py-0.5 rounded-full text-xs text-amber-300">0</span>
        </button>
    `;
}

function selectCategory(catId) {
    currentCategory = catId;
    showFavoritesOnly = false;
    renderCategories();
    renderAccounts();
}

function toggleFavoritesFilter() {
    showFavoritesOnly = !showFavoritesOnly;
    renderCategories();
    renderAccounts();
}

function getUserFavorites() {
    try {
        const favs = localStorage.getItem(STORAGE_KEYS.USER_FAVORITES);
        return favs ? JSON.parse(favs) : [];
    } catch (e) {
        return [];
    }
}

function toggleFavorite(accId, e) {
    if (e) e.stopPropagation();
    
    let favs = getUserFavorites();
    const isFav = favs.includes(accId);
    
    if (isFav) {
        favs = favs.filter(id => id !== accId);
        showToast("المفضلة ⭐", "تمت إزالة الحساب من قائمتك المفضلة", "info");
    } else {
        favs.push(accId);
        showToast("أحسنت! ⭐", "تمت إضافة الحساب إلى قائمتك المفضلة", "success");
        if (window.confetti) {
            window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        }
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_FAVORITES, JSON.stringify(favs));
    updateFavoritesCounter();
    renderAccounts();
}

function updateFavoritesCounter() {
    const favs = getUserFavorites();
    const badge = document.getElementById('fav-count-badge');
    if (badge) badge.textContent = favs.length;
}

function renderAccounts() {
    const container = document.getElementById('accounts-grid');
    if (!container) return;
    
    const data = getPlatformData();
    const accounts = data.accounts || [];
    const favorites = getUserFavorites();
    
    // فلترة الحسابات
    let filtered = accounts.filter(acc => {
        // إذا كان مخفياً وليس المدير
        if (acc.active === false && !isAdmin()) return false;
        
        // فلترة المفضلة
        if (showFavoritesOnly && !favorites.includes(acc.id)) return false;
        
        // فلترة الفئة
        if (!showFavoritesOnly && currentCategory !== 'all' && acc.category !== currentCategory) return false;
        
        // فلترة البحث
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const titleMatch = (acc.title || '').toLowerCase().includes(q);
            const subMatch = (acc.subtitle || '').toLowerCase().includes(q);
            const badgeMatch = (acc.badge || '').toLowerCase().includes(q);
            if (!titleMatch && !subMatch && !badgeMatch) return false;
        }
        
        return true;
    });
    
    // ترتيب: المثبت أولاً
    filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
    });
    
    // تحديث عداد الحسابات
    const totalCountEl = document.getElementById('visible-accounts-count');
    if (totalCountEl) totalCountEl.textContent = `${filtered.length} حساب / قناة`;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center">
                <div class="w-20 h-20 mx-auto rounded-3xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-3xl text-amber-400 mb-4 shadow-xl shadow-black">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-1">لم يتم العثور على أي نتائج</h3>
                <p class="text-zinc-400 text-sm">جرب البحث بكلمات أخرى أو اختر فئة مختلفة من الأعلى</p>
                <button onclick="clearFilters()" class="mt-4 px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all">
                    إعادة ضبط الفلترة
                </button>
            </div>
        `;
        return;
    }
    
    if (currentViewMode === 'list') {
        container.className = 'grid grid-cols-1 gap-3.5';
    } else {
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5';
    }
    
    container.innerHTML = filtered.map(acc => {
        const isFav = favorites.includes(acc.id);
        const cardBgStyle = `background: linear-gradient(145deg, rgba(24, 24, 30, 0.9) 0%, rgba(14, 14, 18, 0.95) 100%);`;
        const glowColor = acc.themeColor || '#D4AF37';
        
        return `
            <div class="group relative rounded-3xl border border-zinc-800/80 hover:border-amber-500/50 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden" style="${cardBgStyle} box-shadow: 0 10px 30px -10px rgba(0,0,0,0.7);">
                
                <!-- خط التوهج العلوي -->
                <div class="absolute top-0 right-0 left-0 h-[2px] opacity-70 group-hover:opacity-100 transition-all" style="background: linear-gradient(90deg, transparent, ${glowColor}, transparent);"></div>
                
                <!-- رأس الكرت -->
                <div class="flex items-start justify-between gap-3 mb-4">
                    <div class="flex items-center gap-3.5 min-w-0">
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg flex-shrink-0 transition-transform group-hover:scale-110 duration-300 relative" style="background-color: ${glowColor}; box-shadow: 0 0 20px ${glowColor}50;">
                            <i class="${acc.icon || 'fa-solid fa-link'}"></i>
                            ${acc.isPinned ? '<div class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] flex items-center justify-center font-bold shadow-md"><i class="fa-solid fa-thumbtack"></i></div>' : ''}
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <h3 class="font-bold text-white text-base md:text-lg group-hover:text-amber-300 transition-colors truncate">${acc.title}</h3>
                            </div>
                            <span class="text-xs text-amber-400/90 font-medium block mt-0.5"><i class="fa-solid fa-users text-[10px] ml-1"></i> ${acc.followers || 'متابع'}</span>
                        </div>
                    </div>
                    
                    <!-- أزرار التفاعل السريع (مفضلة / نسخ) -->
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <button onclick="toggleFavorite('${acc.id}', event)" class="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-xs transition-all ${isFav ? 'text-amber-400 bg-amber-500/20 border-amber-500/40' : 'text-zinc-400 hover:text-amber-300'}" title="إضافة للمفضلة">
                            <i class="fa-${isFav ? 'solid' : 'regular'} fa-star"></i>
                        </button>
                        <button onclick="copyDirectLink('${acc.url}', event)" class="w-8 h-8 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-xs text-zinc-400 hover:text-white transition-all" title="نسخ الرابط">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    </div>
                </div>
                
                <!-- النبذة والشارة -->
                <p class="text-xs md:text-sm text-zinc-400 line-clamp-2 min-h-[36px] mb-4">${acc.subtitle || 'انقر للزيارة والانضمام إلى حسابنا الرسمي والاستمتاع بكافة المحتويات.'}</p>
                
                <div class="flex items-center justify-between gap-2 mb-4">
                    ${acc.badge ? `<span class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-zinc-800/90 text-amber-300 border border-amber-500/20 flex items-center gap-1"><i class="fa-solid fa-bolt text-amber-400"></i> ${acc.badge}</span>` : '<span></span>'}
                    <span class="text-[11px] text-zinc-500 flex items-center gap-1"><i class="fa-solid fa-eye text-zinc-600"></i> ${acc.clicks || 0} زيارة</span>
                </div>
                
                <!-- زر الزيارة والانتقال الرئيسي -->
                <a href="${acc.url}" target="_blank" rel="noopener noreferrer" onclick="handleAccountVisit('${acc.id}')" class="w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 text-white hover:text-black font-bold text-sm border border-zinc-700/80 hover:border-transparent flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg group/btn">
                    <span>زيارة القناة الآن</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5"></i>
                </a>
            </div>
        `;
    }).join('');
}

function handleAccountVisit(accId) {
    incrementAccountClick(accId);
}

function copyDirectLink(url, e) {
    if (e) e.stopPropagation();
    copyToClipboard(url, "تم نسخ رابط القناة بنجاح! 📋");
}

function copyToClipboard(text, successMsg = "تم النسخ للحافظة بنجاح!") {
    navigator.clipboard.writeText(text).then(() => {
        showToast("تم النسخ 📋", successMsg, "success");
    }).catch(() => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast("تم النسخ 📋", successMsg, "success");
    });
}

function clearFilters() {
    currentCategory = 'all';
    searchQuery = '';
    showFavoritesOnly = false;
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    renderCategories();
    renderAccounts();
}

function setupEventListeners() {
    // البحث
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderAccounts();
        });
    }
    
    // زر للأعلى
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.add('opacity-100');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.remove('opacity-100');
            }
        });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setViewMode(mode) {
    currentViewMode = mode;
    const gridBtn = document.getElementById('view-btn-grid');
    const listBtn = document.getElementById('view-btn-list');
    
    if (mode === 'grid') {
        if (gridBtn) gridBtn.className = 'p-2 rounded-xl bg-amber-500 text-black font-bold';
        if (listBtn) listBtn.className = 'p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white';
    } else {
        if (gridBtn) gridBtn.className = 'p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white';
        if (listBtn) listBtn.className = 'p-2 rounded-xl bg-amber-500 text-black font-bold';
    }
    renderAccounts();
}

// نافذة المشاركة
function openShareModal() {
    const modal = document.getElementById('share-platform-modal');
    if (!modal) return;
    
    const currentUrl = window.location.href;
    const shareUrlInput = document.getElementById('share-url-input');
    const qrImg = document.getElementById('share-qr-image');
    
    if (shareUrlInput) shareUrlInput.value = currentUrl;
    if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&color=d4af37&bgcolor=141419`;
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeShareModal() {
    const modal = document.getElementById('share-platform-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function shareViaSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent("منصة قنوات وحسابات أبو ندم الرسمية VIP 🔥");
    let shareLink = "";
    
    switch (platform) {
        case 'whatsapp':
            shareLink = `https://api.whatsapp.com/send?text=${title}%20${url}`;
            break;
        case 'telegram':
            shareLink = `https://t.me/share/url?url=${url}&text=${title}`;
            break;
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            break;
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
    }
    
    if (shareLink) {
        window.open(shareLink, '_blank', 'width=600,height=500');
    }
}

// محرك التنبيهات (Toast Notifications)
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    const icons = {
        success: 'fa-solid fa-circle-check text-emerald-400',
        error: 'fa-solid fa-circle-xmark text-red-400',
        warning: 'fa-solid fa-triangle-exclamation text-amber-400',
        info: 'fa-solid fa-circle-info text-blue-400'
    };
    
    toast.className = 'transform translate-y-4 opacity-0 transition-all duration-300 bg-zinc-900/95 border border-zinc-700/80 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-start gap-3.5 max-w-sm w-full text-right pointer-events-auto';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.15)';
    
    toast.innerHTML = `
        <div class="text-xl flex-shrink-0 mt-0.5">
            <i class="${icons[type] || icons.info}"></i>
        </div>
        <div class="min-w-0 flex-1">
            <h4 class="text-white font-bold text-sm">${title}</h4>
            <p class="text-zinc-300 text-xs mt-0.5 leading-relaxed">${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-zinc-500 hover:text-white text-sm">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // ظهور ناعم
    setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);
    
    // إخفاء تلقائي بعد 3.5 ثوانٍ
    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
