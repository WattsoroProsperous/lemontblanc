// ====================================
// MONT BLANC DISCOTHÈQUE
// JavaScript - Multi-pages
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initHeroParticles();
    initCounterAnimation();
    initNavigation();
    initAdminPanels();
    initForms();
    initModal();
    initFilters();
    initContactForm();
    loadContent();
});

// ====================================
// CUSTOM CURSOR
// ====================================
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');

    if (!cursor || !cursorDot) return;

    // Check if device has touch (mobile)
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .event-card, .article-card, .promo-card, .glass-card, input, textarea, select');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

// ====================================
// HERO PARTICLES
// ====================================
function initHeroParticles() {
    const container = document.getElementById('particlesHero');
    if (!container) return;

    const particleCount = 50;
    // Mont Blanc theme - white and ice blue particles
    const colors = ['#ffffff', '#f0f5ff', '#e8f4ff', '#a8c8e8', '#c0c0c0'];

    for (let i = 0; i < particleCount; i++) {
        createParticle(container, colors);
    }
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        box-shadow: 0 0 ${size * 2}px ${color};
    `;

    container.appendChild(particle);
}

// ====================================
// COUNTER ANIMATION
// ====================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        // Format number with spaces for thousands
        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target);
        }
    }

    requestAnimationFrame(update);
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    return num.toString();
}

// ====================================
// NAVIGATION
// ====================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile menu
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        });
    });
}

// ====================================
// ADMIN PANELS
// ====================================
function initAdminPanels() {
    const toggles = [
        { toggle: 'eventAdminToggle', panel: document.getElementById('eventAdminToggle')?.closest('.admin-section') },
        { toggle: 'articleAdminToggle', panel: document.getElementById('articleAdminToggle')?.closest('.admin-section') },
        { toggle: 'promoAdminToggle', panel: document.getElementById('promoAdminToggle')?.closest('.admin-section') }
    ];

    toggles.forEach(({ toggle, panel }) => {
        const btn = document.getElementById(toggle);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('open');
            });
        }
    });
}

// ====================================
// FORMULAIRES
// ====================================
function initForms() {
    // Event Form
    const eventForm = document.getElementById('eventForm');
    eventForm?.addEventListener('submit', handleEventSubmit);

    // Article Form
    const articleForm = document.getElementById('articleForm');
    articleForm?.addEventListener('submit', handleArticleSubmit);

    // Promo Form
    const promoForm = document.getElementById('promoForm');
    promoForm?.addEventListener('submit', handlePromoSubmit);
}

// ====================================
// ÉVÉNEMENTS
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

    const events = getEvents();
    events.unshift(event);
    localStorage.setItem('montblanc_events', JSON.stringify(events));

    e.target.reset();
    document.getElementById('eventAdminToggle')?.closest('.admin-section')?.classList.remove('open');

    renderEvents();
    showToast('Événement publié avec succès !', 'success');
}

function getEvents() {
    return JSON.parse(localStorage.getItem('montblanc_events') || '[]');
}

function deleteEvent(id) {
    const events = getEvents().filter(e => e.id !== id);
    localStorage.setItem('montblanc_events', JSON.stringify(events));
    renderEvents();
    showToast('Événement supprimé', 'success');
}

function renderEvents() {
    const eventsPreview = document.getElementById('eventsPreview');
    const eventsList = document.getElementById('eventsList');
    const featuredEvent = document.getElementById('featuredEvent');
    const events = getEvents();

    // Preview (index page) - max 3
    if (eventsPreview) {
        if (events.length === 0) {
            eventsPreview.innerHTML = createEmptyState('calendar', 'Aucun événement', 'Les prochaines soirées apparaîtront ici');
        } else {
            eventsPreview.innerHTML = events.slice(0, 3).map((e, i) => createEventCard(e, false, i)).join('');
        }
    }

    // Full list (events page)
    if (eventsList) {
        if (events.length === 0) {
            eventsList.innerHTML = createEmptyState('calendar', 'Aucun événement programmé', 'Publiez votre première soirée ci-dessus');
        } else {
            eventsList.innerHTML = events.map((e, i) => createEventCard(e, true, i)).join('');
        }
    }

    // Featured event
    if (featuredEvent && events.length > 0) {
        const featured = events[0];
        featuredEvent.innerHTML = `
            <div class="featured-card">
                <div class="featured-info">
                    <span class="featured-badge">À venir</span>
                    <h2 class="featured-title">${escapeHtml(featured.title)}</h2>
                    <p class="featured-description">${escapeHtml(featured.description)}</p>
                    <div class="event-meta">
                        <div class="event-meta-item">📅 ${formatDate(featured.date)}</div>
                        <div class="event-meta-item">🕐 ${featured.time}</div>
                        ${featured.dj ? `<div class="event-meta-item">🎧 ${escapeHtml(featured.dj)}</div>` : ''}
                        ${featured.price ? `<div class="event-meta-item">💰 ${escapeHtml(featured.price)}</div>` : ''}
                    </div>
                    <button class="btn btn-primary" onclick="showEventDetails(${featured.id})">Plus d'infos</button>
                </div>
                <div class="featured-image">
                    <span>🎉</span>
                </div>
            </div>
        `;
    } else if (featuredEvent) {
        featuredEvent.innerHTML = '';
    }
}

// Event preview images based on keywords
const eventImages = [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    'https://images.unsplash.com/photo-1571266028243-d8ba36b745?w=600&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80'
];

function getEventImage(index) {
    return eventImages[index % eventImages.length];
}

function createEventCard(event, showDelete = false, index = 0) {
    const imageUrl = event.image || getEventImage(index);
    return `
        <div class="event-card-new snow-frame">
            <div class="event-card-image">
                <img src="${imageUrl}" alt="${escapeHtml(event.title)}" loading="lazy">
                <span class="event-card-date-overlay">📅 ${formatDateShort(event.date)}</span>
                <div class="snow-corner snow-corner-tl"></div>
                <div class="snow-corner snow-corner-tr"></div>
            </div>
            <div class="event-card-body" style="padding: 1.5rem;">
                <h3 class="event-title" style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">${escapeHtml(event.title)}</h3>
                <p class="event-time" style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 1rem;">🕐 ${event.time}</p>
                <p class="event-description">${escapeHtml(truncate(event.description, 100))}</p>
                <div class="event-meta" style="margin: 1rem 0;">
                    ${event.dj ? `<span class="event-meta-item">🎧 ${escapeHtml(event.dj)}</span>` : ''}
                    ${event.price ? `<span class="event-meta-item">💰 ${escapeHtml(event.price)}</span>` : ''}
                </div>
                <div class="event-actions">
                    <button class="event-btn event-btn-primary" onclick="showEventDetails(${event.id})">Réserver</button>
                    ${showDelete ? `<button class="event-btn event-btn-delete" onclick="deleteEvent(${event.id})">✕</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function showEventDetails(id) {
    const event = getEvents().find(e => e.id === id);
    if (!event) return;

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <span class="featured-badge" style="margin-bottom: 1rem; display: inline-block;">Événement</span>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 1rem;">${escapeHtml(event.title)}</h2>
        <div class="event-meta" style="margin-bottom: 1.5rem;">
            <div class="event-meta-item">📅 ${formatDate(event.date)}</div>
            <div class="event-meta-item">🕐 ${event.time}</div>
            ${event.dj ? `<div class="event-meta-item">🎧 ${escapeHtml(event.dj)}</div>` : ''}
            ${event.price ? `<div class="event-meta-item">💰 ${escapeHtml(event.price)}</div>` : ''}
        </div>
        <p style="color: var(--text-secondary); line-height: 1.8;">${escapeHtml(event.description)}</p>
    `;

    openModal();
}

// ====================================
// ARTICLES
// ====================================
function handleArticleSubmit(e) {
    e.preventDefault();

    const article = {
        id: Date.now(),
        title: document.getElementById('articleTitle').value,
        category: document.getElementById('articleCategory').value,
        content: document.getElementById('articleContent').value,
        author: document.getElementById('articleAuthor').value || 'Mont Blanc',
        createdAt: new Date().toISOString()
    };

    const articles = getArticles();
    articles.unshift(article);
    localStorage.setItem('montblanc_articles', JSON.stringify(articles));

    e.target.reset();
    document.getElementById('articleAdminToggle')?.closest('.admin-section')?.classList.remove('open');

    renderArticles();
    showToast('Article publié avec succès !', 'success');
}

function getArticles() {
    return JSON.parse(localStorage.getItem('montblanc_articles') || '[]');
}

function deleteArticle(id) {
    const articles = getArticles().filter(a => a.id !== id);
    localStorage.setItem('montblanc_articles', JSON.stringify(articles));
    renderArticles();
    showToast('Article supprimé', 'success');
}

function renderArticles(filter = 'all') {
    const articlesPreview = document.getElementById('articlesPreview');
    const articlesList = document.getElementById('articlesList');
    const featuredArticle = document.getElementById('featuredArticle');
    let articles = getArticles();

    if (filter !== 'all') {
        articles = articles.filter(a => a.category === filter);
    }

    // Preview (index page) - max 3
    if (articlesPreview) {
        const allArticles = getArticles();
        if (allArticles.length === 0) {
            articlesPreview.innerHTML = createEmptyState('newspaper', 'Aucun article', 'Les actualités apparaîtront ici');
        } else {
            articlesPreview.innerHTML = allArticles.slice(0, 3).map((a, i) => createArticleCard(a, false, i)).join('');
        }
    }

    // Full list (articles page)
    if (articlesList) {
        if (articles.length === 0) {
            articlesList.innerHTML = createEmptyState('newspaper', 'Aucun article', 'Publiez votre premier article ci-dessus');
        } else {
            articlesList.innerHTML = articles.map((a, i) => createArticleCard(a, true, i)).join('');
        }
    }

    // Featured article
    if (featuredArticle && articles.length > 0) {
        const featured = articles[0];
        featuredArticle.innerHTML = `
            <div class="featured-card">
                <div class="featured-info">
                    <span class="article-category ${featured.category}">${getCategoryLabel(featured.category)}</span>
                    <h2 class="featured-title">${escapeHtml(featured.title)}</h2>
                    <p class="featured-description">${escapeHtml(truncate(featured.content, 200))}</p>
                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;">
                        Par ${escapeHtml(featured.author)} • ${formatDateShort(featured.createdAt)}
                    </p>
                    <button class="btn btn-primary" onclick="showArticleDetails(${featured.id})">Lire l'article</button>
                </div>
                <div class="featured-image">
                    <span>${getCategoryIcon(featured.category)}</span>
                </div>
            </div>
        `;
    } else if (featuredArticle) {
        featuredArticle.innerHTML = '';
    }
}

// Article media (images and videos)
const articleMedia = {
    news: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80' }
    ],
    interview: [
        { type: 'video', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80', poster: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' }
    ],
    review: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&q=80' },
        { type: 'video', url: 'https://images.unsplash.com/photo-1571266028243-d8ba36b745?w=600&q=80', poster: 'https://images.unsplash.com/photo-1571266028243-d8ba36b745?w=600&q=80' }
    ],
    announcement: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80' }
    ]
};

