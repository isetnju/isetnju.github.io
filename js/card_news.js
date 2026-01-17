const paper_files = [
    'databases/publications/conferences.csv',
    'databases/publications/journals.csv'
];

const people_files = [
    'databases/people/teachers.csv',
    'databases/people/students.csv'
];

const loadCSVs = files => Promise.all(
    files.map(file => new Promise((resolve, reject) =>
        Papa.parse(file, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: res => resolve(res.data),
            error: reject
        })
    ))
);

function processPapers(allPapers) {
    return allPapers
        .flat()
        .filter(p => p.MONTH && p.DAY && `${p.MONTH}`.trim() && `${p.DAY}`.trim())
        .map(p => {
            const AUTHORS = p.EQUAL_CONTRIBUTION && p.EQUAL_CONTRIBUTION.trim()
                ? p.EQUAL_CONTRIBUTION.split(';').map(s => s.trim())
                : (p.AUTHORS ? [p.AUTHORS.split(';')[0].trim()] : []);
            const idConf = p.CONFERENCE_ID === 'ACL Findings' ? 'ACL' : p.CONFERENCE_ID;
            const ID = idConf ? `${idConf} ${p.CONFERENCE_YEAR}` : (p.JOURNAL_ID || '');
            // 删除无用字段
            const { TITLE, CORRESPONDENCE, EQUAL_CONTRIBUTION, CONFERENCE_ID, CONFERENCE_YEAR, JOURNAL_ID, ...rest } = p;
            return { ...rest, AUTHORS, ID };
        });
}

function mergePapers(papers) {
    const merged = {};
    for (const p of papers) {
        const key = `${p.ID}-${p.YEAR}-${p.MONTH}-${p.DAY}`;
        if (!merged[key]) {
            merged[key] = { ...p, AUTHORS: [...p.AUTHORS], PAPER_COUNT: 1 };
        } else {
            merged[key].AUTHORS = Array.from(new Set([...merged[key].AUTHORS, ...p.AUTHORS]));
            merged[key].PAPER_COUNT++;
        }
    }
    return Object.values(merged).sort((a, b) =>
        (b.YEAR - a.YEAR) || (b.MONTH - a.MONTH) || (b.DAY - a.DAY)
    );
}

const formatPublicationDate = ({ YEAR, CONFERENCE_YEAR, MONTH, DAY }) =>
    `${YEAR || CONFERENCE_YEAR}-${String(MONTH || '01').padStart(2, '0')}-${String(DAY || '01').padStart(2, '0')}`;

function displayNews(publications, peopleEnCnDict) {
    const newsList = document.querySelector('.news-list');
    if (!newsList) return console.error('News list container not found');
    newsList.innerHTML = '';
    const dictOrder = Array.from(peopleEnCnDict.keys());
    publications.forEach(pub => {
        const li = document.createElement('li');
        li.className = 'news-item';
        const date = document.createElement('span');
        date.className = 'news-date';
        date.textContent = formatPublicationDate(pub);
        const text = document.createElement('span');
        text.className = 'news-text';
        const authorsCn = dictOrder.filter(en => pub.AUTHORS.includes(en)).map(en => peopleEnCnDict.get(en));
        text.innerHTML = `🎉 本课题组<b>共 ${pub.PAPER_COUNT} 篇</b>论文被 <b>${pub.ID}</b> 接受！恭喜<b>${authorsCn.join('、')}</b>及其他合作者！`;
        li.append(date, text);
        newsList.appendChild(li);
    });
}

function filterPeople(people) {
    const teachers = people[0].map(({ TITLE, HOMEPAGE_URL, PHOTO_PATH, ...rest }) => rest);
    const teacherNames = new Set(teachers.map(t => t.NAME));
    const degreeOrder = ['D', 'M'];
    const class2Order = v => (v === 0 || v === '0') ? 0 : (v == null ? 1 : ((v === 1 || v === '1') ? 2 : 3));
    const students = people[1]
        .map(({ DESTINATION_YEAR, HOMEPAGE_URL, GRADUATION_YEAR, ...rest }) => rest)
        .filter(s => s.ENROLLMENT !== null && s.NAME_EN !== null && !teacherNames.has(s.NAME))
        .sort((a, b) => {
            const degA = degreeOrder.indexOf(a.DEGREE), degB = degreeOrder.indexOf(b.DEGREE);
            if (degA !== degB) return degA - degB;
            if (a.ENROLLMENT !== b.ENROLLMENT) return a.ENROLLMENT - b.ENROLLMENT;
            if (a.DEGREE === 'D') return class2Order(a.CLASS) - class2Order(b.CLASS);
            return 0;
        })
        .map(({ DEGREE, CLASS, ENROLLMENT, ...rest }) => rest);
    const all = [...students, ...teachers];
    return new Map(all.map(item => [item.NAME_EN, item.NAME]));
}

const maxVisibleItems = 10;
let isExpanded = false;

(async () => {
    const allPapers = await loadCSVs(paper_files);
    const allPeople = await loadCSVs(people_files);
    const processed = processPapers(allPapers);
    const merged = mergePapers(processed);
    const peopleEnCnDict = filterPeople(allPeople);
    displayNews(merged, peopleEnCnDict);

    const toggleButton = document.getElementById('btn-show-all-news');
    const allNewsItems = document.querySelectorAll('.news-item');
    if (allNewsItems.length <= maxVisibleItems) {
        toggleButton.style.display = 'none';
    }
    for (let i = maxVisibleItems; i < allNewsItems.length; i++) {
        allNewsItems[i].style.display = 'none';
    }

    function handleToggleClick() {
        isExpanded = !isExpanded;
        for (let i = maxVisibleItems; i < allNewsItems.length; i++) {
            allNewsItems[i].style.display = isExpanded ? '' : 'none';
        }
        toggleButton.innerHTML = isExpanded ? '▲ 收起部分消息' : '▼ 查看全部消息';
    }
    toggleButton.addEventListener('click', handleToggleClick);
})();
