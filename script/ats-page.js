// Data Structure
let cvData = {
    experiences: [],
    education: [],
    certifications: [],
    projects: [],
    additional: [],
    profileImage: null
};

let cropper = null;
let cropModal = null;

// Profile Picture Handling
document.getElementById('imageInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById('cropImage').src = event.target.result;
            cropModal = new bootstrap.Modal(document.getElementById('cropModal'));
            cropModal.show();

            setTimeout(() => {
                if (cropper) cropper.destroy();
                cropper = new Cropper(document.getElementById('cropImage'), {
                    aspectRatio: 1,
                    viewMode: 2,
                    autoCropArea: 1,
                    responsive: true
                });
                lucide.createIcons();
            }, 200);
        };
        reader.readAsDataURL(file);
    }
});

function applyCrop() {
    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300
    });

    cvData.profileImage = canvas.toDataURL('image/jpeg', 0.9);

    document.getElementById('previewImage').src = cvData.profileImage;
    document.getElementById('previewImage').style.display = 'inline-block';
    document.getElementById('placeholderImage').style.display = 'none';

    document.getElementById('cvProfileImage').src = cvData.profileImage;
    document.getElementById('profileImageContainer').style.display = 'block';

    document.getElementById('removeBtn').style.display = 'inline-block';

    cropModal.hide();
}

function removeProfilePic() {
    cvData.profileImage = null;
    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('placeholderImage').style.display = 'inline-block';
    document.getElementById('profileImageContainer').style.display = 'none';
    document.getElementById('removeBtn').style.display = 'none';
    document.getElementById('imageInput').value = '';
}

// Sync Personal Info
function sync() {
    document.getElementById('outName').innerText = document.getElementById('inName').value;
    document.getElementById('outRole').innerText = document.getElementById('inRole').value;

    // Contact Info
    const contactParts = [];
    const email = document.getElementById('inEmail').value;
    const phone = document.getElementById('inPhone').value;
    const location = document.getElementById('inLocation').value;
    const linkedin = document.getElementById('inLinkedIn').value;

    if (email) contactParts.push(`<span>${email}</span>`);
    if (phone) contactParts.push(`<span>${phone}</span>`);
    if (location) contactParts.push(`<span>${location}</span>`);
    if (linkedin) contactParts.push(`<span>${linkedin}</span>`);

    document.getElementById('outContact').innerHTML = contactParts.join(' | ');

    // Summary
    const summary = document.getElementById('inSummary').value;
    if (summary.trim()) {
        document.getElementById('outSummary').innerText = summary;
        document.getElementById('summarySection').style.display = 'block';
    } else {
        document.getElementById('summarySection').style.display = 'none';
    }

    // Skills
    const skills = document.getElementById('inSkills').value.split(',').map(s => s.trim()).filter(s => s);
    if (skills.length > 0 && document.getElementById('inSkills').value.trim()) {
        document.getElementById('outSkills').innerHTML = skills.map(s => `<span class="ats-skill-item">${s}</span>`).join('');
        document.getElementById('skillsSection').style.display = 'block';
    } else {
        document.getElementById('skillsSection').style.display = 'none';
    }

    renderExperience();
    renderEducation();
    renderCertifications();
    renderProjects();
    renderAdditional();
    lucide.createIcons();
}

