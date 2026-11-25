/**
 * Ghoshpukur Motor Training School - Admin Dashboard & Management System
 * Handles Authentication, Slides Management, Course Management, Gallery, and Candidate Inquiries
 */

const ADMIN_SESSION_KEY = 'gmts_admin_active_session';

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminNavigation();
  initAdminForms();
});

/* ==========================================================================
   1. Authentication & Session Management
   ========================================================================== */
function initAdminAuth() {
  const loginModal = document.getElementById('adminLoginModal');
  const portalModal = document.getElementById('adminPortalModal');
  const loginForm = document.getElementById('adminLoginForm');
  const logoutBtn = document.getElementById('adminLogoutBtn');
  const openAdminBtns = document.querySelectorAll('.open-admin-portal-btn');

  // Check existing session
  const isLoggedIn = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';

  // Open Admin action
  openAdminBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
        openAdminDashboard();
      } else {
        openAdminLogin();
      }
    });
  });

  // Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('adminUsernameInput').value.trim();
      const password = document.getElementById('adminPasswordInput').value;
      const errorEl = document.getElementById('adminLoginError');
      document.getElementById('adminUsernameInput').value = '';
      document.getElementById('adminPasswordInput').value = '';

      if (GMTS_DB.verifyCredentials(username, password)) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        if (errorEl) errorEl.style.display = 'none';
        loginModal.classList.remove('open');
        openAdminDashboard();
        showNotification('Login Successful! Welcome to Admin Panel.', 'success');
      } else {
        if (errorEl) {
          errorEl.textContent = 'Invalid username or password.';
          errorEl.style.display = 'block';
        }
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      portalModal.classList.remove('active');
      showNotification('Logged out successfully.', 'info');
    });
  }

  // Close portal button
  const closePortalBtn = document.getElementById('closeAdminPortalBtn');
  if (closePortalBtn) {
    closePortalBtn.addEventListener('click', () => {
      portalModal.classList.remove('active');
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
      // Refresh public website components to reflect any changes
      if (typeof initHeroSlider === 'function') initHeroSlider();
      if (typeof initCourses === 'function') initCourses();
      if (typeof initGallery === 'function') initGallery();
      if (typeof initSiteSettings === 'function') initSiteSettings();
    });
  }
}

function openAdminLogin() {
  const loginModal = document.getElementById('adminLoginModal');
  const usernameInput = document.getElementById('adminUsernameInput');
  const passwordInput = document.getElementById('adminPasswordInput');
  const errorEl = document.getElementById('adminLoginError');
  if (usernameInput) usernameInput.value = '';
  if (passwordInput) passwordInput.value = '';
  if (errorEl) errorEl.style.display = 'none';
  if (loginModal) loginModal.classList.add('open');
}

function openAdminDashboard() {
  const portalModal = document.getElementById('adminPortalModal');
  if (!portalModal) return;

  portalModal.classList.add('active');
  refreshAdminDashboard();
}

/* ==========================================================================
   2. Admin Navigation & Tab Routing
   ========================================================================== */
function initAdminNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.dataset.tab;

      navItems.forEach(nav => nav.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      item.classList.add('active');
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add('active');
        handleTabLoaded(targetTab);
      }
    });
  });
}

function handleTabLoaded(tabId) {
  switch (tabId) {
    case 'adminTabOverview':
      renderDashboardOverview();
      break;
    case 'adminTabApplications':
      renderAdminApplications();
      break;
    case 'adminTabSlides':
      renderAdminSlides();
      break;
    case 'adminTabCourses':
      renderAdminCourses();
      break;
    case 'adminTabGallery':
      renderAdminGallery();
      break;
    case 'adminTabSettings':
      loadAdminSettings();
      break;
  }
}

function refreshAdminDashboard() {
  renderDashboardOverview();
  const activeTab = document.querySelector('.admin-tab-content.active');
  if (activeTab) handleTabLoaded(activeTab.id);
}

/* ==========================================================================
   3. Dashboard Overview & Metrics
   ========================================================================== */
function renderDashboardOverview() {
  const applications = GMTS_DB.getApplications();
  const slides = GMTS_DB.getSlides();
  const courses = GMTS_DB.getCourses();
  const gallery = GMTS_DB.getGallery();

  const newInquiries = applications.filter(a => a.status === 'New').length;
  const enrolledCandidates = applications.filter(a => a.status === 'Enrolled').length;
  const activeSlides = slides.filter(s => s.isVisible !== false).length;
  const activeCourses = courses.filter(c => c.isVisible !== false).length;

  // Update counters
  const totalAppsEl = document.getElementById('statTotalApplications');
  const newAppsEl = document.getElementById('statNewInquiries');
  const enrolledEl = document.getElementById('statEnrolled');
  const activeCoursesEl = document.getElementById('statActiveCourses');
  const activeSlidesEl = document.getElementById('statActiveSlides');

  if (totalAppsEl) totalAppsEl.textContent = applications.length;
  if (newAppsEl) newAppsEl.textContent = newInquiries;
  if (enrolledEl) enrolledEl.textContent = enrolledCandidates;
  if (activeCoursesEl) activeCoursesEl.textContent = `${activeCourses} / ${courses.length}`;
  if (activeSlidesEl) activeSlidesEl.textContent = `${activeSlides} / ${slides.length}`;

  // Render recent 5 applications in overview table
  const recentTableBody = document.getElementById('overviewRecentTableBody');
  if (recentTableBody) {
    const recent5 = applications.slice(0, 5);
    if (recent5.length === 0) {
      recentTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#94a3b8;">No applications submitted yet.</td></tr>`;
      return;
    }

    recentTableBody.innerHTML = recent5.map(app => `
      <tr>
        <td><strong>${app.id}</strong></td>
        <td>${escapeHtml(app.fullName)}</td>
        <td><a href="tel:${app.phone}" style="color:var(--primary); font-weight:600;"><i class="fa-solid fa-phone"></i> ${escapeHtml(app.phone)}</a></td>
        <td>${escapeHtml(app.courseTitle || 'N/A')}</td>
        <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
        <td>
          <button class="btn btn-sm btn-outline view-app-btn" data-id="${app.id}"><i class="fa-solid fa-eye"></i> View</button>
        </td>
      </tr>
    `).join('');

    // Attach quick view handler
    recentTableBody.querySelectorAll('.view-app-btn').forEach(btn => {
      btn.addEventListener('click', () => openApplicationDetailsModal(btn.dataset.id));
    });
  }
}