function getArticleMedia(category, index) {
    const media = articleMedia[category] || articleMedia.news;
    return media[index % media.length];
}

function getArticleLikes(articleId) {
    const likes = JSON.parse(localStorage.getItem('montblanc_likes') || '{}');
    return likes[articleId] || { count: Math.floor(Math.random() * 50) + 10, liked: false };
}

function toggleArticleLike(articleId) {
    const likes = JSON.parse(localStorage.getItem('montblanc_likes') || '{}');
    if (!likes[articleId]) {
        likes[articleId] = { count: Math.floor(Math.random() * 50) + 10, liked: false };
    }

    likes[articleId].liked = !likes[articleId].liked;
    likes[articleId].count += likes[articleId].liked ? 1 : -1;

    localStorage.setItem('montblanc_likes', JSON.stringify(likes));

    // Update UI
    const btn = document.querySelector(`[data-article-id="${articleId}"]`);
    if (btn) {
        btn.classList.toggle('liked', likes[articleId].liked);
        btn.querySelector('.heart').textContent = likes[articleId].liked ? '❤️' : '🤍';
        const countEl = btn.previousElementSibling;
        if (countEl) countEl.textContent = likes[articleId].count;
    }

    return likes[articleId];
}

function createArticleCard(article, showDelete = false, index = 0) {
    const media = article.media || getArticleMedia(article.category, index);
    const likesData = getArticleLikes(article.id);
    const isVideo = media.type === 'video';

    return `
        <div class="article-card-media snow-frame" data-category="${article.category}">
            <div class="article-media-container">
                ${isVideo ? `
                    <img src="${media.poster || media.url}" alt="${escapeHtml(article.title)}" loading="lazy">
                    <div class="article-video-indicator">▶</div>
                ` : `
                    <img src="${media.url}" alt="${escapeHtml(article.title)}" loading="lazy">
                `}
                <div class="article-media-overlay"></div>
                <span class="article-like-count">${likesData.count}</span>
                <button class="article-like-btn ${likesData.liked ? 'liked' : ''}" data-article-id="${article.id}" onclick="toggleArticleLike(${article.id})">
                    <span class="heart">${likesData.liked ? '❤️' : '🤍'}</span>
                </button>
                <div class="snow-corner snow-corner-tl"></div>
                <div class="snow-corner snow-corner-tr"></div>
            </div>
            <div class="article-card-content" style="padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <span class="article-category ${article.category}">${getCategoryLabel(article.category)}</span>
                    ${isVideo ? '<span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; font-size: 0.7rem;">📹 Vidéo</span>' : ''}
                </div>
                <h3 class="article-title" style="font-size: 1.3rem; margin-bottom: 0.5rem;">${escapeHtml(article.title)}</h3>
                <p class="article-excerpt" style="color: rgba(255,255,255,0.6); font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;">${escapeHtml(truncate(article.content, 80))}</p>
                <div class="article-footer" style="display: flex; justify-content: space-between; align-items: center; color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-bottom: 1rem;">
                    <span>Par ${escapeHtml(article.author)}</span>
                    <span>${formatDateShort(article.createdAt)}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="event-btn event-btn-primary" onclick="showArticleDetails(${article.id})" style="flex: 1;">${isVideo ? 'Regarder' : 'Lire'}</button>
                    ${showDelete ? `<button class="event-btn event-btn-delete" onclick="deleteArticle(${article.id})" style="flex: 0; padding: 0.75rem;">✕</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function showArticleDetails(id) {
    const article = getArticles().find(a => a.id === id);
    if (!article) return;

    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <span class="article-category ${article.category}" style="margin-bottom: 1rem; display: inline-block;">${getCategoryLabel(article.category)}</span>
        <h2 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 0.5rem;">${escapeHtml(article.title)}</h2>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 2rem;">
            Par ${escapeHtml(article.author)} • ${formatDateShort(article.createdAt)}
        </p>
        <div style="color: var(--text-secondary); line-height: 1.9; white-space: pre-wrap;">${escapeHtml(article.content)}</div>
    `;

    openModal();
}

function getCategoryLabel(cat) {
    const labels = { news: 'News', interview: 'Interview', review: 'Review', announcement: 'Annonce' };
    return labels[cat] || cat;
}

function getCategoryIcon(cat) {
    const icons = { news: '📰', interview: '🎤', review: '⭐', announcement: '📢' };
    return icons[cat] || '📄';
}

// ====================================
// PROMOTIONS
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

    const promos = getPromos();
    promos.unshift(promo);
    localStorage.setItem('montblanc_promos', JSON.stringify(promos));

    e.target.reset();
    document.getElementById('promoAdminToggle')?.closest('.admin-section')?.classList.remove('open');

    renderPromos();
    showToast('Promotion publiée avec succès !', 'success');
}

function getPromos() {
    return JSON.parse(localStorage.getItem('montblanc_promos') || '[]');
}

function deletePromo(id) {
    const promos = getPromos().filter(p => p.id !== id);
    localStorage.setItem('montblanc_promos', JSON.stringify(promos));
    renderPromos();
    showToast('Promotion supprimée', 'success');
}

function renderPromos() {
    const promoBanners = document.getElementById('promoBanners');
    const promosGrid = document.getElementById('promosGrid');
    const promos = getPromos();

    // Promo banners (first promo with code)
    if (promoBanners) {
        const bannerPromos = promos.filter(p => p.code).slice(0, 2);
        if (bannerPromos.length > 0) {
            promoBanners.innerHTML = bannerPromos.map(p => `
                <div class="promo-banner-card">
                    <div class="promo-banner-info">
                        <h3>${escapeHtml(p.title)}</h3>
                        <p>${escapeHtml(p.description)}</p>
                    </div>
                    <div class="promo-code-display" onclick="copyPromoCode('${escapeHtml(p.code)}')">${escapeHtml(p.code)}</div>
                </div>
            `).join('');
        } else {
            promoBanners.innerHTML = '';
        }
    }

    // Promos grid
    if (promosGrid) {
        if (promos.length === 0) {
            promosGrid.innerHTML = createEmptyState('gift', 'Aucune promotion', 'Ajoutez vos offres spéciales ci-dessus');
        } else {
            promosGrid.innerHTML = promos.map(p => createPromoCard(p)).join('');
        }
    }
}

function createPromoCard(promo) {
    return `
        <div class="promo-card">
            <span class="promo-card-badge">PROMO</span>
            <h3 class="promo-card-title">${escapeHtml(promo.title)}</h3>
            <p class="promo-card-description">${escapeHtml(promo.description)}</p>
            ${promo.code ? `<div class="promo-card-code" onclick="copyPromoCode('${escapeHtml(promo.code)}')">${escapeHtml(promo.code)}</div>` : ''}
            ${promo.expiry ? `<p class="promo-card-expiry">⏰ Expire le ${formatDateShort(promo.expiry)}</p>` : ''}
            <button class="event-btn event-btn-delete" onclick="deletePromo(${promo.id})" style="width: 100%; margin-top: 1rem;">Supprimer</button>
        </div>
    `;
}

function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast('Code copié : ' + code, 'success');
    }).catch(() => {
        showToast('Impossible de copier', 'error');
    });
}

// ====================================
// FILTRES
// ====================================
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderArticles(btn.dataset.filter);
        });
    });
}

// ====================================
// CONTACT FORM
// ====================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message envoyé ! Nous vous répondrons rapidement.', 'success');
        form.reset();
    });
}

// ====================================
// MODAL
// ====================================
function initModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.querySelector('.modal-overlay');

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal() {
    document.getElementById('modal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal')?.classList.remove('active');
    document.body.style.overflow = '';
}

// ====================================
// CHARGEMENT DU CONTENU
// ====================================
function loadContent() {
    // Load demo content first time
    if (!localStorage.getItem('montblanc_demo_v2')) {
        loadDemoContent();
        localStorage.setItem('montblanc_demo_v2', 'true');
    }

    renderEvents();
    renderArticles();
    renderPromos();
}

function loadDemoContent() {
    const demoEvents = [
        {
            id: Date.now() + 1,
            title: 'Nuit Électronique',
            date: getNextSaturday(),
            time: '23:00',
            description: 'Une soirée électro exceptionnelle avec les meilleurs DJs de la région. Système son dernière génération, light show spectaculaire et ambiance garantie jusqu\'au bout de la nuit. Dress code : élégant.',
            dj: 'DJ STORM & LUNA',
            price: '15€ (gratuit avant minuit)',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            title: 'White Party',
            date: getNextFriday(),
            time: '22:00',
            description: 'Tout le monde en blanc pour cette soirée exceptionnelle. Cocktails spéciaux, photographe officiel et surprises toute la nuit. La soirée incontournable de la saison.',
            dj: 'RESIDENT DJS',
            price: '10€',
            createdAt: new Date().toISOString()
        }
    ];

    const demoArticles = [
        {
            id: Date.now() + 3,
            title: 'Le Mont Blanc fait peau neuve',
            category: 'news',
            content: 'Après plusieurs mois de travaux, votre discothèque préférée rouvre ses portes avec un tout nouveau look.\n\nNouveau système son Funktion-One, éclairage LED dernière génération avec DMX intelligent, et une décoration totalement repensée par un designer parisien.\n\nLe bar a également été agrandi pour un service plus rapide, et nous avons créé un nouvel espace VIP avec vue panoramique sur le dancefloor.\n\nVenez découvrir le nouveau visage du Mont Blanc dès ce week-end !',
            author: 'L\'équipe',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 4,
            title: 'Interview exclusive avec DJ Storm',
            category: 'interview',
            content: 'Nous avons rencontré DJ Storm, notre résident depuis 5 ans, pour parler de son parcours et de ses projets.\n\n"Le Mont Blanc, c\'est ma deuxième maison. J\'ai vu ce club évoluer et grandir, et je suis fier d\'en faire partie."\n\nDJ Storm nous parle de ses influences, de la scène électro locale et de ses projets pour les mois à venir, notamment une collaboration internationale qui devrait faire parler d\'elle.',
            author: 'Marie L.',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 5,
            title: 'Retour sur la soirée d\'ouverture',
            category: 'review',
            content: 'La soirée d\'inauguration a été un succès total ! Plus de 800 personnes ont répondu présent pour découvrir le nouveau Mont Blanc.\n\nAmbiance de folie, son parfait et service irréprochable : tous les ingrédients étaient réunis pour une nuit mémorable.',
            author: 'Rédaction',
            createdAt: new Date().toISOString()
        }
    ];

    const demoPromos = [
        {
            id: Date.now() + 6,
            title: 'Happy Hour Extended',
            description: 'Tous les vendredis, profitez de notre happy hour prolongé jusqu\'à 1h du matin ! Cocktails signatures et shots premium à -50%.',
            code: 'HAPPY50',
            expiry: getDateInFuture(30),
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 7,
            title: 'Soirée Anniversaire',
            description: 'C\'est ton anniversaire ce mois-ci ? Entrée gratuite + une bouteille offerte pour toi et tes amis sur présentation de ta pièce d\'identité.',
            code: '',
            expiry: '',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 8,
            title: 'Pack VIP Week-end',
            description: 'Réservez votre carré VIP pour 4 personnes minimum et bénéficiez d\'une bouteille de champagne offerte.',
            code: 'VIP2024',
            expiry: getDateInFuture(60),
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('montblanc_events', JSON.stringify(demoEvents));
    localStorage.setItem('montblanc_articles', JSON.stringify(demoArticles));
    localStorage.setItem('montblanc_promos', JSON.stringify(demoPromos));
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

function truncate(text, max) {
    if (!text) return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getNextSaturday() {
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    return d.toISOString().split('T')[0];
}

function getNextFriday() {
    const d = new Date();
    d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7));
    return d.toISOString().split('T')[0];
}

function getDateInFuture(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

function createEmptyState(icon, title, subtitle) {
    const icons = { calendar: '📅', newspaper: '📰', gift: '🎁' };
    return `
        <div class="empty-state">
            <div class="empty-state-icon">${icons[icon] || '📌'}</div>
            <p class="empty-state-text">${title}</p>
            <p class="empty-state-subtext">${subtitle}</p>
        </div>
    `;
}

// ====================================
// TOAST
// ====================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ====================================
// EXPOSER FONCTIONS GLOBALES
// ====================================
window.deleteEvent = deleteEvent;
window.deleteArticle = deleteArticle;
window.deletePromo = deletePromo;
window.showEventDetails = showEventDetails;
window.showArticleDetails = showArticleDetails;
window.copyPromoCode = copyPromoCode;
window.toggleArticleLike = toggleArticleLike;
window.showToast = showToast;
