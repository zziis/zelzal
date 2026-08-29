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
        tagline: "صانع محتوى وستريمر | المنصة الرسمية لكافة الحسابات والقنوات",
        bio: "أهلاً بكم في منصتي الرسمية الموثقة. هنا تجدون كافة قنواتي وحساباتي الرسمية على منصات التواصل الاجتماعي والبث المباشر. انضموا إلينا لتكونوا جزءاً من مجتمعنا الفخم!",
        avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80",
        banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        verified: true,
        vipBadgeText: "حساب موثق VIP",
        announcement: "🔥 ترقبوا البث المباشر القادم والمسابقات الحصرية الكبرى! اشترك الآن وفعل جرس التنبيهات في القنوات.",
        showAnnouncement: true,
        contactEmail: "contact@abunadam.com",
        location: "المملكة العربية السعودية 🇸🇦",
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
            id: "acc_1",
            title: "قناة يوتيوب الرئيسية",
            subtitle: "فيديوهات وتحديات حصرية ومقاطع مميزة",
            platform: "youtube",
            category: "video",
            url: "https://youtube.com/@abunadam",
            icon: "fa-brands fa-youtube",
            themeColor: "#FF0000",
            followers: "+500K مشترك",
            badge: "القناة الرسمية 🔥",
            isPinned: true,
            clicks: 1420,
            active: true
        },
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
            id: "acc_4",
            title: "سيرفر الديسكورد الرسمي",
            subtitle: "تجمع المتابعين، رومات ألعاب وسوالف وبطولات",
            platform: "discord",
            category: "community",
            url: "https://discord.gg/abunadam",
            icon: "fa-brands fa-discord",
            themeColor: "#5865F2",
            followers: "+45K عضو",
            badge: "مجتمع ألعاب 🎮",
            isPinned: false,
            clicks: 890,
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
            id: "acc_6",
            title: "منصة كيك للبث المباشر (Kick)",
            subtitle: "بثوث ألعاب وسهرات تفاعلية ممتعة",
            platform: "kick",
            category: "streaming",
            url: "https://kick.com/abunadam",
            icon: "fa-solid fa-gamepad",
            themeColor: "#53FC18",
            followers: "+80K متابع",
            badge: "بث مباشر 🟢",
            isPinned: false,
            clicks: 960,
            active: true
        },
        {
            id: "acc_7",
            title: "حساب منصة إكس (Twitter / X)",
            subtitle: "تغريدات، آراء ونقاشات يومية ومستجدات",
            platform: "x-twitter",
            category: "social",
            url: "https://x.com/abunadam",
            icon: "fa-brands fa-x-twitter",
            themeColor: "#ffffff",
            followers: "+190K متابع",
            badge: "نقاشات ومستجدات 💬",
            isPinned: false,
            clicks: 740,
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
            id: "acc_9",
            title: "قناة تويتش الرسمية (Twitch)",
            subtitle: "بثوث ألعاب حماسية وتحديات وجوائز",
            platform: "twitch",
            category: "streaming",
            url: "https://twitch.tv/abunadam",
            icon: "fa-brands fa-twitch",
            themeColor: "#9146FF",
            followers: "+95K متابع",
            badge: "ألعاب وجيمينج 🕹️",
            isPinned: false,
            clicks: 530,
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
