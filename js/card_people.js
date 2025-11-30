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
        console.log(teacher);
        const teacherItem = createTeacherItem(
            teacher.PHOTO_PATH,
            teacher.NAME,
            teacher.TITLE,
            teacher.HOMEPAGE_URL
        );
        cardContent.appendChild(teacherItem);
    });
}

(async () => {
    const allPeople = await loadCSVs(people_files);
    addMultipleTeachers(allPeople[0]);
})();
