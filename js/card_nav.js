const nav = document.querySelector('#nav');
const header = document.querySelector('#card_header');
const indicator = nav.querySelector('#indicator');
const links = Array.from(nav.querySelectorAll('a'));
const compactEnterMinScrollY = 260;
const compactExitScrollY = 12;
const compactTransitionMs = 280;
let isHeaderCompact = false;
let isHeaderTransitioning = false;
let headerTransitionTimer = null;
let scrollTicking = false;

function activeCards(navId) {
    const navActiveCards = {
        'home': ['intro', 'news', 'photo'],
        'research': ['research_nlp', 'research_cv'],
        'pub': ['preprints', 'conference', 'journal', 'journal_cn'],
        'people': ['teachers', 'phd_students', 'ms_students', 'graduation'],
        'album': ['album'],
    }
    Object.keys(navActiveCards).forEach(key => {
        const isVisible = (key === navId);
        navActiveCards[key].forEach(id => {
            const cardElement = document.getElementById('card_' + id);
            if (cardElement) {
                cardElement.hidden = !isVisible;
            }
        });
    });
}

function positionIndicator(activeEl) {
    if (!activeEl) return;
    const rect = activeEl.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const left = rect.left - navRect.left + nav.scrollLeft;
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${left}px)`;
}

function updateHeaderCompactState() {
    if (!header) return;
    if (isHeaderTransitioning) return;

    const compactEnterScrollY = Math.max(
        compactEnterMinScrollY,
        Math.round(header.getBoundingClientRect().height + 48)
    );
    const shouldCompact = isHeaderCompact
        ? window.scrollY > compactExitScrollY
        : window.scrollY > compactEnterScrollY;
    if (shouldCompact === isHeaderCompact) return;

    isHeaderCompact = shouldCompact;
    isHeaderTransitioning = true;
    header.classList.toggle('is-compact', isHeaderCompact);
    requestAnimationFrame(() => positionIndicator(nav.querySelector('a.active') || links[0]));
    window.setTimeout(() => positionIndicator(nav.querySelector('a.active') || links[0]), 240);
    window.clearTimeout(headerTransitionTimer);
    headerTransitionTimer = window.setTimeout(() => {
        isHeaderTransitioning = false;
        requestHeaderCompactUpdate();
    }, compactTransitionMs);
}

function requestHeaderCompactUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        updateHeaderCompactState();
        scrollTicking = false;
    });
}

function activateFromHash() {
    const hash = window.location.hash.substring(1);
    const validNavIds = ['home', 'research', 'pub', 'people', 'album'];

    if (hash && validNavIds.includes(hash)) {
        links.forEach(a => a.classList.remove('active'));
        const targetLink = document.getElementById(hash);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    } else {
        links[0].classList.add('active');
    }
}

activateFromHash();

positionIndicator(nav.querySelector('a.active') || links[0]);
activeCards(nav.querySelector('a.active').id || links[0].id)
updateHeaderCompactState();

links.forEach(link => {
    link.addEventListener('click', (e) => {
        // 如果你的页面已有对应链接，请删除下一行的 e.preventDefault()
        e.preventDefault();
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        positionIndicator(link);
        activeCards(link.id);
    });
});

window.addEventListener('scroll', requestHeaderCompactUpdate, { passive: true });
window.addEventListener('resize', () => {
    updateHeaderCompactState();
    positionIndicator(nav.querySelector('a.active') || links[0]);
});