/* ==========================================================================
   4. Candidate Applications Manager
   ========================================================================== */
let appStatusFilter = 'all';
let appCourseFilter = 'all';
let appSortOrder = 'newest';
let appSearchKeyword = '';
let appDatePreset = 'all';
let appDateFrom = '';
let appDateTo = '';

function matchesDateFilter(appliedDate) {
  if (appDatePreset === 'all') return true;
  if (!appliedDate) return false;

  const d = new Date(appliedDate);
  if (isNaN(d.getTime())) return false;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const toDateString = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const appDateStr = toDateString(d);
  const todayStr = toDateString(now);

  if (appDatePreset === 'today') {
    return appDateStr === todayStr;
  }
  if (appDatePreset === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return appDateStr === toDateString(yesterday);
  }
  if (appDatePreset === 'last7') {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startStr = toDateString(sevenDaysAgo);
    return appDateStr >= startStr && appDateStr <= todayStr;
  }
  if (appDatePreset === 'thisMonth') {
    return appDateStr.slice(0, 7) === todayStr.slice(0, 7);
  }
  if (appDatePreset === 'custom') {
    if (appDateFrom && appDateStr < appDateFrom) return false;
    if (appDateTo && appDateStr > appDateTo) return false;
    return true;
  }
  return true;
}

function populateAppCourseFilter() {
  const courseSelect = document.getElementById('appCourseFilterSelect');
  if (!courseSelect) return;
  const currentVal = courseSelect.value || appCourseFilter;
  const courses = GMTS_DB.getCourses();
  
  // Set of courses
  const courseTitles = new Set();
  courses.forEach(c => { if (c.title) courseTitles.add(c.title); });
  GMTS_DB.getApplications().forEach(a => { if (a.courseTitle) courseTitles.add(a.courseTitle); });
  
  courseSelect.innerHTML = '<option value="all">All Courses</option>';
  Array.from(courseTitles).sort().forEach(title => {
    const opt = document.createElement('option');
    opt.value = title;
    opt.textContent = title;
    if (title === currentVal) opt.selected = true;
    courseSelect.appendChild(opt);
  });
}

function renderAdminApplications() {
  const tableBody = document.getElementById('adminApplicationsTableBody');
  if (!tableBody) return;

  populateAppCourseFilter();

  const applications = GMTS_DB.getApplications();
  const searchKeyword = appSearchKeyword.toLowerCase();

  // Filter & Search
  let filtered = applications.filter(app => {
    const status = (app.status || '').toLowerCase();
    const courseTitle = (app.courseTitle || '').toLowerCase();
    const matchesStatus = appStatusFilter === 'all' || status === appStatusFilter.toLowerCase();
    const matchesCourse = appCourseFilter === 'all' || courseTitle.includes(appCourseFilter.toLowerCase());
    const matchesDate = matchesDateFilter(app.appliedDate);
    const matchesSearch = !searchKeyword ||
      (app.fullName || '').toLowerCase().includes(searchKeyword) ||
      (app.phone || '').includes(searchKeyword) ||
      (app.id || '').toLowerCase().includes(searchKeyword) ||
      courseTitle.includes(searchKeyword) ||
      (app.email || '').toLowerCase().includes(searchKeyword);
    return matchesStatus && matchesCourse && matchesDate && matchesSearch;
  });

  // Sort
  if (appSortOrder === 'newest') {
    filtered.sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0));
  } else if (appSortOrder === 'oldest') {
    filtered.sort((a, b) => new Date(a.appliedDate || 0) - new Date(b.appliedDate || 0));
  } else if (appSortOrder === 'name') {
    filtered.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: #64748b;">
          <i class="fa-solid fa-folder-open" style="font-size:2rem; margin-bottom:0.5rem; display:block;"></i>
          No candidate applications found matching your criteria.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(app => {
    const dateFormatted = new Date(app.appliedDate).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    return `
      <tr>
        <td><strong>${app.id}</strong><br><span style="font-size:0.75rem; color:#94a3b8;">${dateFormatted}</span></td>
        <td>
          <strong>${escapeHtml(app.fullName)}</strong>
          <div style="font-size:0.75rem; color:#64748b;">Age/DOB: ${app.dob || 'N/A'} | ${app.gender || ''}</div>
        </td>
        <td>
          <a href="tel:${app.phone}" style="color:var(--primary); font-weight:600;"><i class="fa-solid fa-phone"></i> ${escapeHtml(app.phone)}</a>
          ${app.email ? `<br><span style="font-size:0.75rem; color:#64748b;">${escapeHtml(app.email)}</span>` : ''}
        </td>
        <td>
          <strong>${escapeHtml(app.courseTitle || 'N/A')}</strong>
          <div style="font-size:0.75rem; color:#64748b;"><i class="fa-solid fa-clock"></i> ${escapeHtml(app.preferredSlot || 'Any')}</div>
        </td>
        <td>
          <select class="form-control form-control-sm app-status-quick-change" data-id="${app.id}" style="padding:0.25rem 0.5rem; font-size:0.8rem; width:125px;">
            <option value="New" ${app.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${app.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Verified" ${app.status === 'Verified' ? 'selected' : ''}>Verified</option>
            <option value="Enrolled" ${app.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
            <option value="Completed" ${app.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-sm btn-outline view-app-btn" data-id="${app.id}" title="View Details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <a href="https://wa.me/91${app.phone}?text=Hello%20${encodeURIComponent(app.fullName)},%20this%20is%20from%20Ghoshpukur%20Motor%20Training%20School%20regarding%20your%20admission%20application%20(${app.id})." target="_blank" class="btn btn-sm btn-outline" style="color:#16a34a;" title="WhatsApp Candidate">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button class="btn btn-sm btn-outline delete-app-btn" data-id="${app.id}" style="color:var(--danger);" title="Delete Application">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Event handlers for applications table
  tableBody.querySelectorAll('.view-app-btn').forEach(btn => {
    btn.addEventListener('click', () => openApplicationDetailsModal(btn.dataset.id));
  });

  tableBody.querySelectorAll('.delete-app-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete application ${btn.dataset.id}?`)) {
        GMTS_DB.deleteApplication(btn.dataset.id);
        renderAdminApplications();
        renderDashboardOverview();
        showNotification('Application deleted.', 'info');
      }
    });
  });

  tableBody.querySelectorAll('.app-status-quick-change').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      GMTS_DB.updateApplicationStatus(id, newStatus);
      renderDashboardOverview();
      showNotification(`Application ${id} status updated to ${newStatus}.`, 'success');
    });
  });
}

