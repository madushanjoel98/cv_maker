
let selectedTemplate = 'ats';
let workExpCount = 0;
let educationCount = 0;
let projectCount = 0;
let profileImageData = '';
let referenceCount = 0;
let getfirsttime = localStorage.getItem("firsttime");
//  var myModalEl = document.getElementById('myModal');

//   // Create a Modal instance
//   var modal = new bootstrap.Modal(myModalEl);
$(document).ready(function () {
    readSystemJson();
    addWorkExperience();
    addEducation();
    //left-column
    //maincons

    slashscreen();

    $(".preview-section").hide();
    $('#profilePhoto').change(function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImageData = e.target.result;
                $('#imagePreview').attr('src', profileImageData).show();
            };
            reader.readAsDataURL(file);
        }
    });
});
function slashscreen() {
   
    $("#maincons").hide();
    $("#mm").fadeIn();
    $("#mm").fadeOut(3000);
    $("#maincons").fadeIn(8000);
    if (getfirsttime === "no" || getfirsttime === null) {

        localStorage.setItem("firsttime", "yes");
    }


}

function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}
function processbutton() {
    generatePreview();
    hiddenFunc(1);
    disableResponsiveViewport();
}
function hiddenFunc(key) {
    switch (key) {
        case 1:
            $(".preview-section").fadeIn(1);
            $(".form-card").fadeOut();
            break;
        case 2:
            $(".preview-section").fadeOut();
            $(".form-card").fadeIn();
            enableResponsiveViewport();
            break;
        default:
            break;
    }


}

