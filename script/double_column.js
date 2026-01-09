// Data Structure
let cvData = {
    experiences: [],
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

    const skills = document.getElementById('inSkills').value.split(',');
    document.getElementById('outSkills').innerHTML = skills
        .map(s => `<span class="badge bg-primary fw-normal">${s.trim()}</span>`)
        .join('');

    renderExperience();
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
                    ${output.innerHTML}`;
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
                <div class="card card-body mb-2 border shadow-sm" data-id="${section.id}">
                    <div class="d-flex justify-content-between mb-2">
                        <i class="handle" data-lucide="grip-vertical"></i>
                        <button class="btn btn-link btn-sm text-danger p-0" onclick="removeItem('customSections', ${index})">Remove</button>
                    </div>
                    <input type="text" class="form-control form-control-sm mb-2 fw-bold" placeholder="Section Title" value="${section.title}" onchange="updateItem('customSections', ${index}, 'title', this.value)">
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
        pdf.save(`${document.getElementById('inName').value}_CV.pdf`);

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
        // Create simple DOCX content
        let docContent = `${document.getElementById('inName').value}\n`;
        docContent += `${document.getElementById('inRole').value}\n\n`;
        docContent += `CONTACT\n${document.getElementById('inContact').value}\n\n`;

        docContent += `SKILLS\n${document.getElementById('inSkills').value}\n\n`;

        docContent += `EXPERIENCE\n`;
        cvData.experiences.forEach(exp => {
            docContent += `${exp.role} - ${exp.company} (${exp.date})\n${exp.desc}\n\n`;
        });

        if (cvData.achievements.length > 0) {
            docContent += `ACHIEVEMENTS\n`;
            cvData.achievements.forEach(ach => {
                docContent += `${ach.title}: ${ach.desc}\n`;
            });
            docContent += '\n';
        }

        if (cvData.activities.length > 0) {
            docContent += `ACTIVITIES & INTERESTS\n`;
            cvData.activities.forEach(act => {
                docContent += `${act.name}: ${act.desc}\n`;
            });
            docContent += '\n';
        }

        if (cvData.references.length > 0) {
            docContent += `REFERENCES\n`;
            cvData.references.forEach(ref => {
                docContent += `${ref.name}\n${ref.position}\n${ref.contact}\n\n`;
            });
        }

        cvData.customSections.forEach(section => {
            docContent += `${section.title.toUpperCase()}\n${section.content}\n\n`;
        });

        // Create blob and download
        const blob = new Blob([docContent], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        saveAs(blob, `${document.getElementById('inName').value}_CV.docx`);

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

window.onload = sync;