// Application Detail Modal
function openApplicationDetailsModal(appId) {
  const apps = GMTS_DB.getApplications();
  const app = apps.find(a => a.id === appId);
  if (!app) return;

  const modal = document.getElementById('adminAppDetailModal');
  const content = document.getElementById('adminAppDetailContent');
  if (!modal || !content) return;

  const appliedDate = new Date(app.appliedDate).toLocaleString('en-IN');

  content.innerHTML = `
    <div style="background:#f8fafc; border-radius:8px; padding:1.25rem; margin-bottom:1.25rem; border:1px solid #e2e8f0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
        <h4 style="color:var(--primary); font-size:1.2rem; margin:0;">Application #${app.id}</h4>
        <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span>
      </div>
      <p style="font-size:0.85rem; color:#64748b; margin:0;">Applied On: ${appliedDate}</p>
    </div>

    <div class="form-grid-2" style="margin-bottom:1.25rem;">
      <div>
        <label style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">Candidate Name</label>
        <p style="font-size:1.05rem; font-weight:700; color:var(--text-main);">${escapeHtml(app.fullName)}</p>
      </div>
      <div>
        <label style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">Guardian's Name</label>
        <p style="font-size:1rem; color:var(--text-main);">${escapeHtml(app.guardianName || 'N/A')}</p>
      </div>
      <div>
        <label style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">Phone Number</label>
        <p style="font-size:1rem;"><a href="tel:${app.phone}" style="color:var(--primary); font-weight:700;"><i class="fa-solid fa-phone"></i> ${escapeHtml(app.phone)}</a></p>
      </div>
      <div>
        <label style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">Email Address</label>
        <p style="font-size:1rem; color:var(--text-main);">${escapeHtml(app.email || 'None')}</p>
      </div>
      <div>
        <label style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">Date of Birth & Gender</label>
        <p style="font-size:0.95rem; color:var(--text-main);">${app.dob || 'N/A'} (${app.gender || 'N/A'})</p>
      </div>
      <div>
        <label style="font-size:0.8rem; color:#64748b; font-weight:700; text-transform:uppercase;">ID Proof Type</label>
        <p style="font-size:0.95rem; color:var(--text-main);">${escapeHtml(app.idProofType || 'Aadhaar Card')}</p>
      </div>
    </div>

    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-bottom:1.25rem;">
      <h5 style="margin-bottom:0.75rem; color:var(--primary);"><i class="fa-solid fa-graduation-cap"></i> Course & Training Preferences</h5>
      <p style="margin-bottom:0.4rem;"><strong>Course:</strong> ${escapeHtml(app.courseTitle || 'N/A')} (₹${Number(app.coursePrice || 0).toLocaleString('en-IN')})</p>
      <p style="margin-bottom:0.4rem;"><strong>Vehicle Category:</strong> ${escapeHtml(app.vehicleType || 'Car')}</p>
      <p style="margin-bottom:0.4rem;"><strong>Preferred Timing Slot:</strong> ${escapeHtml(app.preferredSlot || 'Morning')}</p>
      <p style="margin-bottom:0.4rem;"><strong>Learner License Status:</strong> ${escapeHtml(app.learnerLicenseStatus || 'N/A')}</p>
      <p style="margin-bottom:0.4rem;"><strong>Address:</strong> ${escapeHtml(app.address || '')}, ${escapeHtml(app.city || 'Ghoshpukur')} - ${escapeHtml(app.pincode || '')}</p>
      ${app.notes ? `<p style="margin-top:0.5rem; background:#f1f5f9; padding:0.5rem; border-radius:6px; font-size:0.875rem;"><strong>Candidate Message:</strong> "${escapeHtml(app.notes)}"</p>` : ''}
    </div>

    <div style="background:#fefce8; border:1px solid #fef08a; border-radius:8px; padding:1rem;">
      <h5 style="margin-bottom:0.75rem; color:#854d0e;"><i class="fa-solid fa-user-shield"></i> Admin Processing & Status</h5>
      <div class="form-group" style="margin-bottom:0.75rem;">
        <label class="form-label">Application Status</label>
        <select class="form-control" id="modalAppStatusSelect">
          <option value="New" ${app.status === 'New' ? 'selected' : ''}>New (Received)</option>
          <option value="Contacted" ${app.status === 'Contacted' ? 'selected' : ''}>Contacted (Follow Up)</option>
          <option value="Verified" ${app.status === 'Verified' ? 'selected' : ''}>Verified (Documents Approved)</option>
          <option value="Enrolled" ${app.status === 'Enrolled' ? 'selected' : ''}>Enrolled (Batch Assigned & Training)</option>
          <option value="Completed" ${app.status === 'Completed' ? 'selected' : ''}>Completed (License Issued)</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0.75rem;">
        <label class="form-label">Admin Notes / Remarks</label>
        <textarea class="form-control" id="modalAppRemarksInput" placeholder="Add internal notes e.g., fees paid, batch time assigned, trainer name...">${escapeHtml(app.adminRemarks || '')}</textarea>
      </div>
      <button class="btn btn-primary btn-sm" id="modalSaveAppStatusBtn">
        <i class="fa-solid fa-floppy-disk"></i> Update Candidate Record
      </button>
    </div>
  `;

  // Attach update button handler
  document.getElementById('modalSaveAppStatusBtn').addEventListener('click', () => {
    const newStatus = document.getElementById('modalAppStatusSelect').value;
    const remarks = document.getElementById('modalAppRemarksInput').value.trim();
    GMTS_DB.updateApplicationStatus(app.id, newStatus, remarks);
    modal.classList.remove('open');
    renderAdminApplications();
    renderDashboardOverview();
    showNotification('Candidate status and notes updated.', 'success');
  });

  modal.classList.add('open');
}

