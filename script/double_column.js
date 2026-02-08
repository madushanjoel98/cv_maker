// Data Structure
let cvData = {
    experiences: [],
    education: [],
    achievements: [],
    activities: [],
    references: [],
    customSections: [],
    profileImage: null
};

let cropper = null;
let cropModal = null;
let cvColors = {
    sidebarBg: '#1e293b',
    sidebarText: '#ffffff',
    accent: '#3b82f6'
};

// Color Customization Functions
function updateColors() {
    cvColors.sidebarBg = document.getElementById('sidebarColor').value;
    cvColors.sidebarText = document.getElementById('sidebarTextColor').value;
    cvColors.accent = document.getElementById('accentColor').value;

    applyColors();
}

function applyColors() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.backgroundColor = cvColors.sidebarBg;
    sidebar.style.color = cvColors.sidebarText;

    // Update all sidebar text elements
    const sidebarTexts = sidebar.querySelectorAll('.section-title, #outContact, #outSkills, #outReferences, #outReferences *');
    sidebarTexts.forEach(el => {
        if (el.classList.contains('section-title')) {
            el.style.color = cvColors.sidebarText;
            el.style.borderColor = adjustColorOpacity(cvColors.sidebarText, 0.3);
        } else if (!el.classList.contains('badge')) {
            el.style.color = cvColors.sidebarText;
        }
    });

    // Update accent colors
    document.getElementById('outRole').style.color = cvColors.accent;
    document.querySelectorAll('.section-title').forEach(el => {
        if (!el.classList.contains('text-white')) {
            el.style.color = cvColors.accent;
        }
    });
    document.querySelectorAll('.text-primary').forEach(el => {
        el.style.color = cvColors.accent;
    });
    document.querySelectorAll('.badge').forEach(badge => {
        badge.style.backgroundColor = cvColors.accent;
    });

    // Update CSS variables
    document.documentElement.style.setProperty('--cv-sidebar-bg', cvColors.sidebarBg);
    document.documentElement.style.setProperty('--cv-accent', cvColors.accent);
}

function resetColors() {
    document.getElementById('sidebarColor').value = '#1e293b';
    document.getElementById('sidebarTextColor').value = '#ffffff';
    document.getElementById('accentColor').value = '#3b82f6';
    updateColors();
}

function adjustColorOpacity(color, opacity) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

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
    document.getElementById('cvProfileImage').style.display = 'inline-block';
    document.getElementById('cvPlaceholder').style.display = 'none';

    document.getElementById('removeBtn').style.display = 'inline-block';

    cropModal.hide();
}

function removeProfilePic() {
    cvData.profileImage = null;
    document.getElementById('previewImage').style.display = 'none';
    document.getElementById('placeholderImage').style.display = 'inline-block';
    document.getElementById('cvProfileImage').style.display = 'none';
    document.getElementById('cvPlaceholder').style.display = 'inline-block';
    document.getElementById('removeBtn').style.display = 'none';
    document.getElementById('imageInput').value = '';
}

// Sync Personal Info
function sync() {
    document.getElementById('outName').innerText = document.getElementById('inName').value;
    document.getElementById('outRole').innerText = document.getElementById('inRole').value;
    document.getElementById('outContact').innerText = document.getElementById('inContact').value;

    if (document.getElementById('inSummary') && document.getElementById('outSummary')) {
        const summary = document.getElementById('inSummary').value;
        if (summary) {
            document.getElementById('outSummary').innerHTML = `
                <div class="section-title"><i data-lucide="user" size="18"></i> Professional Summary</div>
                <p class="small text-muted">${summary}</p>
            `;
        } else {
            document.getElementById('outSummary').innerHTML = '';
        }
    }

    const skills = document.getElementById('inSkills').value.split(',');
    document.getElementById('outSkills').innerHTML = skills
        .map(s => `<span class="badge bg-primary fw-normal">${s.trim()}</span>`)
        .join('');

    renderExperience();
    renderEducation();
    renderAchievements();
    renderActivities();
    renderReferences();
    renderCustomSections();
    applyColors();
    lucide.createIcons();
}

