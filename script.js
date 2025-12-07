// ====================================
// LE MONT BLANC - DISCOTHÈQUE
// JavaScript Interactif
// ====================================

// ====================================
// INITIALISATION
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initAdminPanels();
    initForms();
    initModal();
    initScrollAnimations();
    loadContent();
    initContactForm();
});

// ====================================
// PARTICULES ANIMÉES
// ====================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    const colors = ['#00f0ff', '#ff00ff', '#ffff00', '#ff6b6b', '#00ff88'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// ====================================
// NAVIGATION
// ====================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        updateActiveNavLink();
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ====================================
// PANNEAUX D'ADMINISTRATION
// ====================================
function initAdminPanels() {
    // Event Admin Panel
    const adminToggle = document.getElementById('adminToggle');
    const adminPanel = document.getElementById('adminPanel');

    adminToggle.addEventListener('click', () => {
        adminPanel.classList.toggle('open');
    });

    // Article Admin Panel
    const articleAdminToggle = document.getElementById('articleAdminToggle');
    const articleAdminPanel = document.getElementById('articleAdminPanel');

    articleAdminToggle.addEventListener('click', () => {
        articleAdminPanel.classList.toggle('open');
    });

    // Promo Admin Panel
    const promoAdminToggle = document.getElementById('promoAdminToggle');
    const promoAdminPanel = document.getElementById('promoAdminPanel');

    promoAdminToggle.addEventListener('click', () => {
        promoAdminPanel.classList.toggle('open');
    });
}

// ====================================
// GESTION DES FORMULAIRES
// ====================================
function initForms() {
    // Event Form
    const eventForm = document.getElementById('eventForm');
    eventForm.addEventListener('submit', handleEventSubmit);

    // Article Form
    const articleForm = document.getElementById('articleForm');
    articleForm.addEventListener('submit', handleArticleSubmit);

    // Promo Form
    const promoForm = document.getElementById('promoForm');
    promoForm.addEventListener('submit', handlePromoSubmit);
}

