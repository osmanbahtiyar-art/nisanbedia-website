/**
 * nisanbedia.com - Main Application Logic, Admin State Controller & Supabase Cloud Sync
 */

(function () {
    // State Key for LocalStorage
    const STORAGE_KEY = "nisanbedia_site_config_v1";

    // Application State
    let state = {};
    let supabaseClient = null;
    let modalsInjected = false;

    // SVG Icon Map for High-Quality Vector Social Icons
    const SVG_ICONS = {
        "instagram": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
        "linkedin": `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
        "twitter": `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        "x": `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        "youtube": `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        "spotify": `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.12-.779-.18-.899-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3.102zM18.96 14.1c-.3.479-.9.6-1.38.3-3.24-2-8.16-2.58-11.999-1.38-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.38-1.38 9.84-.72 13.56 1.56.48.3.6.9.3 1.5zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.26-.18-1.44-.78-.18-.6.18-1.26.78-1.44 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.54-1.02.72-1.56.42z"/></svg>`,
        "mail": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
        "globe": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
        "briefcase": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
        "book-open": `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    };

    function getIconSvg(iconName) {
        const key = (iconName || "globe").toLowerCase();
        return SVG_ICONS[key] || `<i data-lucide="${key}"></i>`;
    }

    // DOM Elements Cache
    let elements = {};

    /* ==========================================
       Initialization & Data Sync
       ========================================== */
    async function init() {
        cacheDomElements();
        loadLocalState();
        applyAppearance();
        renderSiteContent();
        
        // Unhide body smoothly with initial local state
        document.body.classList.add("app-ready");

        initSupabase();
        await syncStateFromSupabase();
        
        // Re-render if Supabase had newer cloud state
        applyAppearance();
        renderSiteContent();
        
        setupEventListeners();
        setCurrentYear();
        checkSuperadminxRoute();
        refreshLucideIcons();
    }

    function cacheDomElements() {
        elements = {
            fullName: document.getElementById("fullName"),
            profileTitle: document.getElementById("profileTitle"),
            profileTagline: document.getElementById("profileTagline"),
            profileBio: document.getElementById("profileBio"),
            profileLocation: document.getElementById("profileLocation"),
            profileEmail: document.getElementById("profileEmail"),
            profilePhoto: document.getElementById("profilePhoto"),
            navProfilePhoto: document.getElementById("navProfilePhoto"),
            statusBadgeText: document.getElementById("statusBadgeText"),
            statusBadge: document.getElementById("statusBadge"),
            tagsContainer: document.getElementById("tagsContainer"),
            quickSocialBar: document.getElementById("quickSocialBar"),
            socialLinksGrid: document.getElementById("socialLinksGrid"),
            featuredCardsGrid: document.getElementById("featuredCardsGrid"),
            copyEmailBtn: document.getElementById("copyEmailBtn"),
            currentYear: document.getElementById("currentYear"),
            themeToggleBtn: document.getElementById("themeToggleBtn"),
            toastContainer: document.getElementById("toastContainer")
        };
    }

    function checkSuperadminxRoute() {
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const hash = window.location.hash.toLowerCase();

        if (path.includes("superadminx") || search.includes("superadminx") || hash.includes("superadminx")) {
            injectAdminModals();
            setTimeout(() => {
                openLoginModal();
            }, 300);
        }
    }

    function injectAdminModals() {
        if (modalsInjected) return;
        modalsInjected = true;

        const modalsContainer = document.createElement("div");
        modalsContainer.id = "dynamicAdminContainer";
        modalsContainer.innerHTML = `
            <!-- ADMIN LOGIN MODAL -->
            <div id="adminLoginModal" class="modal-backdrop hidden">
                <div class="modal-box glass-modal login-modal">
                    <button class="modal-close-btn" id="closeLoginModalBtn">&times;</button>
                    <div class="modal-header">
                        <div class="modal-icon-badge"><i data-lucide="lock"></i></div>
                        <h3>Yönetim Paneli Girişi</h3>
                        <p>nisanbedia.com içeriklerini değiştirmek için şifrenizi girin.</p>
                    </div>
                    <form id="adminLoginForm" class="login-form">
                        <div class="form-group">
                            <label for="adminPasscode">Admin Şifresi</label>
                            <div class="password-input-wrap">
                                <input type="password" id="adminPasscode" placeholder="Şifrenizi girin (Varsayılan: 1234)" required autocomplete="current-password">
                                <button type="button" id="togglePassVisibility" class="pass-toggle"><i data-lucide="eye"></i></button>
                            </div>
                        </div>
                        <div id="loginErrorMsg" class="error-msg hidden">Hatalı şifre! Lütfen tekrar deneyin.</div>
                        <button type="submit" class="btn btn-primary full-width">
                            <i data-lucide="log-in"></i> Giriş Yap
                        </button>
                    </form>
                </div>
            </div>

            <!-- ADMIN DASHBOARD MODAL -->
            <div id="adminDashboardModal" class="modal-backdrop hidden">
                <div class="modal-box glass-modal dashboard-modal">
                    <div class="dashboard-header">
                        <div class="dash-title">
                            <i data-lucide="sliders" class="dash-title-icon"></i>
                            <div>
                                <h2>Yönetim Paneli (Superadminx)</h2>
                                <span class="dash-subtitle">nisanbedia.com Canlı İçerik Düzenleyici & Supabase Bulut Senkronu</span>
                            </div>
                        </div>
                        <div class="dash-header-actions">
                            <button id="exportConfigBtn" class="btn btn-secondary btn-sm" title="Yedek İndir (JSON)">
                                <i data-lucide="download"></i> Yedek İndir
                            </button>
                            <button id="closeDashboardBtn" class="modal-close-btn">&times;</button>
                        </div>
                    </div>

                    <div class="dashboard-body">
                        <div class="dash-tabs-nav">
                            <button class="tab-btn active" data-tab="tabProfile"><i data-lucide="user"></i> <span>Profil Bilgileri</span></button>
                            <button class="tab-btn" data-tab="tabSocial"><i data-lucide="share-2"></i> <span>Sosyal Medya</span></button>
                            <button class="tab-btn" data-tab="tabFeatured"><i data-lucide="link"></i> <span>Öne Çıkanlar</span></button>
                            <button class="tab-btn" data-tab="tabAppearance"><i data-lucide="palette"></i> <span>Görünüm & Tema</span></button>
                            <button class="tab-btn" data-tab="tabSupabase"><i data-lucide="database"></i> <span>Supabase Bulut</span></button>
                            <button class="tab-btn" data-tab="tabSettings"><i data-lucide="shield"></i> <span>Şifre & Yedek</span></button>
                        </div>

                        <div class="dash-tab-contents">
                            <div id="tabProfile" class="tab-pane active">
                                <h3>Profil ve Biyografi Düzenle</h3>
                                <p class="tab-desc">Sitede görünen ad-soyad, unvan, fotoğraf ve açıklama bilgilerini güncelleyin.</p>
                                <form id="profileEditForm" class="admin-form">
                                    <div class="photo-edit-group">
                                        <div class="photo-preview-wrap">
                                            <img id="adminPhotoPreview" src="nisan_bedia_portrait.jpg" alt="Önizleme">
                                        </div>
                                        <div class="photo-inputs">
                                            <label>Profil Fotoğrafı</label>
                                            <div class="form-group inline-upload">
                                                <input type="file" id="photoFileInput" accept="image/*" class="file-input-hidden">
                                                <button type="button" id="triggerFileSelect" class="btn btn-secondary btn-sm">
                                                    <i data-lucide="upload"></i> Cihazdan Fotoğraf Seç
                                                </button>
                                            </div>
                                            <div class="form-group">
                                                <input type="text" id="editPhotoUrl" placeholder="Veya Fotoğraf Bağlantısı (URL)">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group"><label for="editFullName">Ad Soyad</label><input type="text" id="editFullName" required></div>
                                        <div class="form-group"><label for="editTitle">Unvan / Meslek</label><input type="text" id="editTitle" required></div>
                                    </div>
                                    <div class="form-group"><label for="editTagline">Kısa Mottolar / Slogan</label><input type="text" id="editTagline"></div>
                                    <div class="form-group"><label for="editBio">Biyografi Metni (Hakkımda)</label><textarea id="editBio" rows="4"></textarea></div>
                                    <div class="form-row">
                                        <div class="form-group"><label for="editLocation">Şehir / Konum</label><input type="text" id="editLocation"></div>
                                        <div class="form-group"><label for="editEmail">E-posta Adresi</label><input type="email" id="editEmail"></div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group"><label for="editStatusBadge">Durum Rozeti</label><input type="text" id="editStatusBadge"></div>
                                        <div class="form-group"><label for="editTags">Etiketler / İlgi Alanları</label><input type="text" id="editTags"></div>
                                    </div>
                                    <div class="form-actions"><button type="submit" class="btn btn-primary"><i data-lucide="save"></i> Değişiklikleri Kaydet & Buluta Gönder</button></div>
                                </form>
                            </div>

                            <div id="tabSocial" class="tab-pane">
                                <div class="pane-header">
                                    <div><h3>Sosyal Medya Linkleri</h3><p class="tab-desc">Ziyaretçilerinizin size ulaşabileceği hesapları yönetin.</p></div>
                                    <button id="addNewSocialBtn" class="btn btn-primary btn-sm"><i data-lucide="plus"></i> Yeni Hesap Ekle</button>
                                </div>
                                <div id="adminSocialList" class="admin-items-list"></div>
                            </div>

                            <div id="tabFeatured" class="tab-pane">
                                <div class="pane-header">
                                    <div><h3>Öne Çıkanlar & Portfolyo</h3><p class="tab-desc">Özel kartları yönetin.</p></div>
                                    <button id="addNewFeaturedBtn" class="btn btn-primary btn-sm"><i data-lucide="plus"></i> Yeni Kart Ekle</button>
                                </div>
                                <div id="adminFeaturedList" class="admin-items-list"></div>
                            </div>

                            <div id="tabAppearance" class="tab-pane">
                                <h3>Görünüm ve Renk Paleti</h3>
                                <div class="appearance-settings">
                                    <div class="setting-group">
                                        <label>Varsayılan Tema</label>
                                        <div class="theme-options">
                                            <button class="theme-select-card" data-theme-val="dark"><div class="theme-preview dark-preview"></div><span>Koyu Tema</span></button>
                                            <button class="theme-select-card" data-theme-val="light"><div class="theme-preview light-preview"></div><span>Açık Tema</span></button>
                                        </div>
                                    </div>
                                    <div class="setting-group">
                                        <label>Vurgu Rengi Paleti</label>
                                        <div class="color-options" id="accentColorPicker">
                                            <button class="color-swatch rose active" data-color="rose"></button>
                                            <button class="color-swatch emerald" data-color="emerald"></button>
                                            <button class="color-swatch sapphire" data-color="sapphire"></button>
                                            <button class="color-swatch gold" data-color="gold"></button>
                                            <button class="color-swatch violet" data-color="violet"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="tabSupabase" class="tab-pane">
                                <h3>Supabase Bulut Veritabanı Entegrasyonu</h3>
                                <form id="supabaseConfigForm" class="admin-form">
                                    <div class="form-group"><label for="supaUrlInput">Supabase Proje URL</label><input type="url" id="supaUrlInput"></div>
                                    <div class="form-group"><label for="supaKeyInput">Supabase Anon Key</label><input type="password" id="supaKeyInput"></div>
                                    <div class="form-group"><label for="supaTableNameInput">Tablo Adı</label><input type="text" id="supaTableNameInput" value="site_config"></div>
                                    <div class="form-actions"><button type="submit" class="btn btn-primary"><i data-lucide="link"></i> Kaydet ve Test Et</button></div>
                                </form>
                            </div>

                            <div id="tabSettings" class="tab-pane">
                                <h3>Güvenlik ve Veri Yönetimi</h3>
                                <div class="settings-box-grid">
                                    <div class="setting-card">
                                        <h4>Admin Şifresi Değiştir</h4>
                                        <form id="changePasswordForm">
                                            <div class="form-group"><label for="currentPassInput">Mevcut Şifre</label><input type="password" id="currentPassInput" required></div>
                                            <div class="form-group"><label for="newPassInput">Yeni Şifre</label><input type="password" id="newPassInput" required></div>
                                            <button type="submit" class="btn btn-secondary btn-sm">Güncelle</button>
                                        </form>
                                    </div>
                                    <div class="setting-card">
                                        <h4>Veri Yedekleme</h4>
                                        <div class="backup-actions">
                                            <button id="dashExportBtn" class="btn btn-secondary btn-sm"><i data-lucide="download"></i> Yedeği İndir (.json)</button>
                                            <div class="import-wrapper">
                                                <input type="file" id="importJsonInput" accept=".json" class="file-input-hidden">
                                                <button id="triggerImportBtn" class="btn btn-secondary btn-sm"><i data-lucide="upload"></i> Yedeği Yükle</button>
                                            </div>
                                        </div>
                                        <div class="reset-danger-zone">
                                            <button id="resetDefaultsBtn" class="btn btn-danger-link btn-sm"><i data-lucide="rotate-ccw"></i> Fabrika Ayarlarına Dön</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ITEM EDIT MODAL -->
            <div id="itemEditModal" class="modal-backdrop hidden">
                <div class="modal-box glass-modal item-modal">
                    <button id="closeItemEditBtn" class="modal-close-btn">&times;</button>
                    <div class="modal-header"><h3 id="itemEditModalTitle">Öğe Düzenle</h3></div>
                    <form id="itemEditForm">
                        <input type="hidden" id="itemEditId"><input type="hidden" id="itemEditType">
                        <div class="form-group"><label for="itemTitleInput">Başlık / Platform</label><input type="text" id="itemTitleInput" required></div>
                        <div class="form-group"><label for="itemSubInput">Kullanıcı Adı / Açıklama</label><input type="text" id="itemSubInput"></div>
                        <div class="form-group"><label for="itemUrlInput">Bağlantı Adresi</label><input type="url" id="itemUrlInput" required></div>
                        <div class="form-row">
                            <div class="form-group"><label for="itemBadgeInput">Buton Metni</label><input type="text" id="itemBadgeInput"></div>
                            <div class="form-group"><label for="itemIconInput">İkon Adı</label>
                                <select id="itemIconInput">
                                    <option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option><option value="twitter">Twitter / X</option><option value="youtube">YouTube</option><option value="spotify">Spotify</option><option value="mail">Mail</option><option value="globe">Web</option><option value="briefcase">Portfolyo</option><option value="book-open">Blog</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group"><label for="itemColorInput">Özel Renk</label><input type="color" id="itemColorInput" value="#E1306C"></div>
                        <div class="form-actions"><button type="submit" class="btn btn-primary full-width"><i data-lucide="check"></i> Kaydet</button></div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modalsContainer);
        cacheAdminDomElements();
        setupAdminEventListeners();
        refreshLucideIcons();
    }

    function cacheAdminDomElements() {
        elements.adminLoginModal = document.getElementById("adminLoginModal");
        elements.adminLoginForm = document.getElementById("adminLoginForm");
        elements.adminPasscode = document.getElementById("adminPasscode");
        elements.togglePassVisibility = document.getElementById("togglePassVisibility");
        elements.loginErrorMsg = document.getElementById("loginErrorMsg");
        elements.closeLoginModalBtn = document.getElementById("closeLoginModalBtn");
        
        elements.adminDashboardModal = document.getElementById("adminDashboardModal");
        elements.closeDashboardBtn = document.getElementById("closeDashboardBtn");
        elements.exportConfigBtn = document.getElementById("exportConfigBtn");
        elements.dashExportBtn = document.getElementById("dashExportBtn");
        
        elements.tabBtns = document.querySelectorAll(".dash-tabs-nav .tab-btn");
        elements.tabPanes = document.querySelectorAll(".dash-tab-contents .tab-pane");
        
        elements.profileEditForm = document.getElementById("profileEditForm");
        elements.adminPhotoPreview = document.getElementById("adminPhotoPreview");
        elements.photoFileInput = document.getElementById("photoFileInput");
        elements.triggerFileSelect = document.getElementById("triggerFileSelect");
        elements.editPhotoUrl = document.getElementById("editPhotoUrl");
        elements.editFullName = document.getElementById("editFullName");
        elements.editTitle = document.getElementById("editTitle");
        elements.editTagline = document.getElementById("editTagline");
        elements.editBio = document.getElementById("editBio");
        elements.editLocation = document.getElementById("editLocation");
        elements.editEmail = document.getElementById("editEmail");
        elements.editStatusBadge = document.getElementById("editStatusBadge");
        elements.editTags = document.getElementById("editTags");
        
        elements.addNewSocialBtn = document.getElementById("addNewSocialBtn");
        elements.adminSocialList = document.getElementById("adminSocialList");
        
        elements.addNewFeaturedBtn = document.getElementById("addNewFeaturedBtn");
        elements.adminFeaturedList = document.getElementById("adminFeaturedList");
        
        elements.itemEditModal = document.getElementById("itemEditModal");
        elements.itemEditModalTitle = document.getElementById("itemEditModalTitle");
        elements.closeItemEditBtn = document.getElementById("closeItemEditBtn");
        elements.itemEditForm = document.getElementById("itemEditForm");
        elements.itemEditId = document.getElementById("itemEditId");
        elements.itemEditType = document.getElementById("itemEditType");
        elements.itemTitleInput = document.getElementById("itemTitleInput");
        elements.itemSubInput = document.getElementById("itemSubInput");
        elements.itemUrlInput = document.getElementById("itemUrlInput");
        elements.itemBadgeInput = document.getElementById("itemBadgeInput");
        elements.itemIconInput = document.getElementById("itemIconInput");
        elements.itemColorInput = document.getElementById("itemColorInput");

        elements.themeSelectCards = document.querySelectorAll(".theme-select-card");
        elements.accentColorPicker = document.getElementById("accentColorPicker");

        elements.supabaseConfigForm = document.getElementById("supabaseConfigForm");
        elements.supaUrlInput = document.getElementById("supaUrlInput");
        elements.supaKeyInput = document.getElementById("supaKeyInput");
        elements.supaTableNameInput = document.getElementById("supaTableNameInput");

        elements.changePasswordForm = document.getElementById("changePasswordForm");
        elements.currentPassInput = document.getElementById("currentPassInput");
        elements.newPassInput = document.getElementById("newPassInput");
        elements.importJsonInput = document.getElementById("importJsonInput");
        elements.triggerImportBtn = document.getElementById("triggerImportBtn");
        elements.resetDefaultsBtn = document.getElementById("resetDefaultsBtn");
    }

    function loadLocalState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                state = JSON.parse(saved);
            } else {
                state = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            }
        } catch (e) {
            console.error("State loading error:", e);
            state = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        }

        if (!state.supabaseConfig || !state.supabaseConfig.url) {
            state.supabaseConfig = DEFAULT_CONFIG.supabaseConfig;
        }
    }

    function initSupabase() {
        const supaUrl = state.supabaseConfig?.url || DEFAULT_CONFIG.supabaseConfig.url;
        const supaKey = state.supabaseConfig?.anonKey || DEFAULT_CONFIG.supabaseConfig.anonKey;

        if (window.supabase && typeof window.supabase.createClient === "function" && supaUrl && supaKey) {
            try {
                supabaseClient = window.supabase.createClient(supaUrl, supaKey);
            } catch (e) {
                console.warn("Supabase init failed:", e);
                supabaseClient = null;
            }
        }
    }

    async function syncStateFromSupabase() {
        if (!supabaseClient) return;

        const tableNames = [
            state.supabaseConfig?.tableName || "site_config",
            "site_config",
            "nisanbedia-db",
            "nisanbedia_config"
        ];

        for (const tableName of tableNames) {
            try {
                const { data, error } = await supabaseClient
                    .from(tableName)
                    .select("data")
                    .eq("id", "main")
                    .single();

                if (!error && data && data.data) {
                    state = { ...state, ...data.data };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                    return;
                }
            } catch (e) {
                console.warn(`Supabase fetch from ${tableName} error:`, e);
            }
        }
    }

    async function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            renderSiteContent();
            applyAppearance();

            if (supabaseClient) {
                const tableName = state.supabaseConfig?.tableName || "site_config";
                
                const { error } = await supabaseClient
                    .from(tableName)
                    .upsert({ id: "main", data: state, updated_at: new Date().toISOString() });

                if (error) {
                    console.error("Supabase upsert error:", error);
                    const { error: fallbackErr } = await supabaseClient
                        .from("site_config")
                        .upsert({ id: "main", data: state, updated_at: new Date().toISOString() });
                    
                    if (fallbackErr) {
                        showToast("Lütfen Supabase'de 'site_config' tablosunun açık olduğunu doğrulayın.", true);
                    } else {
                        showToast("Değişiklikler Supabase 'site_config' tablosuna başarıyla kaydedildi! ✨");
                    }
                } else {
                    showToast("Değişiklikler Supabase Bulut Veritabanına Anında İşlendi! ✨");
                }
            } else {
                showToast("Değişiklikler cihazınıza kaydedildi! ✨");
            }
        } catch (e) {
            console.error("State save error:", e);
            showToast("Kaydetme sırasında bir hata oluştu.", true);
        }
    }

    function setCurrentYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }

    function refreshLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            setTimeout(() => {
                window.lucide.createIcons();
            }, 50);
        }
    }

    /* ==========================================
       Rendering Public Site
       ========================================== */
    function renderSiteContent() {
        const { profile, socialLinks, featuredCards } = state;

        if (elements.fullName) elements.fullName.textContent = profile.fullName;
        if (elements.profileTitle) elements.profileTitle.textContent = profile.title;
        if (elements.profileTagline) elements.profileTagline.textContent = profile.tagline;
        if (elements.profileBio) elements.profileBio.textContent = profile.bio;
        if (elements.profileLocation) elements.profileLocation.textContent = profile.location;
        if (elements.profileEmail) elements.profileEmail.textContent = profile.email;
        if (elements.statusBadgeText) elements.statusBadgeText.textContent = profile.statusBadge || "İş Birliklerine Açık ✨";
        
        if (elements.profilePhoto && profile.photoUrl) {
            elements.profilePhoto.src = profile.photoUrl;
        }
        if (elements.navProfilePhoto && profile.photoUrl) {
            elements.navProfilePhoto.src = profile.photoUrl;
        }

        document.title = `${profile.fullName} | Resmi Web Sitesi`;

        if (elements.tagsContainer) {
            elements.tagsContainer.innerHTML = "";
            (profile.tags || []).forEach(tag => {
                const badge = document.createElement("span");
                badge.className = "tag-badge";
                badge.textContent = tag.trim();
                elements.tagsContainer.appendChild(badge);
            });
        }

        if (elements.quickSocialBar) {
            elements.quickSocialBar.innerHTML = "";
            socialLinks.filter(s => s.enabled !== false).forEach(item => {
                const a = document.createElement("a");
                a.href = item.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.className = "quick-social-icon";
                a.title = `${item.platform} (${item.username})`;
                a.innerHTML = getIconSvg(item.icon);
                elements.quickSocialBar.appendChild(a);
            });
        }

        if (elements.socialLinksGrid) {
            elements.socialLinksGrid.innerHTML = "";
            socialLinks.filter(s => s.enabled !== false).forEach(item => {
                const card = document.createElement("a");
                card.href = item.url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.className = "social-card glass-card";
                card.style.setProperty("--card-color", item.color || "var(--accent)");

                card.innerHTML = `
                    <div class="social-card-left">
                        <div class="social-icon-box">
                            ${getIconSvg(item.icon)}
                        </div>
                        <div class="social-meta">
                            <span class="social-platform">${escapeHtml(item.platform)}</span>
                            <span class="social-username">${escapeHtml(item.username)}</span>
                        </div>
                    </div>
                    <div class="social-card-badge">
                        <span>${escapeHtml(item.badge || "Tıkla")}</span>
                        <i data-lucide="arrow-up-right" style="width: 14px; height: 14px;"></i>
                    </div>
                `;
                elements.socialLinksGrid.appendChild(card);
            });
        }

        if (elements.featuredCardsGrid) {
            elements.featuredCardsGrid.innerHTML = "";
            (featuredCards || []).forEach(item => {
                const card = document.createElement("a");
                card.href = item.url;
                card.target = item.url.startsWith("http") ? "_blank" : "_self";
                if (item.url.startsWith("http")) card.rel = "noopener noreferrer";
                card.className = "featured-card glass-card";

                card.innerHTML = `
                    <div class="featured-top">
                        <div class="featured-icon">
                            ${getIconSvg(item.icon)}
                        </div>
                        ${item.badge ? `<span class="featured-badge">${escapeHtml(item.badge)}</span>` : ""}
                    </div>
                    <div class="featured-content">
                        <h3>${escapeHtml(item.title)}</h3>
                        <p>${escapeHtml(item.description)}</p>
                    </div>
                    <div class="featured-footer">
                        <span>İncele</span>
                        <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                    </div>
                `;
                elements.featuredCardsGrid.appendChild(card);
            });
        }

        refreshLucideIcons();
    }

    function applyAppearance() {
        const { appearance } = state;
        const mode = appearance?.themeMode || "dark";
        const accent = appearance?.accentColor || "rose";

        document.documentElement.setAttribute("data-theme", mode);
        document.documentElement.setAttribute("data-accent", accent);

        if (elements.themeSelectCards) {
            elements.themeSelectCards.forEach(card => {
                if (card.getAttribute("data-theme-val") === mode) {
                    card.classList.add("active");
                } else {
                    card.classList.remove("active");
                }
            });
        }

        if (elements.accentColorPicker) {
            const swatches = elements.accentColorPicker.querySelectorAll(".color-swatch");
            swatches.forEach(swatch => {
                if (swatch.getAttribute("data-color") === accent) {
                    swatch.classList.add("active");
                } else {
                    swatch.classList.remove("active");
                }
            });
        }
    }

    /* ==========================================
       Event Listeners & Admin Controllers
       ========================================== */
    function setupEventListeners() {
        if (elements.themeToggleBtn) {
            elements.themeToggleBtn.addEventListener("click", () => {
                state.appearance.themeMode = state.appearance.themeMode === "dark" ? "light" : "dark";
                saveState();
            });
        }

        if (elements.copyEmailBtn) {
            elements.copyEmailBtn.addEventListener("click", () => {
                const email = state.profile.email;
                navigator.clipboard.writeText(email).then(() => {
                    showToast(`E-posta kopyalandı: ${email}`);
                }).catch(() => {
                    showToast(`E-posta: ${email}`);
                });
            });
        }
    }

    function setupAdminEventListeners() {
        if (elements.closeLoginModalBtn) elements.closeLoginModalBtn.addEventListener("click", closeLoginModal);
        if (elements.closeDashboardBtn) elements.closeDashboardBtn.addEventListener("click", closeDashboardModal);

        if (elements.togglePassVisibility) {
            elements.togglePassVisibility.addEventListener("click", () => {
                const isPass = elements.adminPasscode.type === "password";
                elements.adminPasscode.type = isPass ? "text" : "password";
            });
        }

        if (elements.adminLoginForm) {
            elements.adminLoginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const inputPass = elements.adminPasscode.value.trim();
                const currentPass = state.adminPassword || DEFAULT_CONFIG.adminPassword;

                if (inputPass === currentPass) {
                    elements.loginErrorMsg.classList.add("hidden");
                    closeLoginModal();
                    openDashboardModal();
                    elements.adminPasscode.value = "";
                } else {
                    elements.loginErrorMsg.classList.remove("hidden");
                }
            });
        }

        if (elements.tabBtns) {
            elements.tabBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    const targetTab = btn.getAttribute("data-tab");
                    elements.tabBtns.forEach(b => b.classList.remove("active"));
                    elements.tabPanes.forEach(p => p.classList.remove("active"));
                    btn.classList.add("active");
                    document.getElementById(targetTab)?.classList.add("active");
                });
            });
        }

        if (elements.profileEditForm) {
            elements.profileEditForm.addEventListener("submit", (e) => {
                e.preventDefault();
                state.profile.fullName = elements.editFullName.value.trim();
                state.profile.title = elements.editTitle.value.trim();
                state.profile.tagline = elements.editTagline.value.trim();
                state.profile.bio = elements.editBio.value.trim();
                state.profile.location = elements.editLocation.value.trim();
                state.profile.email = elements.editEmail.value.trim();
                state.profile.statusBadge = elements.editStatusBadge.value.trim();
                
                const photoUrlInput = elements.editPhotoUrl.value.trim();
                if (photoUrlInput) {
                    state.profile.photoUrl = photoUrlInput;
                }

                const tagsRaw = elements.editTags.value;
                state.profile.tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

                saveState();
            });
        }

        if (elements.triggerFileSelect) {
            elements.triggerFileSelect.addEventListener("click", () => {
                elements.photoFileInput.click();
            });
        }

        if (elements.photoFileInput) {
            elements.photoFileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        const base64Img = evt.target.result;
                        state.profile.photoUrl = base64Img;
                        elements.adminPhotoPreview.src = base64Img;
                        elements.editPhotoUrl.value = "";
                        showToast("Profil fotoğrafı güncellendi.");
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (elements.addNewSocialBtn) elements.addNewSocialBtn.addEventListener("click", () => openItemEditModal("social", null));
        if (elements.addNewFeaturedBtn) elements.addNewFeaturedBtn.addEventListener("click", () => openItemEditModal("featured", null));
        if (elements.closeItemEditBtn) elements.closeItemEditBtn.addEventListener("click", () => elements.itemEditModal.classList.add("hidden"));

        if (elements.itemEditForm) {
            elements.itemEditForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const id = elements.itemEditId.value;
                const type = elements.itemEditType.value;

                const newItem = {
                    id: id || Date.now().toString(),
                    platform: elements.itemTitleInput.value.trim(),
                    title: elements.itemTitleInput.value.trim(),
                    username: elements.itemSubInput.value.trim(),
                    description: elements.itemSubInput.value.trim(),
                    url: elements.itemUrlInput.value.trim(),
                    badge: elements.itemBadgeInput.value.trim(),
                    icon: elements.itemIconInput.value,
                    color: elements.itemColorInput.value,
                    enabled: true
                };

                if (type === "social") {
                    if (id) {
                        const index = state.socialLinks.findIndex(x => x.id === id);
                        if (index !== -1) state.socialLinks[index] = { ...state.socialLinks[index], ...newItem };
                    } else {
                        state.socialLinks.push(newItem);
                    }
                    renderAdminSocialList();
                } else if (type === "featured") {
                    if (!state.featuredCards) state.featuredCards = [];
                    if (id) {
                        const index = state.featuredCards.findIndex(x => x.id === id);
                        if (index !== -1) state.featuredCards[index] = { ...state.featuredCards[index], ...newItem };
                    } else {
                        state.featuredCards.push(newItem);
                    }
                    renderAdminFeaturedList();
                }

                saveState();
                elements.itemEditModal.classList.add("hidden");
            });
        }

        if (elements.themeSelectCards) {
            elements.themeSelectCards.forEach(card => {
                card.addEventListener("click", () => {
                    const selectedTheme = card.getAttribute("data-theme-val");
                    state.appearance.themeMode = selectedTheme;
                    saveState();
                });
            });
        }

        if (elements.accentColorPicker) {
            elements.accentColorPicker.addEventListener("click", (e) => {
                const swatch = e.target.closest(".color-swatch");
                if (swatch) {
                    state.appearance.accentColor = swatch.getAttribute("data-color");
                    saveState();
                }
            });
        }

        if (elements.supabaseConfigForm) {
            elements.supabaseConfigForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                if (!state.supabaseConfig) state.supabaseConfig = {};

                state.supabaseConfig.url = elements.supaUrlInput.value.trim() || DEFAULT_CONFIG.supabaseConfig.url;
                state.supabaseConfig.anonKey = elements.supaKeyInput.value.trim() || DEFAULT_CONFIG.supabaseConfig.anonKey;
                state.supabaseConfig.tableName = "site_config";

                initSupabase();

                if (supabaseClient) {
                    showToast("Supabase bağlandı! Test ediliyor...");
                    await saveState();
                } else {
                    showToast("Geçersiz Supabase URL veya Anon Key!", true);
                }
            });
        }

        if (elements.changePasswordForm) {
            elements.changePasswordForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const curr = elements.currentPassInput.value.trim();
                const next = elements.newPassInput.value.trim();
                const actualCurr = state.adminPassword || DEFAULT_CONFIG.adminPassword;

                if (curr !== actualCurr) {
                    showToast("Mevcut şifreniz hatalı!", true);
                    return;
                }

                state.adminPassword = next;
                saveState();
                elements.currentPassInput.value = "";
                elements.newPassInput.value = "";
                showToast("Admin şifreniz başarıyla değiştirildi.");
            });
        }

        if (elements.exportConfigBtn) elements.exportConfigBtn.addEventListener("click", exportConfigJSON);
        if (elements.dashExportBtn) elements.dashExportBtn.addEventListener("click", exportConfigJSON);

        if (elements.triggerImportBtn) {
            elements.triggerImportBtn.addEventListener("click", () => {
                elements.importJsonInput.click();
            });
        }

        if (elements.importJsonInput) {
            elements.importJsonInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (evt) {
                        try {
                            const importedState = JSON.parse(evt.target.result);
                            state = importedState;
                            saveState();
                            populateDashboardFields();
                            showToast("Site yedek verisi başarıyla yüklendi!");
                        } catch (err) {
                            showToast("Geçersiz JSON yedek dosyası!", true);
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }

        if (elements.resetDefaultsBtn) {
            elements.resetDefaultsBtn.addEventListener("click", () => {
                if (confirm("Tüm değişiklikler sıfırlanacak ve fabrika ayarlarına dönülecektir. Emin misiniz?")) {
                    state = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                    saveState();
                    populateDashboardFields();
                    showToast("Fabrika ayarlarına dönüldü.");
                }
            });
        }
    }

    /* ==========================================
       Modals & Admin Helper Actions
       ========================================== */
    function openLoginModal() {
        injectAdminModals();
        if (elements.adminLoginModal) {
            elements.adminLoginModal.classList.remove("hidden");
            if (elements.adminPasscode) elements.adminPasscode.focus();
        }
    }

    function closeLoginModal() {
        if (elements.adminLoginModal) elements.adminLoginModal.classList.add("hidden");
    }

    function openDashboardModal() {
        populateDashboardFields();
        if (elements.adminDashboardModal) elements.adminDashboardModal.classList.remove("hidden");
    }

    function closeDashboardModal() {
        if (elements.adminDashboardModal) elements.adminDashboardModal.classList.add("hidden");
    }

    function populateDashboardFields() {
        const { profile, supabaseConfig } = state;
        
        if (elements.editFullName) elements.editFullName.value = profile.fullName || "";
        if (elements.editTitle) elements.editTitle.value = profile.title || "";
        if (elements.editTagline) elements.editTagline.value = profile.tagline || "";
        if (elements.editBio) elements.editBio.value = profile.bio || "";
        if (elements.editLocation) elements.editLocation.value = profile.location || "";
        if (elements.editEmail) elements.editEmail.value = profile.email || "";
        if (elements.editStatusBadge) elements.editStatusBadge.value = profile.statusBadge || "";
        if (elements.editTags) elements.editTags.value = (profile.tags || []).join(", ");
        if (elements.editPhotoUrl) elements.editPhotoUrl.value = profile.photoUrl.startsWith("data:") ? "" : profile.photoUrl;
        
        if (elements.adminPhotoPreview) {
            elements.adminPhotoPreview.src = profile.photoUrl;
        }

        if (elements.supaUrlInput) elements.supaUrlInput.value = supabaseConfig?.url || DEFAULT_CONFIG.supabaseConfig.url;
        if (elements.supaKeyInput) elements.supaKeyInput.value = supabaseConfig?.anonKey || DEFAULT_CONFIG.supabaseConfig.anonKey;
        if (elements.supaTableNameInput) elements.supaTableNameInput.value = "site_config";

        renderAdminSocialList();
        renderAdminFeaturedList();
    }

    function renderAdminSocialList() {
        if (!elements.adminSocialList) return;
        elements.adminSocialList.innerHTML = "";
        state.socialLinks.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "admin-item-row";
            row.innerHTML = `
                <div class="admin-item-left">
                    <div class="social-icon-box" style="width:34px; height:34px; color:${item.color};">
                        ${getIconSvg(item.icon)}
                    </div>
                    <div>
                        <strong>${escapeHtml(item.platform)}</strong>
                        <div style="font-size:0.78rem; color:var(--text-secondary);">${escapeHtml(item.username)}</div>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary btn-sm edit-social-btn" data-id="${item.id}">
                        <i data-lucide="edit-2"></i> Düzenle
                    </button>
                    <button class="btn btn-secondary btn-sm delete-social-btn" data-id="${item.id}" style="color:#EF4444;">
                        <i data-lucide="trash-2"></i> Sil
                    </button>
                </div>
            `;
            elements.adminSocialList.appendChild(row);
        });

        elements.adminSocialList.querySelectorAll(".edit-social-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const item = state.socialLinks.find(s => s.id === id);
                if (item) openItemEditModal("social", item);
            });
        });

        elements.adminSocialList.querySelectorAll(".delete-social-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                state.socialLinks = state.socialLinks.filter(s => s.id !== id);
                saveState();
                renderAdminSocialList();
            });
        });

        refreshLucideIcons();
    }

    function renderAdminFeaturedList() {
        if (!elements.adminFeaturedList) return;
        elements.adminFeaturedList.innerHTML = "";
        (state.featuredCards || []).forEach((item) => {
            const row = document.createElement("div");
            row.className = "admin-item-row";
            row.innerHTML = `
                <div class="admin-item-left">
                    <div class="social-icon-box" style="width:34px; height:34px; color:var(--accent);">
                        ${getIconSvg(item.icon)}
                    </div>
                    <div>
                        <strong>${escapeHtml(item.title)}</strong>
                        <div style="font-size:0.78rem; color:var(--text-secondary);">${escapeHtml(item.description)}</div>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-secondary btn-sm edit-feat-btn" data-id="${item.id}">
                        <i data-lucide="edit-2"></i> Düzenle
                    </button>
                    <button class="btn btn-secondary btn-sm delete-feat-btn" data-id="${item.id}" style="color:#EF4444;">
                        <i data-lucide="trash-2"></i> Sil
                    </button>
                </div>
            `;
            elements.adminFeaturedList.appendChild(row);
        });

        elements.adminFeaturedList.querySelectorAll(".edit-feat-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const item = state.featuredCards.find(f => f.id === id);
                if (item) openItemEditModal("featured", item);
            });
        });

        elements.adminFeaturedList.querySelectorAll(".delete-feat-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                state.featuredCards = state.featuredCards.filter(f => f.id !== id);
                saveState();
                renderAdminFeaturedList();
            });
        });

        refreshLucideIcons();
    }

    function openItemEditModal(type, itemData) {
        if (elements.itemEditType) elements.itemEditType.value = type;
        if (elements.itemEditModalTitle) {
            elements.itemEditModalTitle.textContent = itemData 
                ? `${type === 'social' ? 'Sosyal Medya' : 'Öne Çıkan'} Düzenle` 
                : `Yeni ${type === 'social' ? 'Sosyal Hesap' : 'Kart'} Ekle`;
        }

        if (itemData) {
            if (elements.itemEditId) elements.itemEditId.value = itemData.id;
            if (elements.itemTitleInput) elements.itemTitleInput.value = itemData.platform || itemData.title || "";
            if (elements.itemSubInput) elements.itemSubInput.value = itemData.username || itemData.description || "";
            if (elements.itemUrlInput) elements.itemUrlInput.value = itemData.url || "";
            if (elements.itemBadgeInput) elements.itemBadgeInput.value = itemData.badge || "";
            if (elements.itemIconInput) elements.itemIconInput.value = itemData.icon || "globe";
            if (elements.itemColorInput) elements.itemColorInput.value = itemData.color || "#FB7185";
        } else {
            if (elements.itemEditId) elements.itemEditId.value = "";
            if (elements.itemTitleInput) elements.itemTitleInput.value = "";
            if (elements.itemSubInput) elements.itemSubInput.value = "";
            if (elements.itemUrlInput) elements.itemUrlInput.value = "";
            if (elements.itemBadgeInput) elements.itemBadgeInput.value = "";
            if (elements.itemIconInput) elements.itemIconInput.value = "instagram";
            if (elements.itemColorInput) elements.itemColorInput.value = "#FB7185";
        }

        if (elements.itemEditModal) elements.itemEditModal.classList.remove("hidden");
    }

    function exportConfigJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `nisanbedia_site_backup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Site yedek verisi JSON olarak indirildi.");
    }

    function showToast(message, isError = false) {
        const toast = document.createElement("div");
        toast.className = `toast ${isError ? 'toast-error' : ''}`;
        toast.innerHTML = `<i data-lucide="${isError ? 'alert-circle' : 'check-circle-2'}"></i> <span>${escapeHtml(message)}</span>`;
        if (elements.toastContainer) elements.toastContainer.appendChild(toast);
        refreshLucideIcons();

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Launch Application
    document.addEventListener("DOMContentLoaded", init);
})();