// Experience Functions
function renderExperience() {
    const list = document.getElementById('experienceList');
    const output = document.getElementById('outExperience');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.experiences.length === 0) {
        document.getElementById('experienceSection').style.display = 'none';
        return;
    }

    document.getElementById('experienceSection').style.display = 'block';

    cvData.experiences.forEach((exp, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${exp.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('experiences', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1 fw-bold" placeholder="Job Title" value="${exp.role}" onchange="updateItem('experiences', ${index}, 'role', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Company Name" value="${exp.company}" onchange="updateItem('experiences', ${index}, 'company', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Location" value="${exp.location || ''}" onchange="updateItem('experiences', ${index}, 'location', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Date (e.g., January 2024 - Present)" value="${exp.date}" onchange="updateItem('experiences', ${index}, 'date', this.value)">
                    <small class="text-muted">Achievements (use bullet points with •)</small>
                    <textarea class="form-control form-control-sm" rows="4" placeholder="• Achievement 1&#10;• Achievement 2" onchange="updateItem('experiences', ${index}, 'desc', this.value)">${exp.desc}</textarea>
                </div>`;

        output.innerHTML += `
                <div class="ats-item">
                    <div class="ats-item-header">
                        <div class="ats-item-title">${exp.role}</div>
                        <div class="ats-item-date">${exp.date}</div>
                    </div>
                    <div class="ats-item-subtitle">${exp.company}${exp.location ? ' | ' + exp.location : ''}</div>
                    <div class="ats-item-description" style="white-space: pre-line;">${exp.desc}</div>
                </div>`;
    });

    initSortable('experienceList', 'experiences');
}

function addExperience() {
    cvData.experiences.push({
        id: Date.now(),
        company: "Company Name",
        role: "Job Title",
        location: "City, Country",
        date: "Month Year - Present",
        desc: "• Key achievement or responsibility\n• Quantifiable result or impact\n• Technical skills utilized"
    });
    sync();
}

// Education Functions
function renderEducation() {
    const list = document.getElementById('educationList');
    const output = document.getElementById('outEducation');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.education.length === 0) {
        document.getElementById('educationSection').style.display = 'none';
        return;
    }

    document.getElementById('educationSection').style.display = 'block';

    cvData.education.forEach((edu, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${edu.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('education', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1 fw-bold" placeholder="Degree/Qualification" value="${edu.degree}" onchange="updateItem('education', ${index}, 'degree', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Institution Name" value="${edu.institution}" onchange="updateItem('education', ${index}, 'institution', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Location" value="${edu.location || ''}" onchange="updateItem('education', ${index}, 'location', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Graduation Date (e.g., May 2024)" value="${edu.date}" onchange="updateItem('education', ${index}, 'date', this.value)">
                    <input type="text" class="form-control form-control-sm" placeholder="GPA, Honors (optional)" value="${edu.desc || ''}" onchange="updateItem('education', ${index}, 'desc', this.value)">
                </div>`;

        output.innerHTML += `
                <div class="ats-item">
                    <div class="ats-item-header">
                        <div class="ats-item-title">${edu.degree}</div>
                        <div class="ats-item-date">${edu.date}</div>
                    </div>
                    <div class="ats-item-subtitle">${edu.institution}${edu.location ? ' | ' + edu.location : ''}</div>
                    ${edu.desc ? `<div class="ats-item-description">${edu.desc}</div>` : ''}
                </div>`;
    });

    initSortable('educationList', 'education');
}

function addEducation() {
    cvData.education.push({
        id: Date.now(),
        institution: "University Name",
        degree: "Bachelor of Science in Computer Science",
        location: "City, Country",
        date: "Month Year",
        desc: "GPA: 3.8/4.0"
    });
    sync();
}

// Certifications Functions
function renderCertifications() {
    const list = document.getElementById('certificationList');
    const output = document.getElementById('outCertifications');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.certifications.length === 0) {
        document.getElementById('certificationsSection').style.display = 'none';
        return;
    }

    document.getElementById('certificationsSection').style.display = 'block';

    cvData.certifications.forEach((cert, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${cert.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('certifications', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1 fw-bold" placeholder="Certification Name" value="${cert.name}" onchange="updateItem('certifications', ${index}, 'name', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Issuing Organization" value="${cert.issuer}" onchange="updateItem('certifications', ${index}, 'issuer', this.value)">
                    <input type="text" class="form-control form-control-sm" placeholder="Date Obtained" value="${cert.date}" onchange="updateItem('certifications', ${index}, 'date', this.value)">
                </div>`;

        output.innerHTML += `
                <div class="ats-item">
                    <div class="ats-item-header">
                        <div class="ats-item-title">${cert.name}</div>
                        <div class="ats-item-date">${cert.date}</div>
                    </div>
                    <div class="ats-item-subtitle">${cert.issuer}</div>
                </div>`;
    });

    initSortable('certificationList', 'certifications');
}

function addCertification() {
    cvData.certifications.push({
        id: Date.now(),
        name: "Certification Name",
        issuer: "Issuing Organization",
        date: "Month Year"
    });
    sync();
}

// Projects Functions
function renderProjects() {
    const list = document.getElementById('projectList');
    const output = document.getElementById('outProjects');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.projects.length === 0) {
        document.getElementById('projectsSection').style.display = 'none';
        return;
    }

    document.getElementById('projectsSection').style.display = 'block';

    cvData.projects.forEach((proj, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${proj.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('projects', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1 fw-bold" placeholder="Project Name" value="${proj.name}" onchange="updateItem('projects', ${index}, 'name', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Technologies Used" value="${proj.tech}" onchange="updateItem('projects', ${index}, 'tech', this.value)">
                    <small class="text-muted">Description (use bullet points with •)</small>
                    <textarea class="form-control form-control-sm" rows="3" placeholder="• Project description&#10;• Key features&#10;• Results/impact" onchange="updateItem('projects', ${index}, 'desc', this.value)">${proj.desc}</textarea>
                </div>`;

        output.innerHTML += `
                <div class="ats-item">
                    <div class="ats-item-title">${proj.name}</div>
                    <div class="ats-item-subtitle">${proj.tech}</div>
                    <div class="ats-item-description" style="white-space: pre-line;">${proj.desc}</div>
                </div>`;
    });

    initSortable('projectList', 'projects');
}

function addProject() {
    cvData.projects.push({
        id: Date.now(),
        name: "Project Name",
        tech: "Technologies Used",
        desc: "• Brief project description\n• Key features or achievements\n• Impact or results"
    });
    sync();
}

// Additional Sections Functions
function renderAdditional() {
    const list = document.getElementById('additionalList');
    const output = document.getElementById('outAdditional');
    list.innerHTML = '';
    output.innerHTML = '';

    cvData.additional.forEach((section, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${section.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('additional', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-2 fw-bold" placeholder="Section Title (e.g., Languages, Awards)" value="${section.title}" onchange="updateItem('additional', ${index}, 'title', this.value)">
                    <textarea class="form-control form-control-sm" rows="3" placeholder="Section Content" onchange="updateItem('additional', ${index}, 'content', this.value)">${section.content}</textarea>
                </div>`;

        output.innerHTML += `
                <div class="ats-section">
                    <div class="ats-section-title">${section.title.toUpperCase()}</div>
                    <div class="ats-item-description" style="white-space: pre-line;">${section.content}</div>
                </div>`;
    });

    initSortable('additionalList', 'additional');
}

function addAdditional() {
    cvData.additional.push({
        id: Date.now(),
        title: "Section Title",
        content: "Section content goes here..."
    });
    sync();
}

// Generic Functions
function updateItem(section, index, field, value) {
    cvData[section][index][field] = value;
    sync();
}

function removeItem(section, index) {
    cvData[section].splice(index, 1);
    sync();
}

function initSortable(elementId, dataKey) {
    const el = document.getElementById(elementId);
    if (!el || el.children.length === 0) return;

    new Sortable(el, {
        handle: '.handle',
        animation: 150,
        onEnd: function (evt) {
            const movedItem = cvData[dataKey].splice(evt.oldIndex, 1)[0];
            cvData[dataKey].splice(evt.newIndex, 0, movedItem);
            sync();
        }
    });
}

// Export Functions
async function exportAsPDF() {
    const { jsPDF } = window.jspdf;

    Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const cvElement = document.getElementById('cvPage');
        const canvas = await html2canvas(cvElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${document.getElementById('inName').value}_ATS_CV.pdf`);

        Swal.fire('Success!', 'PDF downloaded successfully', 'success');
    } catch (error) {
        Swal.fire('Error', 'Failed to generate PDF', 'error');
        console.error(error);
    }
}

async function exportAsDOCX() {
    Swal.fire({
        title: 'Generating DOCX...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        let docContent = `${document.getElementById('inName').value}\n`;
        docContent += `${document.getElementById('inRole').value}\n`;

        const email = document.getElementById('inEmail').value;
        const phone = document.getElementById('inPhone').value;
        const location = document.getElementById('inLocation').value;
        const linkedin = document.getElementById('inLinkedIn').value;

        const contacts = [email, phone, location, linkedin].filter(c => c).join(' | ');
        docContent += `${contacts}\n\n`;

        const summary = document.getElementById('inSummary').value;
        if (summary.trim()) {
            docContent += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
        }

        if (cvData.experiences.length > 0) {
            docContent += `PROFESSIONAL EXPERIENCE\n`;
            cvData.experiences.forEach(exp => {
                docContent += `${exp.role}\n`;
                docContent += `${exp.company}${exp.location ? ' | ' + exp.location : ''} | ${exp.date}\n`;
                docContent += `${exp.desc}\n\n`;
            });
        }

        if (cvData.education.length > 0) {
            docContent += `EDUCATION\n`;
            cvData.education.forEach(edu => {
                docContent += `${edu.degree}\n`;
                docContent += `${edu.institution}${edu.location ? ' | ' + edu.location : ''} | ${edu.date}\n`;
                if (edu.desc) docContent += `${edu.desc}\n`;
                docContent += '\n';
            });
        }

        const skills = document.getElementById('inSkills').value.trim();
        if (skills) {
            docContent += `SKILLS\n${skills}\n\n`;
        }

        if (cvData.certifications.length > 0) {
            docContent += `CERTIFICATIONS\n`;
            cvData.certifications.forEach(cert => {
                docContent += `${cert.name} | ${cert.issuer} | ${cert.date}\n`;
            });
            docContent += '\n';
        }

        if (cvData.projects.length > 0) {
            docContent += `PROJECTS\n`;
            cvData.projects.forEach(proj => {
                docContent += `${proj.name}\n${proj.tech}\n${proj.desc}\n\n`;
            });
        }

        cvData.additional.forEach(section => {
            docContent += `${section.title.toUpperCase()}\n${section.content}\n\n`;
        });

        const blob = new Blob([docContent], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        saveAs(blob, `${document.getElementById('inName').value}_ATS_CV.docx`);

        Swal.fire('Success!', 'DOCX downloaded successfully', 'success');
    } catch (error) {
        Swal.fire('Error', 'Failed to generate DOCX', 'error');
        console.error(error);
    }
}

function saveCV() {
    const data = {
        ...cvData,
        name: document.getElementById('inName').value,
        role: document.getElementById('inRole').value,
        email: document.getElementById('inEmail').value,
        phone: document.getElementById('inPhone').value,
        location: document.getElementById('inLocation').value,
        linkedin: document.getElementById('inLinkedIn').value,
        summary: document.getElementById('inSummary').value,
        skills: document.getElementById('inSkills').value
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'ats-cv-data.json');

    Swal.fire('Saved!', 'CV data saved successfully', 'success');
}

function loadCV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);

                cvData.experiences = data.experiences || [];
                cvData.education = data.education || [];
                cvData.certifications = data.certifications || [];
                cvData.projects = data.projects || [];
                cvData.additional = data.additional || [];
                cvData.profileImage = data.profileImage || null;

                document.getElementById('inName').value = data.name || '';
                document.getElementById('inRole').value = data.role || '';
                document.getElementById('inEmail').value = data.email || '';
                document.getElementById('inPhone').value = data.phone || '';
                document.getElementById('inLocation').value = data.location || '';
                document.getElementById('inLinkedIn').value = data.linkedin || '';
                document.getElementById('inSummary').value = data.summary || '';
                document.getElementById('inSkills').value = data.skills || '';

                if (cvData.profileImage) {
                    document.getElementById('previewImage').src = cvData.profileImage;
                    document.getElementById('previewImage').style.display = 'inline-block';
                    document.getElementById('placeholderImage').style.display = 'none';
                    document.getElementById('cvProfileImage').src = cvData.profileImage;
                    document.getElementById('profileImageContainer').style.display = 'block';
                    document.getElementById('removeBtn').style.display = 'inline-block';
                }

                sync();
                Swal.fire('Loaded!', 'CV data loaded successfully', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to load CV data', 'error');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

window.onload = sync;