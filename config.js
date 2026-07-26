/**
 * nisanbedia.com - Site Configuration & Initial State
 */
const DEFAULT_CONFIG = {
    adminPassword: "1234", // Varsayılan admin şifresi
    siteTitle: "Nisan Bedia Sağdıç | Resmi Web Sitesi",
    metaDescription: "Nisan Bedia Sağdıç - Kişisel web sitesi, sosyal medya hesapları ve iletişim bilgileri.",
    
    // Supabase Bulut Veritabanı Yapılandırması (Otomatik Bağlı)
    supabaseConfig: {
        url: "https://tfprjgqoluuvuwsfmubk.supabase.co",
        anonKey: "sb_publishable_MMgrvknerQRofUHUzWTQkg_7zrDWRG_",
        tableName: "site_config"
    },

    // Profil Bilgileri
    profile: {
        fullName: "Nisan Bedia Sağdıç",
        title: "Tasarımcı & Dijital İçerik Üreticisi",
        tagline: "Yaratıcı vizyon, dijital estetik ve minimalist tasarım tutkunu.",
        bio: "Merhaba! Ben Nisan Bedia Sağdıç. Dijital dünyada estetik, kullanıcı deneyimi ve özgün içerik üretimi üzerine çalışmalar yapıyorum. Sosyal medya mecralarım üzerinden güncel projelerimi ve hayatımdan kesitleri paylaşıyorum. İş birliği veya iletişim için aşağıdaki kanallardan ulaşabilirsiniz.",
        location: "İstanbul, Türkiye",
        email: "nisan@nisanbedia.com",
        phone: "+90 (555) 000 00 00",
        photoUrl: "nisan_bedia_portrait.jpg",
        statusBadge: "İş Birliklerine Açık ✨",
        tags: ["Tasarım", "Dijital İçerik", "Sanat & Moda", "Teknoloji", "Sosyal Medya"]
    },

    // Sosyal Medya Bağlantıları
    socialLinks: [
        {
            id: "1",
            platform: "Instagram",
            icon: "instagram",
            url: "https://instagram.com/nisanbedia",
            username: "@nisanbedia",
            badge: "Takip Et",
            color: "#E1306C",
            enabled: true
        },
        {
            id: "2",
            platform: "LinkedIn",
            icon: "linkedin",
            url: "https://linkedin.com/in/nisanbedia",
            username: "Nisan Bedia Sağdıç",
            badge: "Bağlantı Kur",
            color: "#0A66C2",
            enabled: true
        },
        {
            id: "3",
            platform: "X / Twitter",
            icon: "twitter",
            url: "https://x.com/nisanbedia",
            username: "@nisanbedia",
            badge: "Takip Et",
            color: "#1DA1F2",
            enabled: true
        },
        {
            id: "4",
            platform: "YouTube",
            icon: "youtube",
            url: "https://youtube.com/@nisanbedia",
            username: "Nisan Bedia",
            badge: "Abone Ol",
            color: "#FF0000",
            enabled: true
        },
        {
            id: "5",
            platform: "Spotify",
            icon: "spotify",
            url: "https://spotify.com",
            username: "Nisan'ın Çalma Listesi",
            badge: "Dinle",
            color: "#1DB954",
            enabled: true
        },
        {
            id: "6",
            platform: "E-posta",
            icon: "mail",
            url: "mailto:nisan@nisanbedia.com",
            username: "nisan@nisanbedia.com",
            badge: "Mesaj Gönder",
            color: "#EA4335",
            enabled: true
        }
    ],

    // Öne Çıkan Bağlantılar & Portfolyo Kartları
    featuredCards: [
        {
            id: "f1",
            title: "Tasarım & Proje Portfolyosu 2026",
            description: "En son hayata geçirdiğim kreatif projeler ve dijital çalışmalarım.",
            url: "#portfolio",
            badge: "Yeni",
            icon: "briefcase",
            color: "#6366f1"
        },
        {
            id: "f2",
            title: "Özel Blog & Düşünceler",
            description: "Dijital estetik, trendler ve teknoloji üzerine kaleme aldığım yazılar.",
            url: "#blog",
            badge: "Popüler",
            icon: "book-open",
            color: "#ec4899"
        }
    ],

    // Görünüm & Tema
    appearance: {
        themeMode: "dark", // "dark" veya "light"
        accentColor: "rose", // "rose", "emerald", "sapphire", "gold", "violet"
        fontFamily: "Inter, sans-serif"
    }
};
