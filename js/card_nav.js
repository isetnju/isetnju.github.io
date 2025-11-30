const nav = document.querySelector('#nav');
const indicator = nav.querySelector('#indicator');
const links = Array.from(nav.querySelectorAll('a'));

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