// Export Applications to CSV (supports exporting filtered view or all records)
function exportApplicationsCSV(exportFilteredOnly = true) {
  const allApps = GMTS_DB.getApplications();
  let apps = allApps;

  const isFiltered = appStatusFilter !== 'all' || appCourseFilter !== 'all' || appSearchKeyword || appDatePreset !== 'all';

  if (exportFilteredOnly && isFiltered) {
    apps = allApps.filter(app => {
      const matchesStatus = appStatusFilter === 'all' || app.status.toLowerCase() === appStatusFilter.toLowerCase();
      const matchesCourse = appCourseFilter === 'all' || (app.courseTitle && app.courseTitle.toLowerCase().includes(appCourseFilter.toLowerCase()));
      const matchesDate = matchesDateFilter(app.appliedDate);
      const matchesSearch = !appSearchKeyword || 
        app.fullName.toLowerCase().includes(appSearchKeyword.toLowerCase()) ||
        app.phone.includes(appSearchKeyword) ||
        app.id.toLowerCase().includes(appSearchKeyword.toLowerCase()) ||
        (app.courseTitle && app.courseTitle.toLowerCase().includes(appSearchKeyword.toLowerCase())) ||
        (app.email && app.email.toLowerCase().includes(appSearchKeyword.toLowerCase()));
      return matchesStatus && matchesCourse && matchesDate && matchesSearch;
    });
  }

  if (!apps.length) {
    showNotification('No candidate application records to export.', 'warning');
    return;
  }

  const headers = ['Application ID', 'Applied Date', 'Full Name', 'Guardian Name', 'Phone', 'Email', 'DOB', 'Gender', 'Address', 'City', 'Pincode', 'Course', 'Vehicle', 'Preferred Slot', 'License Status', 'Status', 'Admin Remarks'];
  const rows = apps.map(a => [
    `"${a.id || ''}"`,
    `"${a.appliedDate || ''}"`,
    `"${(a.fullName || '').replace(/"/g, '""')}"`,
    `"${(a.guardianName || '').replace(/"/g, '""')}"`,
    `"${a.phone || ''}"`,
    `"${a.email || ''}"`,
    `"${a.dob || ''}"`,
    `"${a.gender || ''}"`,
    `"${(a.address || '').replace(/"/g, '""')}"`,
    `"${a.city || ''}"`,
    `"${a.pincode || ''}"`,
    `"${(a.courseTitle || '').replace(/"/g, '""')}"`,
    `"${a.vehicleType || ''}"`,
    `"${a.preferredSlot || ''}"`,
    `"${a.learnerLicenseStatus || ''}"`,
    `"${a.status || ''}"`,
    `"${(a.adminRemarks || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  let filterTag = '';
  if (appStatusFilter !== 'all') filterTag += `_${appStatusFilter}`;
  if (appDatePreset !== 'all') filterTag += `_${appDatePreset}`;
  link.setAttribute('download', `Ghoshpukur_MTS_Applications${filterTag}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showNotification(`Exported ${apps.length} candidate applications to CSV!`, 'success');
}

/* ==========================================================================
   5. Slider & Banner Pictures Manager (with Show/Hide Toggle)
   ========================================================================== */
function renderAdminSlides() {
  const tableBody = document.getElementById('adminSlidesTableBody');
  if (!tableBody) return;

  const slides = GMTS_DB.getSlides();

  tableBody.innerHTML = slides.map(slide => `
    <tr>
      <td>
        <img src="${slide.imageUrl}" alt="${escapeHtml(slide.title)}" loading="lazy" class="table-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=300&q=80'">
      </td>
      <td>
        <strong>${escapeHtml(slide.title)}</strong>
        <div style="font-size:0.8rem; color:#64748b;">${escapeHtml(slide.subtitle || '')}</div>
        ${slide.badge ? `<span class="badge badge-warning" style="margin-top:0.25rem;">${escapeHtml(slide.badge)}</span>` : ''}
      </td>
      <td>
        <label class="switch" title="Toggle visibility on website">
          <input type="checkbox" class="slide-vis-toggle" data-id="${slide.id}" ${slide.isVisible !== false ? 'checked' : ''}>
          <span class="slider-toggle"></span>
        </label>
        <span style="font-size:0.8rem; margin-left:0.5rem; color:${slide.isVisible !== false ? 'var(--success)' : '#94a3b8'}; font-weight:600;">
          ${slide.isVisible !== false ? 'Shown' : 'Hidden'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-sm btn-outline edit-slide-btn" data-id="${slide.id}" title="Edit Slide">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline delete-slide-btn" data-id="${slide.id}" style="color:var(--danger);" title="Delete Slide">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Visibility toggle
  tableBody.querySelectorAll('.slide-vis-toggle').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const isVisible = GMTS_DB.toggleSlideVisibility(id);
      renderAdminSlides();
      renderDashboardOverview();
      showNotification(`Slide is now ${isVisible ? 'VISIBLE' : 'HIDDEN'} on website homepage.`, 'success');
      if (typeof initHeroSlider === 'function') initHeroSlider();
    });
  });

  // Edit slide
  tableBody.querySelectorAll('.edit-slide-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditSlideModal(btn.dataset.id));
  });

  // Delete slide
  tableBody.querySelectorAll('.delete-slide-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this slider banner?')) {
        GMTS_DB.deleteSlide(btn.dataset.id);
        renderAdminSlides();
        renderDashboardOverview();
        showNotification('Slide deleted.', 'info');
        if (typeof initHeroSlider === 'function') initHeroSlider();
      }
    });
  });
}

function openEditSlideModal(slideId) {
  const slides = GMTS_DB.getSlides();
  const slide = slideId ? slides.find(s => s.id === slideId) : null;

  const modal = document.getElementById('slideFormModal');
  const titleEl = document.getElementById('slideModalTitle');
  const form = document.getElementById('slideForm');
  if (!modal || !form) return;

  titleEl.textContent = slide ? 'Edit Banner Slide' : 'Add New Banner Slide';
  document.getElementById('slideIdInput').value = slide ? slide.id : '';
  document.getElementById('slideTitleInput').value = slide ? slide.title : '';
  document.getElementById('slideSubtitleInput').value = slide ? slide.subtitle : '';
  document.getElementById('slideBadgeInput').value = slide ? slide.badge : '';
  document.getElementById('slideImageUrlInput').value = slide ? slide.imageUrl : '';
  document.getElementById('slideCtaTextInput').value = slide ? (slide.ctaText || 'Enroll for Training') : 'Enroll for Training';
  document.getElementById('slideCtaLinkInput').value = slide ? (slide.ctaLink || '#admission-form') : '#admission-form';

  modal.classList.add('open');
}

/* ==========================================================================
   6. Course Details Manager (with Show/Hide Toggle)
   ========================================================================== */
function renderAdminCourses() {
  const tableBody = document.getElementById('adminCoursesTableBody');
  if (!tableBody) return;

  const courses = GMTS_DB.getCourses();

  tableBody.innerHTML = courses.map(course => `
    <tr>
      <td>
        <strong>${escapeHtml(course.title)}</strong>
        <div style="font-size:0.75rem; color:var(--accent); font-weight:700;">${escapeHtml(course.categoryName || course.category)}</div>
        ${course.badge ? `<span class="badge badge-${course.badgeColor || 'primary'}" style="margin-top:0.25rem;">${escapeHtml(course.badge)}</span>` : ''}
      </td>
      <td>${escapeHtml(course.duration)}</td>
      <td>
        <strong style="font-size:1.05rem; color:var(--primary-dark);">₹${Number(course.price).toLocaleString('en-IN')}</strong>
        ${course.originalPrice ? `<div style="font-size:0.75rem; text-decoration:line-through; color:#94a3b8;">₹${Number(course.originalPrice).toLocaleString('en-IN')}</div>` : ''}
      </td>
      <td>
        <label class="switch" title="Toggle visibility on website">
          <input type="checkbox" class="course-vis-toggle" data-id="${course.id}" ${course.isVisible !== false ? 'checked' : ''}>
          <span class="slider-toggle"></span>
        </label>
        <span style="font-size:0.8rem; margin-left:0.5rem; color:${course.isVisible !== false ? 'var(--success)' : '#94a3b8'}; font-weight:600;">
          ${course.isVisible !== false ? 'Shown' : 'Hidden'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-sm btn-outline edit-course-btn" data-id="${course.id}" title="Edit Course Details">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn btn-sm btn-outline delete-course-btn" data-id="${course.id}" style="color:var(--danger);" title="Delete Course">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Visibility toggle
  tableBody.querySelectorAll('.course-vis-toggle').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const isVisible = GMTS_DB.toggleCourseVisibility(id);
      renderAdminCourses();
      renderDashboardOverview();
      showNotification(`Course is now ${isVisible ? 'ACTIVE & SHOWN' : 'HIDDEN'} on course list.`, 'success');
      if (typeof initCourses === 'function') initCourses();
      if (typeof initAdmissionForm === 'function') initAdmissionForm();
    });
  });

  // Edit course
  tableBody.querySelectorAll('.edit-course-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditCourseModal(btn.dataset.id));
  });

  // Delete course
  tableBody.querySelectorAll('.delete-course-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this course?')) {
        GMTS_DB.deleteCourse(btn.dataset.id);
        renderAdminCourses();
        renderDashboardOverview();
        showNotification('Course deleted.', 'info');
        if (typeof initCourses === 'function') initCourses();
        if (typeof initAdmissionForm === 'function') initAdmissionForm();
      }
    });
  });
}

