function addNlpResearches(researches, people) {
    const researchContent = document.querySelector('#card_research_nlp .card-content');
    researchContent.innerHTML = '<hr>';

    researches.forEach(research => {
        const researchItem = document.createElement('div');
        researchItem.className = 'research-item';
        researchItem.innerHTML += `<div class="research-title">${research.TITLE}</div>`;

        const leaders = research.LEADER ? research.LEADER.split(';').map(s => s.trim()) : [];
        const members = research.MEMBER ? research.MEMBER.split(';').map(s => s.trim()) : [];

        // 负责人 HTML
        const leadersHtml = leaders.map(name => {
            const title = people[name] || '';
            return `<a class="research-name">${name}</a>${title ? `（${title}）` : ''}`;
        }).join('、');

        // 添加到研究项
        researchItem.innerHTML += `<div><b>负责人：</b>${leadersHtml}</div>`;
        let membersHtml = '';
        if (members.length > 0) {
            membersHtml = members.map(name => {
                const title = people[name] || '';
                return `<a class="research-name">${name}</a>${title ? `（${title}）` : ''}`;
            }).join('、');
            researchItem.innerHTML += `<div><b>参与人：</b>${membersHtml}</div>`;
        }
        researchItem.innerHTML += `<div class="research-des">${research.DISCRIPTION}</div>`;
        researchContent.appendChild(researchItem);
        researchContent.innerHTML += '<hr>'
    });
}

function addCvResearches(researches, people) {
    const researchContent = document.querySelector('#card_research_cv .card-content');
    researchContent.innerHTML = '<hr>';

    researches.forEach(research => {
        const researchItem = document.createElement('div');
        researchItem.className = 'research-item';
        researchItem.innerHTML += `<div class="research-title">${research.TITLE}</div>`;

        const leaders = research.LEADER ? research.LEADER.split(';').map(s => s.trim()) : [];
        const members = research.MEMBER ? research.MEMBER.split(';').map(s => s.trim()) : [];

        // 负责人 HTML
        const leadersHtml = leaders.map(name => {
            const title = people[name] || '';
            return `<a class="research-name">${name}</a>${title ? `（${title}）` : ''}`;
        }).join('、');

        // 添加到研究项
        researchItem.innerHTML += `<div><b>负责人：</b>${leadersHtml}</div>`;
        let membersHtml = '';
        if (members.length > 0) {
            membersHtml = members.map(name => {
                const title = people[name] || '';
                return `<a class="research-name">${name}</a>${title ? `（${title}）` : ''}`;
            }).join('、');
            researchItem.innerHTML += `<div><b>参与人：</b>${membersHtml}</div>`;
        }
        researchItem.innerHTML += `<div class="research-des">${research.DISCRIPTION}</div>`;
        researchContent.appendChild(researchItem);
        researchContent.innerHTML += '<hr>'
    });
}

(async () => {
    const research_files = [
        'databases/researches/nlp.csv',
        'databases/researches/cv.csv',
    ];

    const allPeople = await loadCSVs(people_files);
    const separatedStudents = separateStudents(allPeople[1]);
    const teachers = Object.fromEntries(allPeople[0].map(item => [item.NAME, item.TITLE]));
    const phdStudents = Object.fromEntries(separatedStudents[2].map(item => [item.NAME, "博士生"]));
    const msStudents = Object.fromEntries(separatedStudents[3].map(item => [item.NAME, "硕士生"]));
    const allPeopleDict = { ...teachers, ...phdStudents, ...msStudents };

    const allResearches = await loadCSVs(research_files);
    addNlpResearches(allResearches[0], allPeopleDict);
    addCvResearches(allResearches[1], allPeopleDict);
})();
