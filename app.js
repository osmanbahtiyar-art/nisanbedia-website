/**
 * nisanbedia.com - Main Application Logic & Admin State Controller
 */

(function () {
    // State Key for LocalStorage
    const STORAGE_KEY = "nisanbedia_site_config_v1";

    // Application State
    let state = {};

    // DOM Elements
    const elements = {
        // Site Content
        fullName: document.getElementById("fullName"),
        profileTitle: document.getElementById("profileTitle"),
        profileTagline: document.getElementById("profileTagline"),
        profileBio: document.getElementById("profileBio"),
        profileLocation: document.getElementById("profileLocation"),
        profileEmail: document.getElementById("profileEmail"),
        profilePhoto: document.getElementById("profilePhoto"),
        statusBadgeText: document.getElementById("statusBadgeText"),
        statusBadge: document.getElementById("statusBadge"),
        tagsContainer: document.getElementById("tagsContainer"),
        quickSocialBar: document.getElementById("quickSocialBar"),
        socialLinksGrid: document.getElementById("socialLinksGrid"),
        featuredCardsGrid: document.getElementById("featuredCardsGrid"),
        copyEmailBtn: document.getElementById("copyEmailBtn"),
        currentYear: document.getElementById("currentYear"),
        
        // Theme Toggle
        themeToggleBtn: document.getElementById("themeToggleBtn"),
        
        // Login Modal
        adminLoginModal: document.getElementById("adminLoginModal"),
        adminLoginForm: document.getElementById("adminLoginForm"),
        adminPasscode: document.getElementById("adminPasscode"),
        togglePassVisibility: document.getElementById("togglePassVisibility"),
        loginErrorMsg: document.getElementById("loginErrorMsg"),
        closeLoginModalBtn: document.getElementById("closeLoginModalBtn"),
        
        // Dashboard Modal
        adminDashboardModal: document.getElementById("adminDashboardModal"),
        closeDashboardBtn: document.getElementById("closeDashboardBtn"),
        exportConfigBtn: document.getElementById("exportConfigBtn"),
        dashExportBtn: document.getElementById("dashExportBtn"),
        
        // Tabs
        tabBtns: document.querySelectorAll(".dash-tabs-nav .tab-btn"),
        tabPanes: document.querySelectorAll(".dash-tab-contents .tab-pane"),
        
        // Profile Edit Form
        profileEditForm: document.getElementById("profileEditForm"),
        adminPhotoPreview: document.getElementById("adminPhotoPreview"),
        photoFileInput: document.getElementById("photoFileInput"),
        triggerFileSelect: document.getElementById("triggerFileSelect"),
        editPhotoUrl: document.getElementById("editPhotoUrl"),
        editFullName: document.getElementById("editFullName"),
        editTitle: document.getElementById("editTitle"),
        editTagline: document.getElementById("editTagline"),
        editBio: document.getElementById("editBio"),
        editLocation: document.getElementById("editLocation"),
        editEmail: document.getElementById("editEmail"),
        editStatusBadge: document.getElementById("editStatusBadge"),
        editTags: document.getElementById("editTags"),
        
        // Social Tab
        addNewSocialBtn: document.getElementById("addNewSocialBtn"),
        adminSocialList: document.getElementById("adminSocialList"),
        
        // Featured Tab
        addNewFeaturedBtn: document.getElementById("addNewFeaturedBtn"),
        adminFeaturedList: document.getElementById("adminFeaturedList"),
        
        // Item Edit Modal
        itemEditModal: document.getElementById("itemEditModal"),
        itemEditModalTitle: document.getElementById("itemEditModalTitle"),
        closeItemEditBtn: document.getElementById("closeItemEditBtn"),
        itemEditForm: document.getElementById("itemEditForm"),
        itemEditId: document.getElementById("itemEditId"),
        itemEditType: document.getElementById("itemEditType"),
        itemTitleInput: document.getElementById("itemTitleInput"),
        itemSubInput: document.getElementById("itemSubInput"),
        itemUrlInput: document.getElementById("itemUrlInput"),
        itemBadgeInput: document.getElementById("itemBadgeInput"),
        itemIconInput: document.getElementById("itemIconInput"),
        itemColorInput: document.getElementById("itemColorInput"),

        // Appearance
        themeSelectCards: document.querySelectorAll(".theme-select-card"),
        accentColorPicker: document.getElementById("accentColorPicker"),

        // Security & Backup
        changePasswordForm: document.getElementById("changePasswordForm"),
        currentPassInput: document.getElementById("currentPassInput"),
        newPassInput: document.getElementById("newPassInput"),
        importJsonInput: document.getElementById("importJsonInput"),
        triggerImportBtn: document.getElementById("triggerImportBtn"),
        resetDefaultsBtn: document.getElementById("resetDefaultsBtn"),
        toastContainer: document.getElementById("toastContainer")
    };

    /* ==========================================
       Initialization & Data Sync
       ========================================== */
    function init() {
        loadState();
        applyAppearance();
        renderSiteContent();
        setupEventListeners();
        setCurrentYear();
        checkSuperadminxRoute();
        refreshLucideIcons();
    }

    function checkSuperadminxRoute() {
        // Automatically open admin login modal when visiting /superadminx or ?superadminx=1
        const path = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const hash = window.location.hash.toLowerCase();

        if (path.includes("superadminx") || search.includes("superadminx") || hash.includes("superadminx")) {
            setTimeout(() => {
                openLoginModal();
            }, 300);
        }
    }

    function loadState() {
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
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            renderSiteContent();
            applyAppearance();
            showToast("Değişiklikler başarıyla kaydedildi! ✨");
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

        // Profile Info
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

        // Title Tag
        document.title = `${profile.fullName} | Resmi Web Sitesi`;

        // Tags
        if (elements.tagsContainer) {
            elements.tagsContainer.innerHTML = "";
            (profile.tags || []).forEach(tag => {
                const badge = document.createElement("span");
                badge.className = "tag-badge";
                badge.textContent = tag.trim();
                elements.tagsContainer.appendChild(badge);
            });
        }

        // Quick Social Header Bar
        if (elements.quickSocialBar) {
            elements.quickSocialBar.innerHTML = "";
            socialLinks.filter(s => s.enabled !== false).forEach(item => {
                const a = document.createElement("a");
                a.href = item.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.className = "quick-social-icon";
                a.title = `${item.platform} (${item.username})`;
                a.innerHTML = `<i data-lucide="${getLucideIconName(item.icon)}"></i>`;
                elements.quickSocialBar.appendChild(a);
            });
        }

        // Social Links Cards Grid
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
                            <i data-lucide="${getLucideIconName(item.icon)}"></i>
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

        // Featured Cards Grid
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
                            <i data-lucide="${getLucideIconName(item.icon)}"></i>
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

        // Update Appearance Selection Cards in Admin
        elements.themeSelectCards.forEach(card => {
            if (card.getAttribute("data-theme-val") === mode) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });

        // Update Color Swatches
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
        // Theme Toggle Button
        elements.themeToggleBtn.addEventListener("click", () => {
            state.appearance.themeMode = state.appearance.themeMode === "dark" ? "light" : "dark";
            saveState();
        });

        // Copy Email Pill
        elements.copyEmailBtn.addEventListener("click", () => {
            const email = state.profile.email;
            navigator.clipboard.writeText(email).then(() => {
                showToast(`E-posta kopyalandı: ${email}`);
            }).catch(() => {
                showToast(`E-posta: ${email}`);
            });
        });

        // Modal Close Buttons
        if (elements.closeLoginModalBtn) elements.closeLoginModalBtn.addEventListener("click", closeLoginModal);
        if (elements.closeDashboardBtn) elements.closeDashboardBtn.addEventListener("click", closeDashboardModal);

        // Toggle Password Visibility
        elements.togglePassVisibility.addEventListener("click", () => {
            const isPass = elements.adminPasscode.type === "password";
            elements.adminPasscode.type = isPass ? "text" : "password";
        });

        // Login Form Submit
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

        // Dashboard Tabs Navigation
        elements.tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                
                elements.tabBtns.forEach(b => b.classList.remove("active"));
                elements.tabPanes.forEach(p => p.classList.remove("active"));

                btn.classList.add("active");
                document.getElementById(targetTab)?.classList.add("active");
            });
        });

        // Profile Form Submit
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

            // Tags Split
            const tagsRaw = elements.editTags.value;
            state.profile.tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

            saveState();
        });

        // Photo Upload File Trigger
        elements.triggerFileSelect.addEventListener("click", () => {
            elements.photoFileInput.click();
        });

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

        // Add Social Link Btn
        elements.addNewSocialBtn.addEventListener("click", () => {
            openItemEditModal("social", null);
        });

        // Add Featured Card Btn
        elements.addNewFeaturedBtn.addEventListener("click", () => {
            openItemEditModal("featured", null);
        });

        // Close Item Edit Modal
        elements.closeItemEditBtn.addEventListener("click", () => {
            elements.itemEditModal.classList.add("hidden");
        });

        // Item Form Submit (Add/Edit)
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

        // Appearance Theme Selection
        elements.themeSelectCards.forEach(card => {
            card.addEventListener("click", () => {
                const selectedTheme = card.getAttribute("data-theme-val");
                state.appearance.themeMode = selectedTheme;
                saveState();
            });
        });

        // Accent Color Selection
        if (elements.accentColorPicker) {
            elements.accentColorPicker.addEventListener("click", (e) => {
                const swatch = e.target.closest(".color-swatch");
                if (swatch) {
                    state.appearance.accentColor = swatch.getAttribute("data-color");
                    saveState();
                }
            });
        }

        // Change Admin Password Form
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

        // Export Config JSON
        elements.exportConfigBtn.addEventListener("click", exportConfigJSON);
        elements.dashExportBtn.addEventListener("click", exportConfigJSON);

        // Import Config JSON
        elements.triggerImportBtn.addEventListener("click", () => {
            elements.importJsonInput.click();
        });

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

        // Reset to Defaults
        elements.resetDefaultsBtn.addEventListener("click", () => {
            if (confirm("Tüm değişiklikler sıfırlanacak ve fabrika ayarlarına dönülecektir. Emin misiniz?")) {
                state = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                saveState();
                populateDashboardFields();
                showToast("Fabrika ayarlarına dönüldü.");
            }
        });
    }

    /* ==========================================
       Modals & Admin Helper Actions
       ========================================== */
    function openLoginModal() {
        elements.adminLoginModal.classList.remove("hidden");
        elements.adminPasscode.focus();
    }

    function closeLoginModal() {
        elements.adminLoginModal.classList.add("hidden");
    }

    function openDashboardModal() {
        populateDashboardFields();
        elements.adminDashboardModal.classList.remove("hidden");
    }

    function closeDashboardModal() {
        elements.adminDashboardModal.classList.add("hidden");
    }

    function populateDashboardFields() {
        const { profile } = state;
        
        elements.editFullName.value = profile.fullName || "";
        elements.editTitle.value = profile.title || "";
        elements.editTagline.value = profile.tagline || "";
        elements.editBio.value = profile.bio || "";
        elements.editLocation.value = profile.location || "";
        elements.editEmail.value = profile.email || "";
        elements.editStatusBadge.value = profile.statusBadge || "";
        elements.editTags.value = (profile.tags || []).join(", ");
        elements.editPhotoUrl.value = profile.photoUrl.startsWith("data:") ? "" : profile.photoUrl;
        
        if (elements.adminPhotoPreview) {
            elements.adminPhotoPreview.src = profile.photoUrl;
        }

        renderAdminSocialList();
        renderAdminFeaturedList();
    }

    function renderAdminSocialList() {
        elements.adminSocialList.innerHTML = "";
        state.socialLinks.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "admin-item-row";
            row.innerHTML = `
                <div class="admin-item-left">
                    <div class="social-icon-box" style="width:34px; height:34px; color:${item.color};">
                        <i data-lucide="${getLucideIconName(item.icon)}"></i>
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

        // Bind Row Buttons
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
        elements.adminFeaturedList.innerHTML = "";
        (state.featuredCards || []).forEach((item) => {
            const row = document.createElement("div");
            row.className = "admin-item-row";
            row.innerHTML = `
                <div class="admin-item-left">
                    <div class="social-icon-box" style="width:34px; height:34px; color:var(--accent);">
                        <i data-lucide="${getLucideIconName(item.icon)}"></i>
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

        // Bind Row Buttons
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
        elements.itemEditType.value = type;
        elements.itemEditModalTitle.textContent = itemData 
            ? `${type === 'social' ? 'Sosyal Medya' : 'Öne Çıkan'} Düzenle` 
            : `Yeni ${type === 'social' ? 'Sosyal Hesap' : 'Kart'} Ekle`;

        if (itemData) {
            elements.itemEditId.value = itemData.id;
            elements.itemTitleInput.value = itemData.platform || itemData.title || "";
            elements.itemSubInput.value = itemData.username || itemData.description || "";
            elements.itemUrlInput.value = itemData.url || "";
            elements.itemBadgeInput.value = itemData.badge || "";
            elements.itemIconInput.value = itemData.icon || "globe";
            elements.itemColorInput.value = itemData.color || "#FB7185";
        } else {
            elements.itemEditId.value = "";
            elements.itemTitleInput.value = "";
            elements.itemSubInput.value = "";
            elements.itemUrlInput.value = "";
            elements.itemBadgeInput.value = "";
            elements.itemIconInput.value = "instagram";
            elements.itemColorInput.value = "#FB7185";
        }

        elements.itemEditModal.classList.remove("hidden");
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
        elements.toastContainer.appendChild(toast);
        refreshLucideIcons();

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    function getLucideIconName(icon) {
        const iconMap = {
            "twitter": "twitter",
            "x": "twitter",
            "mail": "mail",
            "email": "mail"
        };
        return iconMap[icon] || icon || "globe";
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