// ====================================
// GESTION DES ÉVÉNEMENTS
// ====================================
function handleEventSubmit(e) {
    e.preventDefault();

    const event = {
        id: Date.now(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        description: document.getElementById('eventDescription').value,
        dj: document.getElementById('eventDj').value,
        price: document.getElementById('eventPrice').value,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const events = getEvents();
    events.unshift(event);
    localStorage.setItem('montblanc_events', JSON.stringify(events));

    // Reset form and close panel
    e.target.reset();
    document.getElementById('adminPanel').classList.remove('open');

    // Refresh display
    renderEvents();
    showToast('Événement publié avec succès !', 'success');
}

function getEvents() {
    const events = localStorage.getItem('montblanc_events');
    return events ? JSON.parse(events) : [];
}

function deleteEvent(id) {
    const events = getEvents().filter(event => event.id !== id);
    localStorage.setItem('montblanc_events', JSON.stringify(events));
    renderEvents();
    showToast('Événement supprimé', 'success');
}

function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const events = getEvents();

    if (events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🎉</div>
                <p class="empty-state-text">Aucune soirée programmée</p>
                <p class="empty-state-subtext">Publiez votre première annonce ci-dessus</p>
            </div>
        `;
        return;
    }

    eventsGrid.innerHTML = events.map((event, index) => `
        <div class="event-card" style="animation-delay: ${index * 0.1}s">
            <div class="event-header">
                <span class="event-date">${formatDate(event.date)} à ${event.time}</span>
                <h3 class="event-title">${escapeHtml(event.title)}</h3>
            </div>
            <div class="event-body">
                <p class="event-description">${escapeHtml(event.description)}</p>
                <div class="event-meta">
                    ${event.dj ? `<div class="event-meta-item"><span>🎧</span><span>${escapeHtml(event.dj)}</span></div>` : ''}
                    ${event.price ? `<div class="event-meta-item"><span>💰</span><span>${escapeHtml(event.price)}</span></div>` : ''}
                </div>
                <div class="event-actions">
                    <button class="event-btn event-btn-primary" onclick="showEventDetails(${event.id})">Plus d'infos</button>
                    <button class="event-btn event-btn-delete" onclick="deleteEvent(${event.id})">Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showEventDetails(id) {
    const event = getEvents().find(e => e.id === id);
    if (!event) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="event-header" style="margin-bottom: 2rem;">
            <span class="event-date">${formatDate(event.date)} à ${event.time}</span>
            <h2 class="event-title" style="font-size: 2rem;">${escapeHtml(event.title)}</h2>
        </div>
        <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem;">${escapeHtml(event.description)}</p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
            ${event.dj ? `<div class="contact-card"><div class="contact-icon">🎧</div><h3>DJ / Artiste</h3><p>${escapeHtml(event.dj)}</p></div>` : ''}
            ${event.price ? `<div class="contact-card"><div class="contact-icon">💰</div><h3>Entrée</h3><p>${escapeHtml(event.price)}</p></div>` : ''}
        </div>
    `;

    openModal();
}

// ====================================
// GESTION DES ARTICLES
// ====================================
function handleArticleSubmit(e) {
    e.preventDefault();

    const article = {
        id: Date.now(),
        title: document.getElementById('articleTitle').value,
        category: document.getElementById('articleCategory').value,
        content: document.getElementById('articleContent').value,
        author: document.getElementById('articleAuthor').value || 'Le Mont Blanc',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const articles = getArticles();
    articles.unshift(article);
    localStorage.setItem('montblanc_articles', JSON.stringify(articles));

    // Reset form and close panel
    e.target.reset();
    document.getElementById('articleAdminPanel').classList.remove('open');

    // Refresh display
    renderArticles();
    showToast('Article publié avec succès !', 'success');
}

function getArticles() {
    const articles = localStorage.getItem('montblanc_articles');
    return articles ? JSON.parse(articles) : [];
}

function deleteArticle(id) {
    const articles = getArticles().filter(article => article.id !== id);
    localStorage.setItem('montblanc_articles', JSON.stringify(articles));
    renderArticles();
    showToast('Article supprimé', 'success');
}

function renderArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    const articles = getArticles();

    if (articles.length === 0) {
        articlesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">📰</div>
                <p class="empty-state-text">Aucun article publié</p>
                <p class="empty-state-subtext">Partagez vos actualités avec vos visiteurs</p>
            </div>
        `;
        return;
    }

    articlesGrid.innerHTML = articles.map((article, index) => `
        <div class="article-card" style="animation-delay: ${index * 0.1}s">
            <div class="article-header">
                <span class="article-category ${article.category}">${getCategoryLabel(article.category)}</span>
                <h3 class="article-title">${escapeHtml(article.title)}</h3>
            </div>
            <div class="article-body">
                <p class="article-excerpt">${escapeHtml(truncateText(article.content, 150))}</p>
            </div>
            <div class="article-footer">
                <span class="article-author">Par ${escapeHtml(article.author)}</span>
                <span class="article-date">${formatDateShort(article.createdAt)}</span>
            </div>
            <div style="padding: 0 2rem 1.5rem; display: flex; gap: 1rem;">
                <button class="event-btn event-btn-primary" onclick="showArticleDetails(${article.id})" style="flex: 1;">Lire</button>
                <button class="event-btn event-btn-delete" onclick="deleteArticle(${article.id})" style="flex: 0;">×</button>
            </div>
        </div>
    `).join('');
}

function showArticleDetails(id) {
    const article = getArticles().find(a => a.id === id);
    if (!article) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <span class="article-category ${article.category}">${getCategoryLabel(article.category)}</span>
        </div>
        <h2 style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; margin-bottom: 1rem;">${escapeHtml(article.title)}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">
            Par ${escapeHtml(article.author)} • ${formatDateShort(article.createdAt)}
        </p>
        <div style="color: var(--text-light); line-height: 1.9; white-space: pre-wrap;">${escapeHtml(article.content)}</div>
    `;

    openModal();
}

function getCategoryLabel(category) {
    const labels = {
        news: 'News',
        interview: 'Interview',
        review: 'Review',
        announcement: 'Annonce'
    };
    return labels[category] || category;
}

// ====================================
// GESTION DES PROMOTIONS
// ====================================
function handlePromoSubmit(e) {
    e.preventDefault();

    const promo = {
        id: Date.now(),
        title: document.getElementById('promoTitle').value,
        description: document.getElementById('promoDescription').value,
        code: document.getElementById('promoCode').value,
        expiry: document.getElementById('promoExpiry').value,
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const promos = getPromos();
    promos.unshift(promo);
    localStorage.setItem('montblanc_promos', JSON.stringify(promos));

    // Reset form and close panel
    e.target.reset();
    document.getElementById('promoAdminPanel').classList.remove('open');

    // Refresh display
    renderPromos();
    showToast('Promotion publiée avec succès !', 'success');
}

function getPromos() {
    const promos = localStorage.getItem('montblanc_promos');
    return promos ? JSON.parse(promos) : [];
}

function deletePromo(id) {
    const promos = getPromos().filter(promo => promo.id !== id);
    localStorage.setItem('montblanc_promos', JSON.stringify(promos));
    renderPromos();
    showToast('Promotion supprimée', 'success');
}

function renderPromos() {
    const promoGrid = document.getElementById('promoGrid');
    const promos = getPromos();

    if (promos.length === 0) {
        promoGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🎁</div>
                <p class="empty-state-text">Aucune promotion active</p>
                <p class="empty-state-subtext">Créez des offres spéciales pour vos clients</p>
            </div>
        `;
        return;
    }

    promoGrid.innerHTML = promos.map((promo, index) => `
        <div class="promo-card" style="animation-delay: ${index * 0.1}s">
            <span class="promo-badge">PROMO</span>
            <h3 class="promo-title">${escapeHtml(promo.title)}</h3>
            <p class="promo-description">${escapeHtml(promo.description)}</p>
            ${promo.code ? `<div class="promo-code" onclick="copyPromoCode('${escapeHtml(promo.code)}')">${escapeHtml(promo.code)}</div>` : ''}
            ${promo.expiry ? `<p class="promo-expiry">⏰ Expire le ${formatDate(promo.expiry)}</p>` : ''}
            <button class="event-btn event-btn-delete" onclick="deletePromo(${promo.id})" style="margin-top: 1rem; width: 100%;">Supprimer</button>
        </div>
    `).join('');
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast('Code promo copié !', 'success');
    }).catch(() => {
        showToast('Impossible de copier le code', 'error');
    });
}

