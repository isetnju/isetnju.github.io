function createTeacherItem(imgSrc, name, title, link = null) {
    const teacherDiv = document.createElement('div');
    teacherDiv.className = 'teacher-item';

    let imgHtml = `<img src="${imgSrc}" loading="lazy" decoding="async">`;
    let nameHtml = link ?
        `<a href="${link}" target="_blank" class="people-name">${name}</a>` :
        `<a class="people-name">${name}</a>`;

    teacherDiv.innerHTML = `
        ${imgHtml}
        <p>
            ${nameHtml}
            <br>
            <a class="people-title">（${title}）</a>
        </p>
    `;

    return teacherDiv;
}
function addMultipleTeachers(teachersData) {
    const cardContent = document.querySelector('#card_teachers .card-content.grid-card-content');

    cardContent.innerHTML = '';

    teachersData.forEach(teacher => {
        const teacherItem = createTeacherItem(
            teacher.PHOTO_PATH,
            teacher.NAME,
            teacher.TITLE,
            teacher.HOMEPAGE_URL
        );
        cardContent.appendChild(teacherItem);
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
    // console.log(studentDict);

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


(async () => {
    const allPeople = await loadCSVs(people_files);
    addMultipleTeachers(allPeople[0]);

    const separatedStudents = separateStudents(allPeople[1]);
    addCurrentPhdStudents(separatedStudents[2]);
    addCurrentMsStudents(separatedStudents[3]);
})();
