/**
 * data.js - إدارة البيانات والتخزين لمنصة أبو ندم
 */

const STORAGE_KEYS = {
    PLATFORM_DATA: 'abu_nadam_platform_data_v1',
    AUTH_USER: 'abu_nadam_current_user_v1',
    USER_FAVORITES: 'abu_nadam_favorites_v1',
    ANALYTICS: 'abu_nadam_analytics_v1'
};

const defaultPlatformData = {
    profile: {
        name: "أبو ندم | Abu Nadam",
        tagline: "صانع محتوى  | المنصة الرسمية لكافة الحسابات والقنوات",
        bio: "أهلاً بكم في منصتي الرسمية الموثقة. هنا تجدون كافة قنواتي وحساباتي الرسمية على منصات التواصل الاجتماعي والبث المباشر. !",
        avatar: "https://ravtwfqrqjycyzqqsutq.supabase.co/storage/v1/object/public/uploads/e3aec432-f813-4baa-ae50-cab7bcd7b50c/1788046399390-23728.png",
        banner: "https://ravtwfqrqjycyzqqsutq.supabase.co/storage/v1/object/public/uploads/e3aec432-f813-4baa-ae50-cab7bcd7b50c/1788046399390-23728.png",
        verified: true,
        vipBadgeText: "حساب موثق VIP",
        announcement: "🔥 ترقبوا البث المباشر القادم  .",
        showAnnouncement: true,
        contactEmail: "contact@abunadam.com",
        location: "🫣 العراق اديالى 🫣",
        adminPin: "1234"
    },
    categories: [
        { id: "all", name: "جميع القنوات", icon: "fa-solid fa-layer-group" },
        { id: "video", name: "قنوات الفيديو", icon: "fa-solid fa-play" },
        { id: "streaming", name: "البث المباشر", icon: "fa-solid fa-headset" },
        { id: "social", name: "التواصل الاجتماعي", icon: "fa-solid fa-share-nodes" },
        { id: "community", name: "المجتمعات والجروبات", icon: "fa-solid fa-users" },
        { id: "vip", name: "التواصل والخاص", icon: "fa-solid fa-crown" }
    ],
    accounts: [
        {
            id: "acc_2",
            title: "قناة التليجرام VIP",
            subtitle: "آخر الأخبار، التسريبات والروابط الحصرية فوراً",
            platform: "telegram",
            category: "community",
            url: "https://t.me/abunadam",
            icon: "fa-brands fa-telegram",
            themeColor: "#229ED9",
            followers: "+120K عضو",
            badge: "تحديثات يومية ⚡",
            isPinned: true,
            clicks: 2150,
            active: true
        },
        {
            id: "acc_3",
            title: "حساب تيك توك الرسمي",
            subtitle: "مقاطع قصيرة وترندات ويوميات سريعة",
            platform: "tiktok",
            category: "social",
            url: "https://tiktok.com/@abunadam",
            icon: "fa-brands fa-tiktok",
            themeColor: "#00f2fe",
            followers: "+1.2M متابع",
            badge: "ترند مستمر ⭐",
            isPinned: true,
            clicks: 3410,
            active: true
        },
        {
            id: "acc_5",
            title: "حساب انستغرام الرسمي",
            subtitle: "يوميات، ستوريات وتصوير احترافي",
            platform: "instagram",
            category: "social",
            url: "https://instagram.com/abunadam",
            icon: "fa-brands fa-instagram",
            themeColor: "#E1306C",
            followers: "+350K متابع",
            badge: "ستوري يومي 📸",
            isPinned: false,
            clicks: 1670,
            active: true
        },
        {
            id: "acc_8",
            title: "قناة واتساب الرسمية",
            subtitle: "تصلك الإشعارات والإعلانات مباشرة على هاتفك",
            platform: "whatsapp",
            category: "community",
            url: "https://whatsapp.com/channel/abunadam",
            icon: "fa-brands fa-whatsapp",
            themeColor: "#25D366",
            followers: "+60K مشترك",
            badge: "إشعارات سريعة 📲",
            isPinned: false,
            clicks: 620,
            active: true
        },
        {
            id: "acc_10",
            title: "للتواصل التجاري والإعلانات (Business)",
            subtitle: "للرعايات والشراكات التسويقية الرسمية",
            platform: "email",
            category: "vip",
            url: "mailto:business@abunadam.com",
            icon: "fa-solid fa-envelope-open-text",
            themeColor: "#D4AF37",
            followers: "استجابة سريعة",
            badge: "Business VIP 💼",
            isPinned: false,
            clicks: 310,
            active: true
        }
    ]
};

function getPlatformData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.PLATFORM_DATA);
        if (!stored) {
            savePlatformData(defaultPlatformData);
            return defaultPlatformData;
        }
        const data = JSON.parse(stored);
        if (!data.profile || !data.accounts) {
            savePlatformData(defaultPlatformData);
            return defaultPlatformData;
        }
        return data;
    } catch (e) {
        console.error("Error reading localStorage:", e);
        return defaultPlatformData;
    }
}

function savePlatformData(data) {
    try {
        localStorage.setItem(STORAGE_KEYS.PLATFORM_DATA, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving data:", e);
    }
}

function resetPlatformDataToDefault() {
    savePlatformData(defaultPlatformData);
    return defaultPlatformData;
}

function incrementAccountClick(accId) {
    const data = getPlatformData();
    const acc = data.accounts.find(a => a.id === accId);
    if (acc) {
        acc.clicks = (acc.clicks || 0) + 1;
        savePlatformData(data);
    }
    
    // إحصائيات عامة
    try {
        const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '{"totalViews": 0, "totalClicks": 0}');
        stats.totalClicks = (stats.totalClicks || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(stats));
    } catch (e) {}
}

function trackPageView() {
    try {
        const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS) || '{"totalViews": 0, "totalClicks": 0}');
        stats.totalViews = (stats.totalViews || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(stats));
    } catch (e) {}
}
