# Ghoshpukur Motor Training School - Official Website & Admin Portal

A modern, responsive, full-featured website and content management portal for **Ghoshpukur Motor Training School** (Govt. Approved & Recognized Driving Training Institute, Ghoshpukur, Siliguri, West Bengal).

---

## 🌟 Key Features

### 1. Top School Banner & Contact Bar
- Official school branding with Government Recognition Badge & Registration Number (`WB/DAR/MTS/2018/042`).
- Direct helpline links, alternate contact, official WhatsApp inquiry link, and operational hours.
- Animated Announcement Ticker bar highlighting new batch admissions and offers.

### 2. Auto-Slideable Hero Carousel
- High-resolution driving school hero banners with automatic slide transitions (every 5 seconds).
- Smooth pause-on-hover functionality.
- Interactive navigation controls (Previous / Next arrows and progress indicator dots).
- Managed via the Admin Panel: Add new banners, upload photos, and **toggle Show/Hide** with a single click.

### 3. Course Details & Fee Structure
- Displays all driving courses (4-Wheeler Basic, Highway & Advance, Two-Wheeler Bike/Scooter, VIP Combo 2W+4W, 7-Day Refresher, Commercial Transport).
- Category filtering tabs (All, 4-Wheeler, 2-Wheeler, Combo, Refresher, Commercial).
- Transparent pricing breakdown, duration, assigned dual-control vehicle, and syllabus checkmarks.
- One-click **"Enroll Now"** button that automatically scrolls to the admission form and pre-selects the chosen course.
- Full Admin CRUD: Add, edit duration/fees, delete, and **toggle Show/Hide** for any course.

### 4. Candidate Admission / Registration Form
- Comprehensive online registration form tailored for motor driving candidates:
  - **Candidate Personal Details**: Full Name, Guardian's Name, Mobile Number, Email, Date of Birth, Gender.
  - **Residential Address**: Address, City/Town, Pincode.
  - **Training Preferences**: Course selection, Vehicle category (Manual, Automatic, Bike, Scooter, Combo), Preferred batch timing slot.
  - **License & Identity**: Learner's License (LL) status, Photo ID proof type (Aadhaar, Voter ID, Passport, PAN), Special comments.
- Form validation and instant reference ID generation (`GMTS-2026-XXX`).
- Success confirmation dialog with a **Printable Receipt** and instant **WhatsApp forward** button.
- Submissions automatically sync to the Admin dashboard for follow-up.

### 5. Training Fleet & Practice Gallery
- Filterable gallery showcasing training fleet vehicles, private training grounds, classroom theory, and successful graduates.
- Interactive Lightbox view to zoom in on any training picture.
- Admin management: Upload local photos or paste image URLs, categorize, and **toggle Show/Hide**.

### 6. Full-Featured Admin Portal & Security
- **Secure Login Modal**:
  - Default Username: `admin`
  - Default Password: `admin123`
- **Dashboard Overview**:
  - Real-time metrics: Total candidate inquiries, pending follow-ups, enrolled students, active courses, visible banners.
- **Candidate Applications Manager**:
  - Search applications by name, phone, or application ID.
  - Filter by candidate status (`New`, `Contacted`, `Verified`, `Enrolled`, `Completed`).
  - View complete candidate dossier with full contact details and notes.
  - Update candidate status and write internal admin remarks.
  - **Export to CSV**: Download all candidate applications to an Excel-compatible spreadsheet with one click.
- **Slider Pictures Manager**:
  - Add / edit banners with image URLs or direct file uploads from your computer.
  - Instant **Show / Hide** toggle switch to control what visitors see.
- **Course Details Manager**:
  - Update course fees, duration, descriptions, and feature checklists.
  - Instant **Show / Hide** toggle switch.
- **Gallery Manager**:
  - Add / delete photos and toggle visibility.
- **Settings & Security**:
  - Update school name, helpline numbers, WhatsApp number, address, and announcement banner text.
  - Change Admin username and password.
  - **Backup & Restore**: Export complete website database as JSON and restore anytime.
  - Factory reset button to restore default demo data.

---

## 🚀 How to Run the Website

### Option 1: Double Click to Open in Browser
You can open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari):
```
c:\VS FILES\ghoshpukur-motor-training\index.html
```

### Option 2: Run with Local Web Server
You can launch a lightweight web server in PowerShell:
```powershell
cd "c:\VS FILES\ghoshpukur-motor-training"
python -m http.server 8080
```
Then navigate to: `http://localhost:8080` in your web browser.

---

## 🔑 Admin Credentials
- **Access URL**: Click the **"Admin Portal"** button in the top banner or **"Admin Access & Dashboard"** in the footer.
- **Username**: `admin`
- **Password**: `admin123`
*(You can change both username and password inside Admin > Settings & Backup).*

---

## 📁 Project Directory Structure
```
ghoshpukur-motor-training/
├── index.html          # Main website and integrated admin portal
├── README.md           # Documentation and user manual
├── css/
│   └── style.css       # Complete modern responsive stylesheets
├── js/
│   ├── data.js         # Persistent local storage & seed database service
│   ├── main.js         # Public website interactions (slider, courses, form, gallery)
│   └── admin.js        # Admin portal logic, auth, show/hide toggles, CSV export
└── assets/             # Assets and custom image storage
```

---

## 📄 License & Ownership
Created for **Ghoshpukur Motor Training School**. Government Approved & Recognized Motor Driving Training Institute.