function selectTemplate(template) {
    selectedTemplate = template;
    $('.template-option').removeClass('active');
    if (template === 'ats') {
        $('#atsOption').addClass('active');
        generatePreview();
    } else {
        $('#doubleOption').addClass('active');
        generatePreview();
    }

}
function enableResponsiveViewport() {
    const viewportMetaTag = document.querySelector('meta[name="viewport"]');
    if (viewportMetaTag) {
        viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
}
function disableResponsiveViewport() {
    const viewportMetaTag = document.querySelector('meta[name="viewport"]');
    if (viewportMetaTag) {
        // Revert to a fixed width (e.g., 980px is a common mobile default for desktop view)
        viewportMetaTag.setAttribute('content', 'width=980');
        // Or simply set to an empty string, letting the browser decide the default fixed width
        // viewportMetaTag.setAttribute('content', '');
    }
}

function toggleSection(sectionId) {
    $('#' + sectionId).slideToggle();
}

function addWorkExperience() {
    workExpCount++;
    const html = `
                <div class="entry-card" id="work${workExpCount}">
                    <span class="remove-btn" onclick="removeEntry('work${workExpCount}')">
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Job Title" id="workTitle${workExpCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Company" id="workCompany${workExpCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Start Date" id="workStart${workExpCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="End Date (or Present)" id="workEnd${workExpCount}">
                        </div>
                        <div class="col-md-12">
                            <textarea class="form-control" placeholder="Job Description" rows="3" id="workDesc${workExpCount}"></textarea>
                        </div>
                    </div>
                </div>
            `;
    $('#workExperienceContainer').append(html);
}

function addEducation() {
    educationCount++;
    const html = `
                <div class="entry-card" id="edu${educationCount}">
                    <span class="remove-btn" onclick="removeEntry('edu${educationCount}')">
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Degree" id="eduDegree${educationCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Institution" id="eduInstitution${educationCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Year" id="eduYear${educationCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="GPA (optional)" id="eduGPA${educationCount}">
                        </div>
                    </div>
                </div>
            `;
    $('#educationContainer').append(html);
}
function addReference() {
    referenceCount++;
    const html = `
                <div class="entry-card" id="ref${referenceCount}">
                    <span class="remove-btn" onclick="removeEntry('ref${referenceCount}')">
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Name" id="refName${referenceCount}">
                        </div>
                        <div class="col-md-6 mb-2">
                            <input type="text" class="form-control" placeholder="Contact" id="refContact${referenceCount}">
                        </div>
                        <div class="col-md-12">
                            <input type="text" class="form-control" placeholder="Relation" id="refRelation${referenceCount}">
                        </div>
                    </div>
                </div>
            `;
    $('#referencesContainer').append(html);
}
function addProject() {
    projectCount++;
    const html = `
                <div class="entry-card" id="project${projectCount}">
                    <span class="remove-btn" onclick="removeEntry('project${projectCount}')">
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="row">
                        <div class="col-md-12 mb-2">
                            <input type="text" class="form-control" placeholder="Project Name" id="projectName${projectCount}">
                        </div>
                        <div class="col-md-12">
                            <textarea class="form-control" placeholder="Project Description" rows="2" id="projectDesc${projectCount}"></textarea>
                        </div>
                    </div>
                </div>
            `;
    $('#projectsContainer').append(html);
}

function removeEntry(id) {
    $('#' + id).fadeOut(300, function () {
        $(this).remove();
    });
}

function collectData() {
    const data = {
        fullName: $('#fullName').val(),
        professionalTitle: $('#professionalTitle').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        location: $('#location').val(),
        linkedin: $('#linkedin').val(),
        summary: $('#summary').val(),
        skills: $('#skills').val(),
        workExperience: [],
        education: [],
        projects: [],
        achievements: $('#includeAchievements').is(':checked') ? $('#achievements').val() : '',
        activities: $('#includeActivities').is(':checked') ? $('#activities').val() : '',
        references: [],
        profileImage: profileImageData
    };

    // Collect work experience
    for (let i = 1; i <= workExpCount; i++) {
        if ($('#work' + i).length) {
            data.workExperience.push({
                title: $('#workTitle' + i).val(),
                company: $('#workCompany' + i).val(),
                startDate: $('#workStart' + i).val(),
                endDate: $('#workEnd' + i).val(),
                description: $('#workDesc' + i).val()
            });
        }
    }

    // Collect education
    for (let i = 1; i <= educationCount; i++) {
        if ($('#edu' + i).length) {
            data.education.push({
                degree: $('#eduDegree' + i).val(),
                institution: $('#eduInstitution' + i).val(),
                year: $('#eduYear' + i).val(),
                gpa: $('#eduGPA' + i).val()
            });
        }
    }

    // Collect projects if included
    if ($('#includeProjects').is(':checked')) {
        for (let i = 1; i <= projectCount; i++) {
            if ($('#project' + i).length) {
                data.projects.push({
                    name: $('#projectName' + i).val(),
                    description: $('#projectDesc' + i).val()
                });
            }
        }
    }

    // Collect references if included
    if ($('#includeReferences').is(':checked')) {
        for (let i = 1; i <= referenceCount; i++) {
            if ($('#ref' + i).length) {
                data.references.push({
                    name: $('#refName' + i).val(),
                    contact: $('#refContact' + i).val(),
                    relation: $('#refRelation' + i).val()
                });
            }
        }
    }
    return data;
}

function generateATSTemplate(data) {
    let html = `<div class="ats-template">`;

    // Header
    html += `<h1>${data.fullName}</h1>`;
    html += `<div class="contact-info">`;
    if (data.professionalTitle) html += `${data.professionalTitle}<br>`;
    html += `${data.email} | ${data.phone}`;
    if (data.location) html += ` | ${data.location}`;
    if (data.linkedin) html += ` | ${data.linkedin}`;
    html += `</div>`;

    // Summary
    if (data.summary) {
        html += `<h2>Professional Summary</h2>`;
        html += `<div class="content">${data.summary}</div>`;
    }

    // Work Experience
    if (data.workExperience.length > 0) {
        html += `<h2>Work Experience</h2>`;
        data.workExperience.forEach(work => {
            if (work.title && work.company) {
                html += `<div class="content">`;
                html += `<strong>${work.title}</strong> - ${work.company}<br>`;
                html += `${work.startDate} - ${work.endDate}<br>`;
                if (work.description) html += `${work.description}<br>`;
                html += `</div>`;
            }
        });
    }

    // Education
    if (data.education.length > 0) {
        html += `<h2>Education</h2>`;
        data.education.forEach(edu => {
            if (edu.degree && edu.institution) {
                html += `<div class="content">`;
                html += `<strong>${edu.degree}</strong> - ${edu.institution}<br>`;
                html += `${edu.year}`;
                if (edu.gpa) html += ` | GPA: ${edu.gpa}`;
                html += `</div>`;
            }
        });
    }

    // Skills
    if (data.skills) {
        html += `<h2>Skills</h2>`;
        html += `<div class="content">${data.skills}</div>`;
    }

    // Projects
    if (data.projects.length > 0) {
        html += `<h2>Projects</h2>`;
        data.projects.forEach(project => {
            if (project.name) {
                html += `<div class="content">`;
                html += `<strong>${project.name}</strong><br>`;
                if (project.description) html += `${project.description}`;
                html += `</div>`;
            }
        });
    }

    // Achievements
    if (data.achievements) {
        html += `<h2>Achievements</h2>`;
        html += `<div class="content">${data.achievements.replace(/\n/g, '<br>')}</div>`;
    }

    // Activities
    if (data.activities) {
        html += `<h2>Extra Activities</h2>`;
        html += `<div class="content">${data.activities.replace(/\n/g, '<br>')}</div>`;
    }



    // References
    if (data.references.length > 0) {
        html += `<h2>References</h2>`;
        data.references.forEach(ref => {
            if (ref.name) {
                html += `<div class="content">`;
                html += `<strong>${ref.name}</strong><br>`;
                if (ref.contact) html += `${ref.contact}<br>`;
                if (ref.relation) html += `${ref.relation}`;
                html += `</div>`;
            }
        });
    }
    html += `</div>`;
    return html;
}
function generateDoubleColumnTemplate(data) {
    let html = `<div class="double-column">`;

    /* ================= LEFT COLUMN ================= */
    html += `<div id="resizable" class="left-column ui-widget-content resizable sortable">`;

    // Profile Image
    if (data.profileImage) {
        html += `<img src="${data.profileImage}" class="profile-img ui-widget-content resizable" alt="Profile Photo">`;
    }

    // Contact Info
    html += `<div><h2>CONTACT</h2><div class="content">`;
    if (data.email) html += `<p><i class="fas fa-envelope"></i> ${data.email}</p>`;
    if (data.phone) html += `<p><i class="fas fa-phone"></i> ${data.phone}</p>`;
    if (data.location) html += `<p><i class="fas fa-map-marker-alt"></i> ${data.location}</p>`;
    if (data.linkedin) html += `<p><i class="fab fa-linkedin"></i> ${data.linkedin}</p>`;
    html += `</div></div>`;

    // Skills
    if (data.skills) {
        html += `<div><h2>SKILLS</h2><div class="content">`;
        data.skills.split(',').forEach(skill => {
            html += `<p>• ${skill.trim()}</p>`;
        });
        html += `</div></div>`;
    }

    // Education
    if (data.education && data.education.length > 0) {
        html += `<div><h2>EDUCATION</h2>`;
        data.education.forEach(edu => {
            if (edu.degree && edu.institution) {
                html += `<div class="content">`;
                html += `<p><strong>${edu.degree}</strong></p>`;
                html += `<p>${edu.institution}</p>`;
                if (edu.year) html += `<p>${edu.year}</p>`;
                if (edu.gpa) html += `<p>GPA: ${edu.gpa}</p>`;
                html += `</div>`;
            }
        });
        html += `</div>`;
    }

    html += `</div>`; // close left-column


    /* ================= RIGHT COLUMN ================= */
    html += `<div class="right-column sortable">`;

    // Name and Title
    html += `<div>`;
    html += `<h1>${data.fullName || ''}</h1>`;
    if (data.professionalTitle) {
        html += `<p style="color:#7f8c8d;font-size:18px;margin-bottom:20px;">${data.professionalTitle}</p>`;
    }
    html += `</div>`;

    // Summary
    if (data.summary) {
        html += `<div><h2>PROFESSIONAL SUMMARY</h2>`;
        html += `<div class="content">${data.summary}</div></div>`;
    }

    // Work Experience
    if (data.workExperience && data.workExperience.length > 0) {
        html += `<div><h2>WORK EXPERIENCE</h2>`;
        data.workExperience.forEach(work => {
            if (work.title && work.company) {
                html += `<div class="content" style="margin-bottom:15px;">`;
                html += `<p><strong>${work.title}</strong></p>`;
                html += `<p style="color:#7f8c8d;">${work.company} | ${work.startDate || ''} - ${work.endDate || ''}</p>`;
                if (work.description) html += `<p>${work.description}</p>`;
                html += `</div>`;
            }
        });
        html += `</div>`;
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
        html += `<div><h2>PROJECTS</h2>`;
        data.projects.forEach(project => {
            if (project.name) {
                html += `<div class="content" style="margin-bottom:15px;">`;
                html += `<p><strong>${project.name}</strong></p>`;
                if (project.description) html += `<p>${project.description}</p>`;
                html += `</div>`;
            }
        });
        html += `</div>`;
    }

    // Achievements
    if (data.achievements) {
        html += `<div><h2>ACHIEVEMENTS</h2>`;
        html += `<div class="content">${data.achievements.replace(/\n/g, '<br>')}</div></div>`;
    }

    // Activities
    if (data.activities) {
        html += `<div><h2>EXTRA ACTIVITIES</h2>`;
        html += `<div class="content">${data.activities.replace(/\n/g, '<br>')}</div></div>`;
    }

    // References ✅ inside right-column
    if (data.references && data.references.length > 0) {
        html += `<div><h2>REFERENCES</h2>`;
        data.references.forEach(ref => {
            if (ref.name) {
                html += `<div class="content" style="margin-bottom:15px;">`;
                html += `<p><strong>${ref.name}</strong></p>`;
                if (ref.contact) html += `<p>${ref.contact}</p>`;
                if (ref.relation) html += `<p>${ref.relation}</p>`;
                html += `</div>`;
            }
        });
        html += `</div>`;
    }

    html += `</div>`; // close right-column
    html += `</div>`; // close double-column

    return html;
}


function generatePreview() {
    const data = collectData();

    if (!data.fullName || !data.email || !data.phone) {
        alert('Please fill in all required fields (Name, Email, Phone)');
        throw new Error('Missing required fields');

    }

    let html = '';
    if (selectedTemplate === 'ats') {
        html = generateATSTemplate(data);
    } else {
        html = generateDoubleColumnTemplate(data);
        $(function () {
            //sortable
            $(".resizable").resizable();
            $(".sortable").sortable();
        });
    }

    $('#cvPreview').html(html).show();
    $('html, body').animate({
        scrollTop: $('#cvPreview').offset().top - 100
    }, 500);
}

function downloadPDF() {
    const preview = document.getElementById('cvPreview');
    if (!preview.innerHTML) {
        alert('Please generate a preview first!');
        return;
    }
    // Show loading message
    const originalContent = preview.innerHTML;
    const loadingMsg = document.createElement('div');
    loadingMsg.innerHTML = '<div style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Generating PDF...</div>';
    // Create a temporary container for PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '210mm';
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '15mm';
    pdfContainer.innerHTML = originalContent;
    document.body.appendChild(pdfContainer);
    // Use html2canvas and jsPDF
    html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: pdfContainer.scrollWidth,
        height: pdfContainer.scrollHeight
    }).then(function (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('CV_' + $('#fullName').val().replace(/\s+/g, '_') + '.pdf');

        // Cleanup
        document.body.removeChild(pdfContainer);
    }).catch(function (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
        document.body.removeChild(pdfContainer);
    });
}