function openEditCourseModal(courseId) {
  const courses = GMTS_DB.getCourses();
  const course = courseId ? courses.find(c => c.id === courseId) : null;

  const modal = document.getElementById('courseFormModal');
  const titleEl = document.getElementById('courseModalTitle');
  const form = document.getElementById('courseForm');
  if (!modal || !form) return;

  titleEl.textContent = course ? 'Edit Course Details' : 'Add New Driving Course';
  document.getElementById('courseIdInput').value = course ? course.id : '';
  document.getElementById('courseTitleInput').value = course ? course.title : '';
  document.getElementById('courseCategoryInput').value = course ? course.category : '4w';
  document.getElementById('courseDurationInput').value = course ? course.duration : '21 Days';
  document.getElementById('coursePriceInput').value = course ? course.price : '';
  document.getElementById('courseOriginalPriceInput').value = course ? (course.originalPrice || '') : '';
  document.getElementById('courseVehicleInput').value = course ? course.vehicle : 'Dual Control Swift';
  document.getElementById('courseBadgeInput').value = course ? (course.badge || '') : '';
  document.getElementById('courseDescInput').value = course ? (course.description || '') : '';
  document.getElementById('courseFeaturesInput').value = course ? (course.features || []).join('\n') : '';

  modal.classList.add('open');
}

