function getAuthorsStr(authors, equalContributor, correspondence) {
    authors = authors.split(';').map(s => s.trim());
    equalContributor = equalContributor ? equalContributor.split(';').map(s => s.trim()) : [];
    correspondence = correspondence ? correspondence.split(';').map(s => s.trim()) : [];

    const authorsStr = authors.map(author => {
        let formatted = author;
        if (equalContributor.includes(author)) {
            formatted += '*';
        }
        if (correspondence.includes(author)) {
            formatted += '<sup>✉</sup>';
        }
        return formatted;
    }).join(', ');
    return authorsStr;
}

function createPreprintItem(title, authors, equalContributor, correspondence) {
    const paperLi = document.createElement('li');
    paperLi.innerHTML = `<a class="paper-title">${title}</a>`;
    paperLi.innerHTML += `<br>`;
    paperLi.innerHTML += getAuthorsStr(authors, equalContributor, correspondence);
    return paperLi;
}

function createConferenceItem(conferenceId, conferenceYear, title, authors, equalContributor, correspondence, pubName, pubLevel) {
    const paperLi = document.createElement('li');
    paperLi.innerHTML = `<a class="pub-badge">[${conferenceId}-${conferenceYear}]</a> `;
    paperLi.innerHTML += `<a class="paper-title">${title}</a>`;
    paperLi.innerHTML += `<br>`;
    paperLi.innerHTML += getAuthorsStr(authors, equalContributor, correspondence);
    paperLi.innerHTML += `<br>`;
    if (pubLevel) {
        paperLi.innerHTML += `<a class="pub-info">${pubName} (<b class="pub-id">${conferenceId}</b>, <b class="pub-level">${pubLevel}</b>), ${conferenceYear}</a>`;
    } else {
        paperLi.innerHTML += `<a class="pub-info">${pubName} (<b class="pub-id">${conferenceId}</b>), ${conferenceYear}</a>`;
    }
    return paperLi;
}

function createJournalItem(journalId, title, authors, equalContributor, correspondence, pubName, pubLevel) {
    const paperLi = document.createElement('li');
    paperLi.innerHTML = `<a class="pub-badge">[${journalId}]</a> `;
    paperLi.innerHTML += `<a class="paper-title">${title}</a>`;
    paperLi.innerHTML += `<br>`;
    paperLi.innerHTML += getAuthorsStr(authors, equalContributor, correspondence);
    paperLi.innerHTML += `<br>`;
    if (pubLevel) {
        paperLi.innerHTML += `<a class="pub-info">${pubName} (<b class="pub-id">${journalId}</b>, <b class="pub-level">${pubLevel}</b>)</a>`;
    } else {
        paperLi.innerHTML += `<a class="pub-info">${pubName} (<b class="pub-id">${journalId}</b>)</a>`;
    }
    return paperLi;
}

function addPreprints(paperData) {
    const paperList = document.querySelector('#card_preprints .paper-list');
    paperList.innerHTML = '';

    paperData.forEach(paper => {
        const paperItem = createPreprintItem(
            paper.TITLE,
            paper.AUTHORS,
            paper.EQUAL_CONTRIBUTION,
            paper.CORRESPONDENCE
        );
        paperList.appendChild(paperItem);
    });
}

function addConference(paperData, pubInfo) {
    const paperList = document.querySelector('#card_conference .paper-list');
    paperList.innerHTML = '';

    paperData.forEach(paper => {
        const paperItem = createConferenceItem(
            paper.CONFERENCE_ID,
            paper.CONFERENCE_YEAR,
            paper.TITLE,
            paper.AUTHORS,
            paper.EQUAL_CONTRIBUTION,
            paper.CORRESPONDENCE,
            pubInfo[paper.CONFERENCE_ID].NAME,
            pubInfo[paper.CONFERENCE_ID].LEVEL
        );
        paperList.appendChild(paperItem);
    });
}

function addJournals(paperData, pubInfo) {
    const paperList = document.querySelector('#card_journal .paper-list');
    paperList.innerHTML = '';

    paperData.forEach(paper => {
        const paperItem = createJournalItem(
            paper.JOURNAL_ID,
            paper.TITLE,
            paper.AUTHORS,
            paper.EQUAL_CONTRIBUTION,
            paper.CORRESPONDENCE,
            pubInfo[paper.JOURNAL_ID].NAME,
            pubInfo[paper.JOURNAL_ID].LEVEL
        );
        paperList.appendChild(paperItem);
    });
}

(async () => {
    const paper_files = [
        'databases/publications/preprints.csv',
        'databases/publications/conferences.csv',
        'databases/publications/journals.csv',
        'databases/publications/journals_cn.csv',
    ];

    const allPapers = await loadCSVs(paper_files);
    const pubInfo = await loadCSVs(['databases/publications/pub_info.csv']);
    const pubInfoDict = pubInfo[0].reduce((acc, item) => {
        acc[item.ID] = item;
        return acc;
    }, {});

    addPreprints(allPapers[0].reverse());
    addConference(allPapers[1].reverse(), pubInfoDict);
    addJournals(allPapers[2].reverse(), pubInfoDict);
})();
