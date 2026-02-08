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
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Achievements (use bullet points with •)</small>
                        <button class="btn btn-link btn-sm p-0 text-info" onclick="enhanceItem('experiences', ${index}, 'desc')">
                            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> Auto-Enhance
                        </button>
                    </div>
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
                    <div class="d-flex justify-content-between align-items-center">
                         <small class="text-muted">Description (use bullet points with •)</small>
                         <button class="btn btn-link btn-sm p-0 text-info" onclick="enhanceItem('projects', ${index}, 'desc')">
                            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> Auto-Enhance
                        </button>
                    </div>
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
function exportAsPDF() {
    const element = document.getElementById('cvPage');
    const name = document.getElementById('inName').value || 'Resume';

    // Temporarily remove height restrictions
    const originalHeight = element.style.height;
    element.style.height = 'auto';

    const opt = {
        margin: 0,
        filename: `${name}_ATS_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Show loading
    Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    html2pdf().set(opt).from(element).save().then(() => {
        // Restore original height
        element.style.height = originalHeight;
        Swal.close(); // Close loading dialog
    }).catch(error => {
        element.style.height = originalHeight;
        Swal.fire('Error', 'Failed to generate PDF', 'error');
        console.error(error);
    });
}

function exportAsDOCX() {
    const name = document.getElementById('inName').value || 'Resume';
    const content = document.getElementById('cvPage').innerHTML;

    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${name} CV</title>
    <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; }
        h1 { font-size: 24pt; font-weight: bold; margin-bottom: 5px; }
        h4 { font-size: 14pt; margin-top: 5px; margin-bottom: 5px; color: #2c3e50; }
        .section-title { font-size: 12pt; font-weight: bold; border-bottom: 1px solid #000; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; }
        .experience-item, .education-item { margin-bottom: 15px; }
        .fw-bold { font-weight: bold; }
        .text-dark { color: #000; }
        .text-muted { color: #666; }
        ul { margin-top: 5px; padding-left: 20px; }
        li { margin-bottom: 2px; }
    </style>
    </head><body>`;
    const postHtml = "</body></html>";

    const html = preHtml + content + postHtml;

    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    saveAs(blob, `${name}_ATS_CV.doc`);
    Swal.fire('Success', 'Downloaded as Word Doc', 'success');
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

// AI and Settings Functions
function saveSettings() {
    const key = document.getElementById('geminiKeyInput').value.trim();
    if (setGeminiKey(key)) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
        Swal.fire('Success', 'API Key saved!', 'success');
    } else {
        Swal.fire('Error', 'Please enter a valid key', 'error');
    }
}

async function enhanceText(elementId, type) {
    const element = document.getElementById(elementId);
    const existingText = element.value;

    // Check if key is set
    if (!localStorage.getItem("gemini_key")) {
        new bootstrap.Modal(document.getElementById('settingsModal')).show();
        return;
    }

    const prompt = `Improve this ${type} for a professional CV. Keep it concise, action-oriented, and use strong keywords. Original text: "${existingText}"`;

    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    btn.disabled = true;

    try {
        const improvedText = await getGeminiResponse(prompt);
        element.value = improvedText;
        sync(); // Trigger sync to update preview
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

async function enhanceItem(section, index, field) {
    const existingText = cvData[section][index][field];

    if (!localStorage.getItem("gemini_key")) {
        new bootstrap.Modal(document.getElementById('settingsModal')).show();
        return;
    }

    const prompt = `Improve this ${section} description for a professional CV. Use bullet points (•). Keep it concise and use strong verbs. Original text: "${existingText}"`;

    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    btn.disabled = true;

    try {
        const improvedText = await getGeminiResponse(prompt);
        updateItem(section, index, field, improvedText);
        // Force re-render of inputs to show new text (since updateItem only syncs preview)
        // Actually updateItem calls sync which calls render..., so input should update if we re-render?
        // Wait, render functions recreate the inputs from cvData.
        // updateItem updates cvData and calls sync.
        // sync calls renderExperience etc.
        // So the input fields WILL be re-rendered with the new value.
        // But focus might be lost. That's a trade-off for now.
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    } finally {
        // Button is recreated by render, so we don't need to reset it here if render happened.
    }
}

// Auto-Save Functions
let autoSaveTimeout;
function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        localStorage.setItem('cvData_ats', JSON.stringify(cvData));
        localStorage.setItem('cvData_ats_meta', JSON.stringify({
            name: document.getElementById('inName').value,
            role: document.getElementById('inRole').value,
            email: document.getElementById('inEmail').value,
            phone: document.getElementById('inPhone').value,
            location: document.getElementById('inLocation').value,
            linkedin: document.getElementById('inLinkedIn').value,
            summary: document.getElementById('inSummary').value,
            skills: document.getElementById('inSkills').value
        }));
        const saveIndicator = document.getElementById('saveIndicator') || createSaveIndicator();
        saveIndicator.style.opacity = 1;
        setTimeout(() => saveIndicator.style.opacity = 0, 2000);
    }, 1000);
}

function createSaveIndicator() {
    const div = document.createElement('div');
    div.id = 'saveIndicator';
    div.innerText = 'Saved';
    div.style.position = 'fixed';
    div.style.bottom = '20px';
    div.style.right = '20px';
    div.style.background = '#28a745';
    div.style.color = 'white';
    div.style.padding = '5px 15px';
    div.style.borderRadius = '5px';
    div.style.opacity = 0;
    div.style.transition = 'opacity 0.5s';
    document.body.appendChild(div);
    return div;
}

function loadFromStorage() {
    const savedData = localStorage.getItem('cvData_ats');
    const savedMeta = localStorage.getItem('cvData_ats_meta');

    if (savedData && savedMeta) {
        Swal.fire({
            title: 'Resume Found',
            text: 'Do you want to continue your previous session?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Restore',
            cancelButtonText: 'No, Start Fresh'
        }).then((result) => {
            if (result.isConfirmed) {
                const data = JSON.parse(savedData);
                const meta = JSON.parse(savedMeta);

                cvData = data;

                document.getElementById('inName').value = meta.name || '';
                document.getElementById('inRole').value = meta.role || '';
                document.getElementById('inEmail').value = meta.email || '';
                document.getElementById('inPhone').value = meta.phone || '';
                document.getElementById('inLocation').value = meta.location || '';
                document.getElementById('inLinkedIn').value = meta.linkedin || '';
                document.getElementById('inSummary').value = meta.summary || '';
                document.getElementById('inSkills').value = meta.skills || '';

                if (cvData.profileImage) {
                    document.getElementById('previewImage').src = cvData.profileImage;
                    document.getElementById('previewImage').style.display = 'inline-block';
                    document.getElementById('placeholderImage').style.display = 'none';
                    document.getElementById('cvProfileImage').src = cvData.profileImage;
                    document.getElementById('profileImageContainer').style.display = 'block';
                    document.getElementById('removeBtn').style.display = 'inline-block';
                }

                sync();
            }
        });
    }
}

window.onload = function () {
    const key = localStorage.getItem("gemini_key");
    if (key) document.getElementById('geminiKeyInput').value = key;
    loadFromStorage();
    sync();
};

// Override sync to trigger autoSave
const originalSync = sync;
sync = function () {
    originalSync(); // Call the original sync logic (defined above)
    autoSave();
}