// Experience Functions
function renderExperience() {
    const list = document.getElementById('experienceList');
    const output = document.getElementById('outExperience');
    list.innerHTML = '';
    output.innerHTML = '';

    cvData.experiences.forEach((exp, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${exp.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('experiences', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1 fw-bold" placeholder="Company" value="${exp.company}" onchange="updateItem('experiences', ${index}, 'company', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Role" value="${exp.role}" onchange="updateItem('experiences', ${index}, 'role', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Date" value="${exp.date}" onchange="updateItem('experiences', ${index}, 'date', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Date" value="${exp.date}" onchange="updateItem('experiences', ${index}, 'date', this.value)">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted">Description</small>
                         <button class="btn btn-link btn-sm p-0 text-info" onclick="enhanceItem('experiences', ${index}, 'desc')">
                            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI
                        </button>
                    </div>
                    <textarea class="form-control form-control-sm" placeholder="Description" onchange="updateItem('experiences', ${index}, 'desc', this.value)">${exp.desc}</textarea>
                </div>`;

        output.innerHTML += `
                <div class="experience-item">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>${exp.role}</span>
                        <span class="text-muted small">${exp.date}</span>
                    </div>
                    <div class="text-primary small mb-1">${exp.company}</div>
                    <p class="small text-muted mb-0">${exp.desc}</p>
                </div>`;
    });

    initSortable('experienceList', 'experiences');
}

function addExperience() {
    cvData.experiences.push({
        id: Date.now(),
        company: "Company Name",
        role: "Job Title",
        date: "2026",
        desc: "Brief description of responsibilities"
    });
    sync();
}

// Education Functions
function renderEducation() {
    const list = document.getElementById('educationList');
    const output = document.getElementById('outEducation');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.education.length === 0) return;

    cvData.education.forEach((edu, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${edu.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('education', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1 fw-bold" placeholder="Institution" value="${edu.institution}" onchange="updateItem('education', ${index}, 'institution', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Degree/Qualification" value="${edu.degree}" onchange="updateItem('education', ${index}, 'degree', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Year/Period" value="${edu.date}" onchange="updateItem('education', ${index}, 'date', this.value)">
                    <textarea class="form-control form-control-sm" placeholder="Additional details (GPA, honors, etc.)" onchange="updateItem('education', ${index}, 'desc', this.value)">${edu.desc || ''}</textarea>
                </div>`;

        output.innerHTML += `
                <div class="experience-item">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>${edu.degree}</span>
                        <span class="text-muted small">${edu.date}</span>
                    </div>
                    <div class="text-primary small mb-1">${edu.institution}</div>
                    ${edu.desc ? `<p class="small text-muted mb-0">${edu.desc}</p>` : ''}
                </div>`;
    });

    if (cvData.education.length > 0) {
        output.innerHTML = `
                    <div class="section-title"><i data-lucide="graduation-cap" size="18"></i> Education</div>
                    ${output.innerHTML}`;
    }

    initSortable('educationList', 'education');
}

function addEducation() {
    cvData.education.push({
        id: Date.now(),
        institution: "University/School Name",
        degree: "Degree/Qualification",
        date: "2020 - 2024",
        desc: ""
    });
    sync();
}

// Achievements Functions
function renderAchievements() {
    const list = document.getElementById('achievementList');
    const output = document.getElementById('outAchievements');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.achievements.length === 0) return;

    cvData.achievements.forEach((ach, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${ach.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('achievements', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Achievement Title" value="${ach.title}" onchange="updateItem('achievements', ${index}, 'title', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Achievement Title" value="${ach.title}" onchange="updateItem('achievements', ${index}, 'title', this.value)">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted">Description</small>
                         <button class="btn btn-link btn-sm p-0 text-info" onclick="enhanceItem('achievements', ${index}, 'desc')">
                            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI
                        </button>
                    </div>
                    <textarea class="form-control form-control-sm" placeholder="Description" onchange="updateItem('achievements', ${index}, 'desc', this.value)">${ach.desc}</textarea>
                </div>`;

        output.innerHTML += `<div class="small mb-2"><strong>• ${ach.title}:</strong> ${ach.desc}</div>`;
    });

    if (cvData.achievements.length > 0) {
        output.innerHTML = `
                    <div class="section-title"><i data-lucide="award" size="18"></i> Achievements</div>
                    ${output.innerHTML}`;
    }

    initSortable('achievementList', 'achievements');
}

function addAchievement() {
    cvData.achievements.push({
        id: Date.now(),
        title: "Achievement Title",
        desc: "Brief description"
    });
    sync();
}

// Activities Functions
function renderActivities() {
    const list = document.getElementById('activityList');
    const output = document.getElementById('outActivities');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.activities.length === 0) return;

    cvData.activities.forEach((act, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${act.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('activities', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Activity Name" value="${act.name}" onchange="updateItem('activities', ${index}, 'name', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Activity Name" value="${act.name}" onchange="updateItem('activities', ${index}, 'name', this.value)">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted">Description</small>
                         <button class="btn btn-link btn-sm p-0 text-info" onclick="enhanceItem('activities', ${index}, 'desc')">
                            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI
                        </button>
                    </div>
                    <textarea class="form-control form-control-sm" placeholder="Description" onchange="updateItem('activities', ${index}, 'desc', this.value)">${act.desc}</textarea>
                </div>`;

        output.innerHTML += `<div class="small mb-2"><strong>• ${act.name}:</strong> ${act.desc}</div>`;
    });

    if (cvData.activities.length > 0) {
        output.innerHTML = `
                    <div class="section-title"><i data-lucide="users" size="18"></i> Activities & Interests</div>
                    ${output.innerHTML}`;
    }

    initSortable('activityList', 'activities');
}

function addActivity() {
    cvData.activities.push({
        id: Date.now(),
        name: "Activity Name",
        desc: "Brief description"
    });
    sync();
}

// References Functions
function renderReferences() {
    const list = document.getElementById('referenceList');
    const output = document.getElementById('outReferences');
    list.innerHTML = '';
    output.innerHTML = '';

    if (cvData.references.length === 0) return;

    cvData.references.forEach((ref, index) => {
        list.innerHTML += `
                <div class="card card-body mb-2 border shadow-sm" data-id="${ref.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('references', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Name" value="${ref.name}" onchange="updateItem('references', ${index}, 'name', this.value)">
                    <input type="text" class="form-control form-control-sm mb-1" placeholder="Position" value="${ref.position}" onchange="updateItem('references', ${index}, 'position', this.value)">
                    <input type="text" class="form-control form-control-sm" placeholder="Contact" value="${ref.contact}" onchange="updateItem('references', ${index}, 'contact', this.value)">
                </div>`;

        output.innerHTML += `
                <div class="small mb-2">
                    <div class="fw-bold">${ref.name}</div>
                    <div class="opacity-75">${ref.position}</div>
                    <div class="opacity-75">${ref.contact}</div>
                </div>`;
    });

    if (cvData.references.length > 0) {
        output.innerHTML = `
            <div class="section-title text-white">References</div>
                ${output.innerHTML} `;
    }

    initSortable('referenceList', 'references');
}

function addReference() {
    cvData.references.push({
        id: Date.now(),
        name: "Reference Name",
        position: "Position/Title",
        contact: "Phone/Email"
    });
    sync();
}

// Custom Sections Functions
function renderCustomSections() {
    const list = document.getElementById('customSectionList');
    const output = document.getElementById('outCustomSections');
    list.innerHTML = '';
    output.innerHTML = '';

    cvData.customSections.forEach((section, index) => {
        list.innerHTML += `
                    < div class="card card-body mb-2 border shadow-sm" data - id="${section.id}" >
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('customSections', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-2 fw-bold" placeholder="Section Title" value="${section.title}" onchange="updateItem('customSections', ${index}, 'title', this.value)">
                    <input type="text" class="form-control form-control-sm mb-2 fw-bold" placeholder="Section Title" value="${section.title}" onchange="updateItem('customSections', ${index}, 'title', this.value)">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted">Content</small>
                         <button class="btn btn-link btn-sm p-0 text-info" onclick="enhanceItem('customSections', ${index}, 'content')">
                            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI
                        </button>
                    </div>
                    <textarea class="form-control form-control-sm" rows="3" placeholder="Section Content" onchange="updateItem('customSections', ${index}, 'content', this.value)">${section.content}</textarea>
                </div>`;

        output.innerHTML += `
                <div class="section-title"><i data-lucide="file-text" size="18"></i> ${section.title}</div>
                <p class="small text-muted">${section.content}</p>`;
    });

    initSortable('customSectionList', 'customSections');
}

function addCustomSection() {
    cvData.customSections.push({
        id: Date.now(),
        title: "Custom Section",
        content: "Add your content here..."
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

    const opt = {
        margin: 0,
        filename: `${name}_Double_Column_CV.pdf`,
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
        Swal.close();
        Swal.fire('Success', 'PDF Downloaded', 'success');
    }).catch(err => {
        console.error(err);
        Swal.fire('Error', 'PDF generation failed: ' + err.message, 'error');
    });
}

function exportAsDOCX() {
    const name = document.getElementById('inName').value || 'Resume';
    const content = document.getElementById('cvPage').innerHTML;

    // Inline styles for ensuring Word preserves look as much as possible
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${name} CV</title>
    <style>
         body { font-family: 'Calibri', 'Arial', sans-serif; }
        .sidebar { background-color: ${cvColors.sidebarBg}; color: ${cvColors.sidebarText}; padding: 20px; width: 30%; float: left; }
        .main-content { width: 65%; float: right; padding: 20px; }
        .section-title { font-weight: bold; text-transform: uppercase; margin-bottom: 10px; border-bottom: 2px solid ${cvColors.accent}; color: ${cvColors.accent}; }
        .sidebar .section-title { color: ${cvColors.sidebarText}; border-color: rgba(255,255,255,0.3); }
        .fw-bold { font-weight: bold; }
        .text-primary { color: ${cvColors.accent}; }
        .text-white { color: #fff; }
        .small { font-size: 10pt; }
        .badge { background-color: ${cvColors.accent}; color: #fff; padding: 3px 5px; border-radius: 3px; }
    </style>
    </head><body><div style="width: 700px; margin: 0 auto; overflow: hidden;">`;
    const postHtml = "</div></body></html>";

    const html = preHtml + content + postHtml;

    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    saveAs(blob, `${name}_Double_Column_CV.doc`);
    Swal.fire('Success', 'Downloaded as Word Doc', 'success');
}

function saveCV() {
    const data = {
        ...cvData,
        name: document.getElementById('inName').value,
        role: document.getElementById('inRole').value,
        contact: document.getElementById('inContact').value,
        skills: document.getElementById('inSkills').value,
        colors: cvColors
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'cv-data.json');

    Swal.fire('Saved!', 'CV data saved successfully', 'success');
}

// Load saved CV data
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

                // Load all data
                cvData.experiences = data.experiences || [];
                cvData.achievements = data.achievements || [];
                cvData.activities = data.activities || [];
                cvData.references = data.references || [];
                cvData.customSections = data.customSections || [];
                cvData.profileImage = data.profileImage || null;

                // Load personal info
                document.getElementById('inName').value = data.name || '';
                document.getElementById('inRole').value = data.role || '';
                document.getElementById('inContact').value = data.contact || '';
                document.getElementById('inSkills').value = data.skills || '';

                // Load profile image
                if (cvData.profileImage) {
                    document.getElementById('previewImage').src = cvData.profileImage;
                    document.getElementById('previewImage').style.display = 'inline-block';
                    document.getElementById('placeholderImage').style.display = 'none';
                    document.getElementById('cvProfileImage').src = cvData.profileImage;
                    document.getElementById('cvProfileImage').style.display = 'inline-block';
                    document.getElementById('cvPlaceholder').style.display = 'none';
                    document.getElementById('removeBtn').style.display = 'inline-block';
                }

                // Load colors
                if (data.colors) {
                    cvColors = data.colors;
                    document.getElementById('sidebarColor').value = cvColors.sidebarBg;
                    document.getElementById('sidebarTextColor').value = cvColors.sidebarText;
                    document.getElementById('accentColor').value = cvColors.accent;
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

// Load saved CV data
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

                // Load all data
                cvData.experiences = data.experiences || [];
                cvData.achievements = data.achievements || [];
                cvData.activities = data.activities || [];
                cvData.references = data.references || [];
                cvData.customSections = data.customSections || [];
                cvData.profileImage = data.profileImage || null;

                // Load personal info
                document.getElementById('inName').value = data.name || '';
                document.getElementById('inRole').value = data.role || '';
                document.getElementById('inContact').value = data.contact || '';
                document.getElementById('inSkills').value = data.skills || '';

                // Load profile image
                if (cvData.profileImage) {
                    document.getElementById('previewImage').src = cvData.profileImage;
                    document.getElementById('previewImage').style.display = 'inline-block';
                    document.getElementById('placeholderImage').style.display = 'none';
                    document.getElementById('cvProfileImage').src = cvData.profileImage;
                    document.getElementById('cvProfileImage').style.display = 'inline-block';
                    document.getElementById('cvPlaceholder').style.display = 'none';
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
    if (!element) return;
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
        sync();
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
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    } finally {
        // Button recreated by render
    }
}

// Auto-Save Functions
let autoSaveTimeout;
function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        localStorage.setItem('cvData_double', JSON.stringify(cvData));
        localStorage.setItem('cvData_double_meta', JSON.stringify({
            name: document.getElementById('inName').value,
            role: document.getElementById('inRole').value,
            contact: document.getElementById('inContact').value,
            summary: document.getElementById('inSummary') ? document.getElementById('inSummary').value : '',
            skills: document.getElementById('inSkills').value,
            colors: cvColors
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
    const savedData = localStorage.getItem('cvData_double');
    const savedMeta = localStorage.getItem('cvData_double_meta');

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
                document.getElementById('inContact').value = meta.contact || '';
                if (meta.summary && document.getElementById('inSummary')) {
                    document.getElementById('inSummary').value = meta.summary;
                }
                document.getElementById('inSkills').value = meta.skills || '';

                if (data.colors) {
                    cvColors = data.colors;
                    document.getElementById('sidebarColor').value = cvColors.sidebarBg;
                    document.getElementById('sidebarTextColor').value = cvColors.sidebarText;
                    document.getElementById('accentColor').value = cvColors.accent;
                }

                if (cvData.profileImage) {
                    document.getElementById('previewImage').src = cvData.profileImage;
                    document.getElementById('previewImage').style.display = 'inline-block';
                    document.getElementById('placeholderImage').style.display = 'none';
                    document.getElementById('cvProfileImage').src = cvData.profileImage;
                    document.getElementById('cvProfileImage').style.display = 'inline-block';
                    document.getElementById('cvPlaceholder').style.display = 'none';
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
}

// Override sync
const originalSync = sync;
sync = function () {
    originalSync();
    autoSave();
}