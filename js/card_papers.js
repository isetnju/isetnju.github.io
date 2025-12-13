function createPreprintItem(title, authors, equalContributor, correspondence) {
    const peperLi = document.createElement('li');
    peperLi.innerHTML = `<a class="paper-title">${title}</a>`
    peperLi.innerHTML += `<br>`

    authors = authors.split(';').map(s => s.trim());
    equalContributor = equalContributor ? equalContributor.split(';').map(s => s.trim()) : [];
    correspondence = correspondence ? correspondence.split(';').map(s => s.trim()) : [];

    peperLi.innerHTML += authors.map(author => {
        let formatted = author;
        if (equalContributor.includes(author)) {
            formatted += '*';
        }
        if (correspondence.includes(author)) {
            formatted += '<sup>✉</sup>';
        }
        return formatted;
    }).join(', ');

    return peperLi;
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

function separateStudents(peopleData) {
    const graduatedPhd = [];
    const graduatedMs = [];
    const currentPhd = [];
    const currentMs = [];

    peopleData.forEach(person => {
        if (person.GRADUATION_YEAR && person.GRADUATION_YEAR !== '') {
            if (person.DEGREE === 'D') {
                graduatedPhd.push(person);
            } else if (person.DEGREE === 'M') {
                graduatedMs.push(person);
            }
        } else {
            if (person.DEGREE === 'D') {
                currentPhd.push(person);
            } else if (person.DEGREE === 'M') {
                currentMs.push(person);
            }
        }
    });
    return [graduatedPhd, graduatedMs, currentPhd, currentMs];
}

function addCurrentPhdStudents(studentData) {
    const studentDict = {};
    for (let i = 0; i < studentData.length; i++) {
        if (!studentDict[studentData[i].ENROLLMENT]) {
            studentDict[studentData[i].ENROLLMENT] = [];
        }
        studentDict[studentData[i].ENROLLMENT].push({
            NAME: studentData[i].NAME,
            HOMEPAGE_URL: studentData[i].HOMEPAGE_URL,
            CLASS: studentData[i].CLASS
        });
    }

    const studentList = document.querySelector('#card_phd_students .card-content');
    studentList.innerHTML = '';

    Object.keys(studentDict).sort().forEach(year => {
        const a = document.createElement('a');
        a.className = 'grade-separator';
        a.innerHTML = `${year} 级`
        studentList.appendChild(a);

        const div = document.createElement('div');
        div.className = 'grid-card-content';
        studentDict[year].forEach(std => {
            p = document.createElement('p');
            p.innerHTML = std.HOMEPAGE_URL ? `<a class="people-name" href="${std.HOMEPAGE_URL}" target="_blank">${std.NAME}</a>` : `<a class="people-name">${std.NAME}</a>`;
            if (std.CLASS !== null) {
                p.innerHTML += `<br> <a class="people-title">（${std.CLASS === 0 ? '硕博连读' : '直博'}）</a>`;
            }
            div.appendChild(p)
        });
        studentList.appendChild(div);
    })
}

function addCurrentMsStudents(studentData) {
    const studentDict = {};
    for (let i = 0; i < studentData.length; i++) {
        if (!studentDict[studentData[i].ENROLLMENT]) {
            studentDict[studentData[i].ENROLLMENT] = [];
        }
        studentDict[studentData[i].ENROLLMENT].push({
            NAME: studentData[i].NAME,
            HOMEPAGE_URL: studentData[i].HOMEPAGE_URL
        });
    }

    const studentList = document.querySelector('#card_ms_students .card-content');
    studentList.innerHTML = '';

    Object.keys(studentDict).sort().forEach(year => {
        const a = document.createElement('a');
        a.className = 'grade-separator';
        a.innerHTML = `${year} 级`
        studentList.appendChild(a);

        const div = document.createElement('div');
        div.className = 'grid-card-content';
        studentDict[year].forEach(std => {
            p = document.createElement('p');
            p.innerHTML = std.HOMEPAGE_URL ? `<a class="people-name" href="${std.HOMEPAGE_URL}" target="_blank">${std.NAME}</a>` : `<a class="people-name">${std.NAME}</a>`;
            div.appendChild(p)
        });
        studentList.appendChild(div);
    })
}

function addGraduatedPhdStudents(studentData) {
    const studentList = document.querySelector('#grad-phd-content');
    studentList.innerHTML = '';

    studentData.reverse().forEach(std => {
        p = document.createElement('p');
        p.innerHTML = std.HOMEPAGE_URL ? `<a class="people-name" href="${std.HOMEPAGE_URL}" target="_blank">${std.NAME}</a>` : `<a class="people-name">${std.NAME}</a>`;
        p.innerHTML += '<br>';
        p.innerHTML += `<a>${std.GRADUATION_YEAR}</a>`;
        p.innerHTML += '<br>';
        p.innerHTML += `<a class="people-title">（${std.DESTINATION}）</a>`
        studentList.appendChild(p);
    });
}

function addGraduatedMsStudents(studentData) {
    const studentList = document.querySelector('#grad-ms-content');
    studentList.innerHTML = '';

    studentData.reverse().forEach(std => {
        p = document.createElement('p');
        p.innerHTML = std.HOMEPAGE_URL ? `<a class="people-name" href="${std.HOMEPAGE_URL}" target="_blank">${std.NAME}</a>` : `<a class="people-name">${std.NAME}</a>`;
        p.innerHTML += '<br>';
        p.innerHTML += `<a>${std.GRADUATION_YEAR}</a>`;
        p.innerHTML += '<br>';
        p.innerHTML += `<a class="people-title">（${std.DESTINATION}）</a>`
        studentList.appendChild(p);
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
    addPreprints(allPapers[0]);
    // console.log(allPapers);
    // addMultipleTeachers(allPeople[0]);

    // const separatedStudents = separateStudents(allPeople[1]);
    // addGraduatedPhdStudents(separatedStudents[0]);
    // addGraduatedMsStudents(separatedStudents[1]);
    // addCurrentPhdStudents(separatedStudents[2]);
    // addCurrentMsStudents(separatedStudents[3]);
})();