/* ==========================================================================
   7. Gallery Manager (with Show/Hide Toggle)
   ========================================================================== */
function renderAdminGallery() {
  const tableBody = document.getElementById('adminGalleryTableBody');
  if (!tableBody) return;

  const gallery = GMTS_DB.getGallery();

  tableBody.innerHTML = gallery.map(item => `
    <tr>
      <td>
        <img src="${item.imageUrl}" alt="${escapeHtml(item.title)}" loading="lazy" class="table-thumbnail" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'">
      </td>
      <td>
        <strong>${escapeHtml(item.title)}</strong>
        <div style="font-size:0.8rem; color:#64748b;">${escapeHtml(item.caption || '')}</div>
      </td>
      <td><span class="badge badge-secondary">${escapeHtml(item.categoryName || item.category)}</span></td>
      <td>
        <label class="switch" title="Toggle visibility on website">
          <input type="checkbox" class="gal-vis-toggle" data-id="${item.id}" ${item.isVisible !== false ? 'checked' : ''}>
          <span class="slider-toggle"></span>
        </label>
        <span style="font-size:0.8rem; margin-left:0.5rem; color:${item.isVisible !== false ? 'var(--success)' : '#94a3b8'}; font-weight:600;">
          ${item.isVisible !== false ? 'Shown' : 'Hidden'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn btn-sm btn-outline edit-gal-btn" data-id="${item.id}" title="Edit Picture">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-sm btn-outline delete-gal-btn" data-id="${item.id}" style="color:var(--danger);" title="Delete Picture">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Visibility toggle
  tableBody.querySelectorAll('.gal-vis-toggle').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const isVisible = GMTS_DB.toggleGalleryVisibility(id);
      renderAdminGallery();
      renderDashboardOverview();
      showNotification(`Gallery picture is now ${isVisible ? 'VISIBLE' : 'HIDDEN'} on website.`, 'success');
      if (typeof initGallery === 'function') initGallery();
    });
  });

  // Edit photo
  tableBody.querySelectorAll('.edit-gal-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditGalleryModal(btn.dataset.id));
  });

  // Delete photo
  tableBody.querySelectorAll('.delete-gal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to remove this photo from gallery?')) {
        GMTS_DB.deleteGalleryItem(btn.dataset.id);
        renderAdminGallery();
        renderDashboardOverview();
        showNotification('Photo removed.', 'info');
        if (typeof initGallery === 'function') initGallery();
      }
    });
  });
}

function openEditGalleryModal(itemId) {
  const gallery = GMTS_DB.getGallery();
  const item = itemId ? gallery.find(g => g.id === itemId) : null;

  const modal = document.getElementById('galleryFormModal');
  const titleEl = document.getElementById('galleryModalTitle');
  const form = document.getElementById('galleryForm');
  if (!modal || !form) return;

  titleEl.textContent = item ? 'Edit Gallery Photo' : 'Add Photo to Gallery';
  document.getElementById('galleryIdInput').value = item ? item.id : '';
  document.getElementById('galleryTitleInput').value = item ? item.title : '';
  document.getElementById('galleryCategoryInput').value = item ? item.category : 'fleet';
  document.getElementById('galleryImageUrlInput').value = item ? item.imageUrl : '';
  document.getElementById('galleryCaptionInput').value = item ? (item.caption || '') : '';

  modal.classList.add('open');
}

/* ==========================================================================
   8. Form Handlers (Add/Edit Slide, Course, Gallery & Settings)
   ========================================================================== */
function initAdminForms() {
  // File upload helpers to convert chosen files to Base64
  setupFileInputToUrl('slideFileInput', 'slideImageUrlInput');
  setupFileInputToUrl('galleryFileInput', 'galleryImageUrlInput');

  // Slide Form Submission
  const slideForm = document.getElementById('slideForm');
  if (slideForm) {
    slideForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('slideIdInput').value;
      const title = document.getElementById('slideTitleInput').value.trim();
      const subtitle = document.getElementById('slideSubtitleInput').value.trim();
      const badge = document.getElementById('slideBadgeInput').value.trim();
      const imageUrl = document.getElementById('slideImageUrlInput').value.trim();
      const ctaText = document.getElementById('slideCtaTextInput').value.trim();
      const ctaLink = document.getElementById('slideCtaLinkInput').value.trim();

      if (!title || !imageUrl) {
        alert('Please provide Slide Title and Image URL or uploaded picture.');
        return;
      }

      const slideData = { title, subtitle, badge, imageUrl, ctaText, ctaLink, isVisible: true };

      if (id) {
        GMTS_DB.updateSlide(id, slideData);
        showNotification('Slide banner updated successfully!', 'success');
      } else {
        GMTS_DB.addSlide(slideData);
        showNotification('New slide banner added successfully!', 'success');
      }

      document.getElementById('slideFormModal').classList.remove('open');
      renderAdminSlides();
      renderDashboardOverview();
      if (typeof initHeroSlider === 'function') initHeroSlider();
    });
  }

  // Course Form Submission
  const courseForm = document.getElementById('courseForm');
  if (courseForm) {
    courseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('courseIdInput').value;
      const title = document.getElementById('courseTitleInput').value.trim();
      const category = document.getElementById('courseCategoryInput').value;
      const duration = document.getElementById('courseDurationInput').value.trim();
      const price = parseFloat(document.getElementById('coursePriceInput').value);
      const originalPrice = parseFloat(document.getElementById('courseOriginalPriceInput').value) || null;
      const vehicle = document.getElementById('courseVehicleInput').value.trim();
      const badge = document.getElementById('courseBadgeInput').value.trim();
      const description = document.getElementById('courseDescInput').value.trim();
      const rawFeatures = document.getElementById('courseFeaturesInput').value.trim();
      const features = rawFeatures.split('\n').map(f => f.trim()).filter(Boolean);

      let categoryName = 'Four Wheeler';
      if (category === '2w') categoryName = 'Two Wheeler';
      if (category === 'combo') categoryName = 'Combo Package';
      if (category === 'commercial') categoryName = 'Commercial / Transport';
      if (category === 'refresher') categoryName = 'Refresher Course';

      if (!title || isNaN(price)) {
        alert('Please enter a valid Course Title and Price.');
        return;
      }

      const courseData = {
        title,
        category,
        categoryName,
        duration,
        price,
        originalPrice,
        vehicle,
        badge,
        badgeColor: badge === 'Most Popular' ? 'primary' : (badge === 'Best for Beginners' ? 'success' : 'warning'),
        description,
        features,
        isVisible: true
      };

      if (id) {
        GMTS_DB.updateCourse(id, courseData);
        showNotification('Course details updated successfully!', 'success');
      } else {
        GMTS_DB.addCourse(courseData);
        showNotification('New course added successfully!', 'success');
      }

      document.getElementById('courseFormModal').classList.remove('open');
      renderAdminCourses();
      renderDashboardOverview();
      if (typeof initCourses === 'function') initCourses();
      if (typeof initAdmissionForm === 'function') initAdmissionForm();
    });
  }

  // Gallery Form Submission
  const galleryForm = document.getElementById('galleryForm');
  if (galleryForm) {
    galleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('galleryIdInput').value;
      const title = document.getElementById('galleryTitleInput').value.trim();
      const category = document.getElementById('galleryCategoryInput').value;
      const imageUrl = document.getElementById('galleryImageUrlInput').value.trim();
      const caption = document.getElementById('galleryCaptionInput').value.trim();

      let categoryName = 'Training Fleet';
      if (category === 'ground') categoryName = 'Training Ground';
      if (category === 'training') categoryName = 'Practical Classes';
      if (category === 'students') categoryName = 'Successful Students';

      if (!title || !imageUrl) {
        alert('Please enter Photo Title and Image URL or file.');
        return;
      }

      const galData = { title, category, categoryName, imageUrl, caption, isVisible: true };

      if (id) {
        GMTS_DB.updateGalleryItem(id, galData);
        showNotification('Gallery item updated!', 'success');
      } else {
        GMTS_DB.addGalleryItem(galData);
        showNotification('New photo added to gallery!', 'success');
      }

      document.getElementById('galleryFormModal').classList.remove('open');
      renderAdminGallery();
      renderDashboardOverview();
      if (typeof initGallery === 'function') initGallery();
    });
  }

  // Settings & Security Form
  const settingsForm = document.getElementById('adminSettingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentSettings = GMTS_DB.getSettings();
      const updatedSettings = {
        ...currentSettings,
        schoolName: document.getElementById('settingSchoolName').value.trim(),
        tagline: document.getElementById('settingTagline').value.trim(),
        phone: document.getElementById('settingPhone').value.trim(),
        altPhone: document.getElementById('settingAltPhone').value.trim(),
        whatsapp: document.getElementById('settingWhatsApp').value.trim(),
        email: document.getElementById('settingEmail').value.trim(),
        address: document.getElementById('settingAddress').value.trim(),
        hours: document.getElementById('settingHours').value.trim(),
        announcement: document.getElementById('settingAnnouncement').value.trim()
      };

      GMTS_DB.saveSettings(updatedSettings);

      // Handle Password change if provided
      const newUsername = document.getElementById('settingNewUsername').value.trim();
      const newPassword = document.getElementById('settingNewPassword').value;
      if (newUsername) {
        GMTS_DB.updateAuth(newUsername, newPassword || null);
      }

      showNotification('School details and settings updated successfully!', 'success');
      initSiteSettings();
    });
  }

  // Application search and filters
  const searchInput = document.getElementById('appSearchInput');
  let applicationSearchTimer = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appSearchKeyword = e.target.value.trim();
      window.clearTimeout(applicationSearchTimer);
      applicationSearchTimer = window.setTimeout(renderAdminApplications, 180);
    });
  }

  const statusFilterSelect = document.getElementById('appStatusFilterSelect');
  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', (e) => {
      appStatusFilter = e.target.value;
      renderAdminApplications();
    });
  }

  const courseFilterSelect = document.getElementById('appCourseFilterSelect');
  if (courseFilterSelect) {
    courseFilterSelect.addEventListener('change', (e) => {
      appCourseFilter = e.target.value;
      renderAdminApplications();
    });
  }

  const sortSelect = document.getElementById('appSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appSortOrder = e.target.value;
      renderAdminApplications();
    });
  }

  const datePresetSelect = document.getElementById('appDatePresetSelect');
  const customDateRange = document.getElementById('appCustomDateRange');
  const dateFromInput = document.getElementById('appDateFrom');
  const dateToInput = document.getElementById('appDateTo');

  if (datePresetSelect) {
    datePresetSelect.addEventListener('change', (e) => {
      appDatePreset = e.target.value;
      if (customDateRange) {
        customDateRange.style.display = appDatePreset === 'custom' ? 'flex' : 'none';
      }
      renderAdminApplications();
    });
  }

  if (dateFromInput) {
    dateFromInput.addEventListener('change', (e) => {
      appDateFrom = e.target.value;
      renderAdminApplications();
    });
  }

  if (dateToInput) {
    dateToInput.addEventListener('change', (e) => {
      appDateTo = e.target.value;
      renderAdminApplications();
    });
  }

  const resetFiltersBtn = document.getElementById('resetAppFiltersBtn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      appSearchKeyword = '';
      appStatusFilter = 'all';
      appCourseFilter = 'all';
      appSortOrder = 'newest';
      appDatePreset = 'all';
      appDateFrom = '';
      appDateTo = '';
      if (searchInput) searchInput.value = '';
      if (statusFilterSelect) statusFilterSelect.value = 'all';
      if (courseFilterSelect) courseFilterSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'newest';
      if (datePresetSelect) datePresetSelect.value = 'all';
      if (dateFromInput) dateFromInput.value = '';
      if (dateToInput) dateToInput.value = '';
      if (customDateRange) customDateRange.style.display = 'none';
      renderAdminApplications();
      showNotification('Candidate filters reset.', 'info');
    });
  }

  // Export CSV buttons (overview tab and applications toolbar)
  const exportBtn = document.getElementById('exportAppsCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => exportApplicationsCSV(false));
  }

  const exportToolbarBtn = document.getElementById('exportAppsToolbarBtn');
  if (exportToolbarBtn) {
    exportToolbarBtn.addEventListener('click', () => exportApplicationsCSV(true));
  }

  // Add Slide / Course / Gallery buttons
  const addSlideBtn = document.getElementById('addSlideBtn');
  if (addSlideBtn) addSlideBtn.addEventListener('click', () => openEditSlideModal(null));

  const addCourseBtn = document.getElementById('addCourseBtn');
  if (addCourseBtn) addCourseBtn.addEventListener('click', () => openEditCourseModal(null));

  const addGalleryBtn = document.getElementById('addGalleryBtn');
  if (addGalleryBtn) addGalleryBtn.addEventListener('click', () => openEditGalleryModal(null));

  // Reset defaults button
  const resetBtn = document.getElementById('resetDatabaseDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore factory default demo courses, slides, and gallery? This will reset custom additions.')) {
        GMTS_DB.resetDefaults();
        refreshAdminDashboard();
        showNotification('Database reset to defaults!', 'info');
        if (typeof initHeroSlider === 'function') initHeroSlider();
        if (typeof initCourses === 'function') initCourses();
        if (typeof initGallery === 'function') initGallery();
      }
    });
  }

  // Backup & Restore Database
  const backupBtn = document.getElementById('backupDatabaseBtn');
  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(GMTS_DB.exportDatabaseJSON());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ghoshpukur_motor_training_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  const restoreFile = document.getElementById('restoreDatabaseFileInput');
  if (restoreFile) {
    restoreFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        if (GMTS_DB.importDatabaseJSON(evt.target.result)) {
          showNotification('Database successfully restored from file!', 'success');
          refreshAdminDashboard();
          initSiteSettings();
          if (typeof initHeroSlider === 'function') initHeroSlider();
          if (typeof initCourses === 'function') initCourses();
          if (typeof initGallery === 'function') initGallery();
        } else {
          alert('Failed to import database file. Invalid JSON format.');
        }
      };
      reader.readAsText(file);
    });
  }
}

function loadAdminSettings() {
  const settings = GMTS_DB.getSettings();
  const auth = GMTS_DB.getAuth();

  document.getElementById('settingSchoolName').value = settings.schoolName || '';
  document.getElementById('settingTagline').value = settings.tagline || '';
  document.getElementById('settingPhone').value = settings.phone || '';
  document.getElementById('settingAltPhone').value = settings.altPhone || '';
  document.getElementById('settingWhatsApp').value = settings.whatsapp || '';
  document.getElementById('settingEmail').value = settings.email || '';
  document.getElementById('settingAddress').value = settings.address || '';
  document.getElementById('settingHours').value = settings.hours || '';
  document.getElementById('settingAnnouncement').value = settings.announcement || '';

  document.getElementById('settingNewUsername').value = auth.username || 'admin';
  document.getElementById('settingNewPassword').value = '';
}

function setupFileInputToUrl(fileInputId, targetUrlInputId) {
  const fileInput = document.getElementById(fileInputId);
  const targetInput = document.getElementById(targetUrlInputId);
  if (!fileInput || !targetInput) return;

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB limit. Please choose a smaller image or use an image URL.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        targetInput.value = event.target.result;
        showNotification('Local photo uploaded and encoded ready for saving!', 'success');
      };
      reader.readAsDataURL(file);
    }
  });
}

// Visual Toast Notification
function showNotification(msg, type = 'info') {
  let toast = document.getElementById('adminToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToastNotification';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 0.85rem 1.75rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  const color = type === 'success' ? '#22c55e' : '#38bdf8';
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color:${color};"></i> ${msg}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 3200);
}