// ====================================
// MODAL
// ====================================
function initModal() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ====================================
// ANIMATIONS AU SCROLL
// ====================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ====================================
// FORMULAIRE DE CONTACT
// ====================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate form submission
        showToast('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
        contactForm.reset();
    });
}

// ====================================
// CHARGEMENT DU CONTENU
// ====================================
function loadContent() {
    renderEvents();
    renderArticles();
    renderPromos();

    // Add some demo content if empty (only first time)
    if (!localStorage.getItem('montblanc_demo_loaded')) {
        addDemoContent();
        localStorage.setItem('montblanc_demo_loaded', 'true');
    }
}

function addDemoContent() {
    // Demo events
    const demoEvents = [
        {
            id: Date.now() + 1,
            title: 'Nuit Électronique',
            date: getNextSaturday(),
            time: '23:00',
            description: 'Une soirée électro exceptionnelle avec les meilleurs DJs de la région. Laser show, confettis et ambiance de folie garantis !',
            dj: 'DJ STORM & LUNA',
            price: '15€ (gratuit avant minuit)',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            title: 'Tropical Night',
            date: getNextFriday(),
            time: '22:00',
            description: 'Ambiance tropicale, cocktails exotiques et sons latino pour une soirée inoubliable sous les palmiers virtuels !',
            dj: 'CARLOS VEGA',
            price: '10€',
            createdAt: new Date().toISOString()
        }
    ];

    // Demo articles
    const demoArticles = [
        {
            id: Date.now() + 3,
            title: 'Le Mont Blanc fait peau neuve !',
            category: 'news',
            content: 'Après des mois de travaux, votre discothèque préférée rouvre ses portes avec un tout nouveau look. Nouveau système son, éclairage LED dernière génération et décoration totalement repensée. Venez découvrir le nouveau visage du Mont Blanc !',
            author: 'L\'équipe',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 4,
            title: 'Interview exclusive avec DJ Storm',
            category: 'interview',
            content: 'Nous avons rencontré DJ Storm, notre résident depuis 5 ans. Il nous parle de son parcours, ses inspirations et ses projets pour les mois à venir. Une interview passionnante à ne pas manquer !',
            author: 'Marie L.',
            createdAt: new Date().toISOString()
        }
    ];

    // Demo promos
    const demoPromos = [
        {
            id: Date.now() + 5,
            title: 'Happy Hour Extended',
            description: 'Tous les vendredis, happy hour jusqu\'à 1h du matin ! Cocktails et shots à -50%.',
            code: 'HAPPY50',
            expiry: getDateInFuture(30),
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 6,
            title: 'Soirée Anniversaire',
            description: 'C\'est ton anniversaire ce mois-ci ? Entrée gratuite + une bouteille offerte sur présentation d\'une pièce d\'identité !',
            code: '',
            expiry: '',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('montblanc_events', JSON.stringify(demoEvents));
    localStorage.setItem('montblanc_articles', JSON.stringify(demoArticles));
    localStorage.setItem('montblanc_promos', JSON.stringify(demoPromos));

    renderEvents();
    renderArticles();
    renderPromos();
}

// ====================================
// UTILITAIRES
// ====================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

function formatDateShort(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function getNextSaturday() {
    const today = new Date();
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday.toISOString().split('T')[0];
}

function getNextFriday() {
    const today = new Date();
    const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return nextFriday.toISOString().split('T')[0];
}

function getDateInFuture(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// ====================================
// TOAST NOTIFICATIONS
// ====================================
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ====================================
// FONCTIONS GLOBALES (accessibles depuis HTML)
// ====================================
window.deleteEvent = deleteEvent;
window.deleteArticle = deleteArticle;
window.deletePromo = deletePromo;
window.showEventDetails = showEventDetails;
window.showArticleDetails = showArticleDetails;
window.copyPromoCode = copyPromoCode;
