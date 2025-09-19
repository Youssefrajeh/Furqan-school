/* Quran Recitation Logger - Vanilla JS */
(function () {
  "use strict";

  // ---------------- I18N ----------------
  const I18N = {
    en: {
      app_title: "Quran Recitation Logger",
      language: "Language",
      teacher_login: "Teacher Login",
      set_password: "Set Password",
      new_password: "New Password",
      confirm_password: "Confirm Password",
      save_password: "Save Password",
      enter_password: "Enter Password",
      login: "Login",
      logout: "Logout",
      students: "Students",
      add_student: "Add Student",
      save_names: "Save Names",
      daily_entry: "Daily Entry",
      student: "Student",
      date: "Date",
      sura: "Sura",
      personal_correction: "Teacher correction",
      tajweed: "Tajweed",
      fluency: "Fluency",
      final_mark: "Final mark",
      save_entry: "Save Entry",
      entries: "Entries",
      parent_portal: "Parent Portal",
      parent_credentials: "Parent Login Credentials",
      parent_portal_url: "Parent Portal URL:",
      parent_management: "Parent Management",
      save_changes: "Save Changes",
      refresh_data: "Refresh Data",
      student_name: "Student Name",
      parent_name: "Parent Name",
      username: "Username",
      password: "Password",
      copy: "Copy",
      copy_link: "Copy URL",
      link_copied: "Copied to clipboard!",
      print: "Print",
      print_report: "Print/PDF Report",
      saved: "Saved.",
      password_saved: "Password saved. Please login.",
      password_mismatch: "Passwords do not match.",
      password_requirements: "Password must be at least 6 characters.",
      invalid_login: "Invalid password.",
      change_password: "Change Password",
      current_password: "Current Password",
      cancel: "Cancel",
      actions: "Actions",
      edit_entry: "Edit Entry",
      delete_entry: "Delete Entry",
      update_entry: "Update Entry",
      entry_updated: "Entry updated successfully!",
      confirm_delete: "Are you sure you want to delete this entry?",
      remove_student: "Remove Student",
      confirm_remove_student: "Are you sure you want to remove this student? This will also delete all their entries.",
      student_removed: "Student removed successfully!",
      no_data: "No data to display.",
      parent_report_title: "Parent Report",
    },
    ar: {
      app_title: "سجل تلاوة القرآن",
      language: "اللغة",
      teacher_login: "دخول المعلم",
      set_password: "تعيين كلمة المرور",
      new_password: "كلمة المرور الجديدة",
      confirm_password: "تأكيد كلمة المرور",
      save_password: "حفظ كلمة المرور",
      enter_password: "أدخل كلمة المرور",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      students: "الطلاب",
      add_student: "إضافة طالب",
      save_names: "حفظ الأسماء",
      daily_entry: "تسجيل يومي",
      student: "الطالب",
      date: "التاريخ",
      sura: "السورة",
      personal_correction: "تصحيح شخصي",
      teacher_correction: "تصحيح المعلم",
      tajweed: "تجويد",
      fluency: "طلاقة",
      final_mark: "الدرجة النهائية",
      save_entry: "حفظ التسجيل",
      entries: "السجلات",
      parent_portal: "بوابة أولياء الأمور",
      parent_credentials: "بيانات دخول أولياء الأمور",
      parent_portal_url: "رابط بوابة أولياء الأمور:",
      parent_management: "إدارة أولياء الأمور",
      save_changes: "حفظ التغييرات",
      refresh_data: "تحديث البيانات",
      student_name: "اسم الطالب",
      parent_name: "اسم ولي الأمر",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      copy: "نسخ",
      copy_link: "نسخ الرابط",
      link_copied: "تم النسخ إلى الحافظة!",
      print: "طباعة",
      print_report: "طباعة/PDF التقرير",
      saved: "تم الحفظ.",
      password_saved: "تم حفظ كلمة المرور. الرجاء تسجيل الدخول.",
      password_mismatch: "كلمتا المرور غير متطابقتين.",
      password_requirements: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
      invalid_login: "كلمة المرور غير صحيحة.",
      change_password: "تغيير كلمة المرور",
      current_password: "كلمة المرور الحالية",
      cancel: "إلغاء",
      actions: "الإجراءات",
      edit_entry: "تعديل التسجيل",
      delete_entry: "حذف التسجيل",
      update_entry: "تحديث التسجيل",
      entry_updated: "تم تحديث التسجيل بنجاح!",
      confirm_delete: "هل أنت متأكد من حذف هذا التسجيل؟",
      remove_student: "حذف الطالب",
      confirm_remove_student: "هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع تسجيلاته أيضاً.",
      student_removed: "تم حذف الطالب بنجاح!",
      no_data: "لا توجد بيانات للعرض.",
      parent_report_title: "تقرير ولي الأمر",
    },
  };

  let currentLanguage = localStorage.getItem("qrl_lang") || "en";

  function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("qrl_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    for (const el of document.querySelectorAll("[data-i18n]")) {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang] && I18N[lang][key]) {
        el.textContent = I18N[lang][key];
      }
    }
    // Re-render dynamic UI that depends on labels
    try {
      if (document.getElementById("studentsList")) {
        renderStudentsEditor();
      }
      const selectedId = document.getElementById("entryStudent")?.value;
      if (selectedId) {
        renderEntriesTable(selectedId);
      }
    } catch (e) {}
  }

  // ---------------- Utils ----------------
  function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function sha256Hex(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return toHex(hash);
  }

  function formatDateISO(date) {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }

  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }


  function generatePDFReport() {
    // Create a comprehensive report HTML
    const reportHTML = createComprehensiveReportHTML();
    
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
  }

  function createComprehensiveReportHTML() {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quran Recitation Report</title>
    <style>
        body {
            font-family: "Times New Roman", serif;
            font-size: 12pt;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
        }
        
        @page {
            margin: 1in;
            size: A4;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        
        .header h1 {
            font-size: 20pt;
            margin: 0 0 10px 0;
            color: #000;
        }
        
        .header .subtitle {
            font-size: 14pt;
            color: #333;
            margin: 0;
        }
        
        .report-info {
            background: #f8f8f8;
            border: 1px solid #000;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        
        .report-info h3 {
            margin: 0 0 10px 0;
            font-size: 14pt;
            color: #000;
        }
        
        .student-section {
            margin: 25px 0;
            page-break-inside: avoid;
        }
        
        .student-header {
            background: #e8e8e8;
            border: 1px solid #000;
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 5px;
        }
        
        .student-name {
            font-size: 16pt;
            font-weight: bold;
            color: #000;
            margin: 0;
        }
        
        .student-parent {
            font-size: 12pt;
            color: #666;
            margin: 5px 0 0 0;
        }
        
        .entries-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        .entries-table th,
        .entries-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }
        
        .entries-table th {
            background: #f0f0f0;
            font-weight: bold;
            font-size: 11pt;
        }
        
        .entries-table td {
            font-size: 10pt;
        }
        
        .no-entries {
            text-align: center;
            font-style: italic;
            color: #666;
            padding: 20px;
            background: #f9f9f9;
            border: 1px dashed #ccc;
        }
        
        .summary-section {
            background: #f0f0f0;
            border: 2px solid #000;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
        }
        
        .summary-title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            color: #000;
        }
        
        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .stat-item {
            background: white;
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 18pt;
            font-weight: bold;
            color: #000;
        }
        
        .stat-label {
            font-size: 10pt;
            color: #666;
            margin-top: 5px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #000;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }
        
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Quran Recitation Report</h1>
        <p class="subtitle">Comprehensive Student Progress Report</p>
    </div>
    
    <div class="report-info">
        <h3>Report Information</h3>
        <p><strong>Generated:</strong> ${currentDate} at ${currentTime}</p>
        <p><strong>Total Students:</strong> ${students.length}</p>
        <p><strong>Report Period:</strong> All Entries</p>
    </div>
`;

    // Add student sections
    students.forEach((student, index) => {
      const entries = studentIdToEntries[student.id] || [];
      const totalEntries = entries.length;
      
      html += `
    <div class="student-section">
        <div class="student-header">
            <h2 class="student-name">${student.name}</h2>
            <p class="student-parent">Parent: ${student.parentName}</p>
        </div>
`;
      
      if (totalEntries > 0) {
        html += `
        <table class="entries-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Sura</th>
                    <th>Personal Correction</th>
                    <th>Teacher Correction</th>
                    <th>Tajweed</th>
                    <th>Fluency</th>
                    <th>Final Mark</th>
                </tr>
            </thead>
            <tbody>
`;
        
        entries.forEach(entry => {
          html += `
                <tr>
                    <td>${entry.date}</td>
                    <td>${entry.sura || 'N/A'}</td>
                    <td>${entry.personalCorrection}</td>
                    <td>${entry.teacherCorrection}</td>
                    <td>${entry.tajweed}</td>
                    <td>${entry.fluency}</td>
                    <td>${entry.finalMark}</td>
                </tr>
`;
        });
        
        html += `
            </tbody>
        </table>
`;
      } else {
        html += `
        <div class="no-entries">
            No entries recorded for this student.
        </div>
`;
      }
      
      html += `
    </div>
`;
      
      // Add page break every 3 students
      if ((index + 1) % 3 === 0 && index < students.length - 1) {
        html += `<div class="page-break"></div>`;
      }
    });
    
    // Add summary section
    const totalEntries = Object.values(studentIdToEntries).reduce((sum, entries) => sum + entries.length, 0);
    const studentsWithEntries = students.filter(s => (studentIdToEntries[s.id] || []).length > 0).length;
    
    html += `
    <div class="summary-section">
        <h2 class="summary-title">Report Summary</h2>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">${students.length}</div>
                <div class="stat-label">Total Students</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${studentsWithEntries}</div>
                <div class="stat-label">Students with Entries</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${totalEntries}</div>
                <div class="stat-label">Total Entries</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${totalEntries > 0 ? Math.round(totalEntries / studentsWithEntries * 10) / 10 : 0}</div>
                <div class="stat-label">Avg Entries per Student</div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>This report was generated automatically by the Quran Recitation Logger system.</p>
        <p>For questions or support, please contact the system administrator.</p>
    </div>
</body>
</html>`;
    
    return html;
  }

  // ---------------- State ----------------
  const PASSWORD_KEY = "qrl_password_hash";
  const DATA_KEY = "qrl_app_data";

  /** @type {{id:string, name:string}[]} */
  let students = [];

  /** @type {Record<string, Array<{date:string, sura:string, personalCorrection:string, teacherCorrection:string, tajweed:string, fluency:string, finalMark:string}>>} */
  let studentIdToEntries = {};

  function createDefaultStudents() {
    const list = [];
    // Real student names provided by the teacher
    const students = [
      { id: "S1", name: "Zakareeya A.", parentId: "P1", parentName: "Zakareeya A.'s Parent" },
      { id: "S2", name: "Muhamad", parentId: "P2", parentName: "Muhamad's Parent" },
      { id: "S3", name: "Mousa", parentId: "P3", parentName: "Mousa's Parent" },
      { id: "S4", name: "Zakariya M.", parentId: "P4", parentName: "Zakariya M.'s Parent" },
      { id: "S5", name: "Bara", parentId: "P5", parentName: "Bara's Parent" },
      { id: "S6", name: "Ali", parentId: "P6", parentName: "Ali's Parent" },
      { id: "S7", name: "Shorouk", parentId: "P7", parentName: "Shorouk's Parent" },
      { id: "S8", name: "Ibrahim", parentId: "P8", parentName: "Ibrahim's Parent" },
      { id: "S9", name: "Belal", parentId: "P9", parentName: "Belal's Parent" },
      { id: "S10", name: "Juwariyyah", parentId: "P10", parentName: "Juwariyyah's Parent" },
      { id: "S11", name: "Lina", parentId: "P11", parentName: "Lina's Parent" },
      { id: "S12", name: "Jude", parentId: "P12", parentName: "Jude's Parent" },
      { id: "S13", name: "Aminah", parentId: "P13", parentName: "Aminah's Parent" }
    ];
    return students;
  }

  // ---------------- Sura Data ----------------
  const SURAS = [
    { id: "001", name: "Al-Fatiha" },
    { id: "002", name: "Al-Baqarah" },
    { id: "003", name: "Ali 'Imran" },
    { id: "004", name: "An-Nisa" },
    { id: "005", name: "Al-Ma'idah" },
    { id: "006", name: "Al-An'am" },
    { id: "007", name: "Al-A'raf" },
    { id: "008", name: "Al-Anfal" },
    { id: "009", name: "At-Tawbah" },
    { id: "010", name: "Yunus" },
    { id: "011", name: "Hud" },
    { id: "012", name: "Yusuf" },
    { id: "013", name: "Ar-Ra'd" },
    { id: "014", name: "Ibrahim" },
    { id: "015", name: "Al-Hijr" },
    { id: "016", name: "An-Nahl" },
    { id: "017", name: "Al-Isra" },
    { id: "018", name: "Al-Kahf" },
    { id: "019", name: "Maryam" },
    { id: "020", name: "Taha" },
    { id: "021", name: "Al-Anbiya" },
    { id: "022", name: "Al-Hajj" },
    { id: "023", name: "Al-Mu'minun" },
    { id: "024", name: "An-Nur" },
    { id: "025", name: "Al-Furqan" },
    { id: "026", name: "Ash-Shu'ara" },
    { id: "027", name: "An-Naml" },
    { id: "028", name: "Al-Qasas" },
    { id: "029", name: "Al-'Ankabut" },
    { id: "030", name: "Ar-Rum" },
    { id: "031", name: "Luqman" },
    { id: "032", name: "As-Sajdah" },
    { id: "033", name: "Al-Ahzab" },
    { id: "034", name: "Saba'" },
    { id: "035", name: "Fatir" },
    { id: "036", name: "Ya-Sin" },
    { id: "037", name: "As-Saffat" },
    { id: "038", name: "Sad" },
    { id: "039", name: "Az-Zumar" },
    { id: "040", name: "Ghafir" },
    { id: "041", name: "Fussilat" },
    { id: "042", name: "Ash-Shura" },
    { id: "043", name: "Az-Zukhruf" },
    { id: "044", name: "Ad-Dukhan" },
    { id: "045", name: "Al-Jathiyah" },
    { id: "046", name: "Al-Ahqaf" },
    { id: "047", name: "Muhammad" },
    { id: "048", name: "Al-Fath" },
    { id: "049", name: "Al-Hujurat" },
    { id: "050", name: "Qaf" },
    { id: "051", name: "Adh-Dhariyat" },
    { id: "052", name: "At-Tur" },
    { id: "053", name: "An-Najm" },
    { id: "054", name: "Al-Qamar" },
    { id: "055", name: "Ar-Rahman" },
    { id: "056", name: "Al-Waqi'ah" },
    { id: "057", name: "Al-Hadid" },
    { id: "058", name: "Al-Mujadila" },
    { id: "059", name: "Al-Hashr" },
    { id: "060", name: "Al-Mumtahanah" },
    { id: "061", name: "As-Saff" },
    { id: "062", name: "Al-Jumu'ah" },
    { id: "063", name: "Al-Munafiqun" },
    { id: "064", name: "At-Taghabun" },
    { id: "065", name: "At-Talaq" },
    { id: "066", name: "At-Tahrim" },
    { id: "067", name: "Al-Mulk" },
    { id: "068", name: "Al-Qalam" },
    { id: "069", name: "Al-Haqqah" },
    { id: "070", name: "Al-Ma'arij" },
    { id: "071", name: "Nuh" },
    { id: "072", name: "Al-Jinn" },
    { id: "073", name: "Al-Muzzammil" },
    { id: "074", name: "Al-Muddaththir" },
    { id: "075", name: "Al-Qiyamah" },
    { id: "076", name: "Al-Insan" },
    { id: "077", name: "Al-Mursalat" },
    { id: "078", name: "An-Naba'" },
    { id: "079", name: "An-Nazi'at" },
    { id: "080", name: "'Abasa" },
    { id: "081", name: "At-Takwir" },
    { id: "082", name: "Al-Infitar" },
    { id: "083", name: "Al-Mutaffifin" },
    { id: "084", name: "Al-Inshiqaq" },
    { id: "085", name: "Al-Buruj" },
    { id: "086", name: "At-Tariq" },
    { id: "087", name: "Al-A'la" },
    { id: "088", name: "Al-Ghashiyah" },
    { id: "089", name: "Al-Fajr" },
    { id: "090", name: "Al-Balad" },
    { id: "091", name: "Ash-Shams" },
    { id: "092", name: "Al-Layl" },
    { id: "093", name: "Ad-Duha" },
    { id: "094", name: "Ash-Sharh" },
    { id: "095", name: "At-Tin" },
    { id: "096", name: "Al-'Alaq" },
    { id: "097", name: "Al-Qadr" },
    { id: "098", name: "Al-Bayyinah" },
    { id: "099", name: "Az-Zalzalah" },
    { id: "100", name: "Al-'Adiyat" },
    { id: "101", name: "Al-Qari'ah" },
    { id: "102", name: "At-Takathur" },
    { id: "103", name: "Al-'Asr" },
    { id: "104", name: "Al-Humazah" },
    { id: "105", name: "Al-Fil" },
    { id: "106", name: "Quraysh" },
    { id: "107", name: "Al-Ma'un" },
    { id: "108", name: "Al-Kawthar" },
    { id: "109", name: "Al-Kafirun" },
    { id: "110", name: "An-Nasr" },
    { id: "111", name: "Al-Masad" },
    { id: "112", name: "Al-Ikhlas" },
    { id: "113", name: "Al-Falaq" },
    { id: "114", name: "An-Nas" }
  ];

  // Helper function to get Surah name from ID
  function getSurahName(surahId) {
    const surah = SURAS.find(s => s.id === surahId);
    return surah ? surah.name : surahId;
  }

  // ---------------- Parent Management ----------------
  let parentCredentials = {
    "P1": { username: "parent1", password: "demo123" },
    "P2": { username: "parent2", password: "demo123" },
    "P3": { username: "parent3", password: "demo123" },
    "P4": { username: "parent4", password: "demo123" },
    "P5": { username: "parent5", password: "demo123" },
    "P6": { username: "parent6", password: "demo123" },
    "P7": { username: "parent7", password: "demo123" },
    "P8": { username: "parent8", password: "demo123" },
    "P9": { username: "parent9", password: "demo123" },
    "P10": { username: "parent10", password: "demo123" },
    "P11": { username: "parent11", password: "demo123" },
    "P12": { username: "parent12", password: "demo123" },
    "P13": { username: "parent13", password: "demo123" }
  };

  function renderParentManagement() {
    const tbody = document.getElementById("parentTableBody");
    tbody.innerHTML = "";

    students.forEach(student => {
      const row = document.createElement("tr");
      const credentials = parentCredentials[student.parentId] || { username: "", password: "" };
      
      row.innerHTML = `
        <td>${student.name}</td>
        <td>
          <input type="text" value="${student.parentName}" 
                 data-field="parentName" data-parent-id="${student.parentId}" />
        </td>
        <td>
          <input type="text" value="${credentials.username}" 
                 data-field="username" data-parent-id="${student.parentId}" />
        </td>
        <td class="password-cell">
          <input type="password" value="${credentials.password}" 
                 data-field="password" data-parent-id="${student.parentId}" />
          <button type="button" class="password-toggle-btn" onclick="toggleParentPassword(this)">
            👁️
          </button>
        </td>
        <td class="action-buttons">
          <button type="button" class="btn-reset" onclick="resetParentCredentials('${student.parentId}')">
            Reset
          </button>
        </td>
      `;
      
      tbody.appendChild(row);
    });
  }

  function toggleParentPassword(button) {
    const input = button.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      button.textContent = "🙈";
    } else {
      input.type = "password";
      button.textContent = "👁️";
    }
  }

  function resetParentCredentials(parentId) {
    const student = students.find(s => s.parentId === parentId);
    if (student) {
      const defaultCredentials = { username: `parent${parentId.slice(1)}`, password: "demo123" };
      parentCredentials[parentId] = defaultCredentials;
      
      // Update the input fields
      const row = document.querySelector(`input[data-parent-id="${parentId}"][data-field="username"]`).closest("tr");
      row.querySelector('input[data-field="username"]').value = defaultCredentials.username;
      row.querySelector('input[data-field="password"]').value = defaultCredentials.password;
      
      alert(`Reset credentials for ${student.name}'s parent to:\nUsername: ${defaultCredentials.username}\nPassword: ${defaultCredentials.password}`);
    }
  }

  function saveParentChanges() {
    const inputs = document.querySelectorAll('#parentTableBody input');
    let hasChanges = false;

    inputs.forEach(input => {
      const parentId = input.getAttribute('data-parent-id');
      const field = input.getAttribute('data-field');
      const value = input.value.trim();

      if (field === 'parentName') {
        const student = students.find(s => s.parentId === parentId);
        if (student && student.parentName !== value) {
          student.parentName = value;
          hasChanges = true;
        }
      } else if (field === 'username' || field === 'password') {
        if (!parentCredentials[parentId]) {
          parentCredentials[parentId] = {};
        }
        if (parentCredentials[parentId][field] !== value) {
          parentCredentials[parentId][field] = value;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      saveData();
      alert(I18N[currentLanguage].saved || "Changes saved successfully!");
    } else {
      alert("No changes to save.");
    }
  }

  function showParentManagement() {
    // Hide all main content sections
    document.querySelectorAll('.main-content').forEach(section => {
      section.style.display = 'none';
    });
    
    // Show parent management section
    document.getElementById('parentManagementSection').style.display = 'block';
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.getElementById('parentManagementBtn').classList.add('active');
    
    // Render parent data
    renderParentManagement();
  }

  // ---------------- Data Persistence ----------------
  async function saveData() {
    const data = {
      students,
      entries: studentIdToEntries,
      parentCredentials,
      lastSaved: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log('Data saved successfully to JSON file');
        // Also keep a backup in localStorage for offline access
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
      } else {
        console.error('Failed to save data to server');
        // Fallback to localStorage
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving data:', error);
      // Fallback to localStorage
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
  }

  async function loadData() {
    try {
      // Try to load from server first
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.students)) {
            students = data.students;
          }
          if (typeof data.entries === 'object' && data.entries !== null) {
            studentIdToEntries = data.entries;
          }
          if (typeof data.parentCredentials === 'object' && data.parentCredentials !== null) {
            parentCredentials = data.parentCredentials;
          }
          ensureEntryArrays();

          // Force update student names to match current defaults
          const defaultStudents = createDefaultStudents();
          let needsUpdate = false;

          students.forEach((student, index) => {
            if (defaultStudents[index]) {
              const newName = defaultStudents[index].name;
              const newParentName = defaultStudents[index].parentName;
              if (student.name !== newName || student.parentName !== newParentName) {
                student.name = newName;
                student.parentName = newParentName;
                needsUpdate = true;
              }
            }
          });

          if (needsUpdate) {
            await saveData(); // Save updated names immediately
          }

          console.log('Data loaded successfully from JSON file');
          return true;
        }
      } catch (serverError) {
        console.warn('Failed to load from server, trying localStorage:', serverError);
      }

      // Fallback to localStorage
      const saved = localStorage.getItem(DATA_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (Array.isArray(data.students)) {
          students = data.students;
        }
        if (typeof data.entries === 'object' && data.entries !== null) {
          studentIdToEntries = data.entries;
        }
        if (typeof data.parentCredentials === 'object' && data.parentCredentials !== null) {
          parentCredentials = data.parentCredentials;
        }
        ensureEntryArrays();

        // Force update student names to match current defaults
        const defaultStudents = createDefaultStudents();
        let needsUpdate = false;

        students.forEach((student, index) => {
          if (defaultStudents[index]) {
            const newName = defaultStudents[index].name;
            const newParentName = defaultStudents[index].parentName;
            if (student.name !== newName || student.parentName !== newParentName) {
              student.name = newName;
              student.parentName = newParentName;
              needsUpdate = true;
            }
          }
        });

        if (needsUpdate) {
          await saveData(); // Save updated names immediately
        }

        console.log('Data loaded from localStorage backup');
        return true;
      }
    } catch (e) {
      console.warn('Failed to load saved data:', e);
    }
    return false;
  }

  // ---------------- Auth ----------------
  function show(element) { element.hidden = false; }
  function hide(element) { element.hidden = true; }

  function initAuth() {
    const hasPassword = !!localStorage.getItem(PASSWORD_KEY);
    const setupBox = document.getElementById("setupBox");
    const loginBox = document.getElementById("loginBox");
    if (hasPassword) {
      hide(setupBox);
      show(loginBox);
    } else {
      show(setupBox);
      hide(loginBox);
    }
  }

  async function handleSavePassword() {
    const newPwd = document.getElementById("newPassword").value.trim();
    const confirmPwd = document.getElementById("confirmPassword").value.trim();
    const msg = document.getElementById("setupMsg");
    if (newPwd.length < 6) {
      msg.textContent = I18N[currentLanguage].password_requirements;
      return;
    }
    if (newPwd !== confirmPwd) {
      msg.textContent = I18N[currentLanguage].password_mismatch;
      return;
    }
    const hash = await sha256Hex(newPwd);
    localStorage.setItem(PASSWORD_KEY, hash);
    msg.textContent = I18N[currentLanguage].password_saved;
    initAuth();
  }

  async function handleLogin() {
    const pwd = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");
    const expected = localStorage.getItem(PASSWORD_KEY);
    const got = await sha256Hex(pwd);
    if (got === expected) {
      hide(document.getElementById("authSection"));
      show(document.getElementById("appSection"));
      // Initialize change password functionality after login
      initializeChangePassword();
    } else {
      msg.textContent = I18N[currentLanguage].invalid_login;
    }
  }

  function handleLogout() {
    // Redirect to main landing page
    window.location.href = "index.html";
  }

  // ---------------- Students ----------------
  function renderStudentNavigation() {
    const container = document.getElementById("studentNavList");
    container.innerHTML = "";
    students.forEach((s, idx) => {
      const navItem = document.createElement("div");
      navItem.className = "student-nav-item";
      navItem.textContent = s.name;
      navItem.setAttribute("data-student-id", s.id);
      
      // Set first student as active by default
      if (idx === 0) {
        navItem.classList.add("active");
      }
      
      navItem.addEventListener("click", () => {
        // Remove active class from all items
        document.querySelectorAll(".student-nav-item").forEach(item => {
          item.classList.remove("active");
        });
        // Add active class to clicked item
        navItem.classList.add("active");
        // Update selected student
        document.getElementById("entryStudent").value = s.id;
        renderEntriesTable(s.id);
      });
      
      container.appendChild(navItem);
    });
  }

  function renderStudentsEditor() {
    const container = document.getElementById("studentsList");
    container.innerHTML = "";
    students.forEach((s, idx) => {
      const wrap = document.createElement("div");
      const label = document.createElement("label");
      label.textContent = `${I18N[currentLanguage].student} ${idx + 1}: ${s.name}`;
      label.style.fontSize = "12px";
      label.style.color = "#9ca3af";
      const input = document.createElement("input");
      input.value = s.name;
      input.setAttribute("data-student-id", s.id);
      
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn-remove-student";
      removeBtn.innerHTML = "🗑️";
      removeBtn.title = I18N[currentLanguage].remove_student || "Remove Student";
      removeBtn.addEventListener("click", () => removeStudent(s.id, s.name));
      
      wrap.appendChild(label);
      wrap.appendChild(input);
      wrap.appendChild(removeBtn);
      container.appendChild(wrap);
    });
  }

  function removeStudent(studentId, studentName) {
    const confirmMsg = I18N[currentLanguage].confirm_remove_student || 
      `Are you sure you want to remove "${studentName}"? This will also delete all their entries.`;
    
    if (confirm(confirmMsg)) {
      // Remove student from array
      const studentIndex = students.findIndex(s => s.id === studentId);
      if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
      }
      
      // Remove student entries
      delete studentIdToEntries[studentId];
      
      // Save data
      saveData();
      
      // Re-render everything
      renderStudentNavigation();
      renderStudentsEditor();
      renderStudentSelect();
      
      // Clear entries table if the removed student was selected
      const currentStudent = document.getElementById("entryStudent").value;
      if (currentStudent === studentId) {
        document.getElementById("entriesTableWrap").innerHTML = 
          `<div class="no-data">${I18N[currentLanguage].no_data}</div>`;
      }
      
      alert(I18N[currentLanguage].student_removed || "Student removed successfully!");
    }
  }

  function renderStudentSelect() {
    const sel = document.getElementById("entryStudent");
    sel.innerHTML = "";
    for (const s of students) {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      sel.appendChild(opt);
    }
  }

  function renderSuraSelect() {
    const sel = document.getElementById("entrySura");
    sel.innerHTML = "";
    for (const sura of SURAS) {
      const opt = document.createElement("option");
      opt.value = sura.id;
      opt.textContent = `${sura.id} - ${sura.name}`;
      sel.appendChild(opt);
    }
  }

  function ensureEntryArrays() {
    for (const s of students) {
      if (!studentIdToEntries[s.id]) studentIdToEntries[s.id] = [];
    }
  }

  // ---------------- Validation ----------------
  function validateEntry(entry) {
    const errors = [];
    
    // Validate date
    if (!entry.date) {
      errors.push("Date is required");
    } else {
      const date = new Date(entry.date);
      if (isNaN(date.getTime())) {
        errors.push("Invalid date format");
      }
    }
    
    // Validate sura
    if (!entry.sura) {
      errors.push("Sura is required");
    }
    
    // Validate grades (1-10)
    const gradeFields = ['personalCorrection', 'teacherCorrection', 'tajweed', 'fluency', 'finalMark'];
    gradeFields.forEach(field => {
      const value = entry[field];
      if (value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 1 || numValue > 10) {
          errors.push(`${field} must be a number between 1 and 10`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // ---------------- Entries ----------------
  function upsertEntry(studentId, entry) {
    // Validate entry before saving
    const validation = validateEntry(entry);
    if (!validation.isValid) {
      alert("Validation Error:\n" + validation.errors.join("\n"));
      return false;
    }
    
    const list = studentIdToEntries[studentId] || (studentIdToEntries[studentId] = []);
    const existing = list.find((e) => e.date === entry.date);
    if (existing) {
      Object.assign(existing, entry);
    } else {
      list.push(entry);
    }
    list.sort((a, b) => a.date.localeCompare(b.date));
    saveData(); // Auto-save after each entry
    return true;
  }

  function renderEntriesTable(studentId) {
    const wrap = document.getElementById("entriesTableWrap");
    const entries = studentIdToEntries[studentId] || [];
    if (entries.length === 0) {
      wrap.innerHTML = `<div class="no-data">${I18N[currentLanguage].no_data}</div>`;
      return;
    }
    
    // Get student name
    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : "Unknown Student";
    
    const t = document.createElement("table");
    const thead = document.createElement("thead");
    const hdr = document.createElement("tr");
    const keys = [
      "student",
      "date",
      "sura",
      "personal_correction",
      "teacher_correction",
      "tajweed",
      "fluency",
      "final_mark",
      "actions",
    ];
    for (const k of keys) {
      const th = document.createElement("th");
      th.textContent = I18N[currentLanguage][k] || k;
      hdr.appendChild(th);
    }
    thead.appendChild(hdr);
    t.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const tr = document.createElement("tr");
      const cols = [
        studentName,
        e.date,
        getSurahName(e.sura) || "",
        e.personalCorrection,
        e.teacherCorrection,
        e.tajweed,
        e.fluency,
        e.finalMark,
      ];
      for (const c of cols) {
        const td = document.createElement("td");
        td.textContent = c;
        tr.appendChild(td);
      }
      
      // Add actions column
      const actionsTd = document.createElement("td");
      actionsTd.className = "entry-actions";
      
      const editBtn = document.createElement("button");
      editBtn.className = "btn-edit";
      editBtn.innerHTML = "✏️";
      editBtn.title = I18N[currentLanguage].edit_entry || "Edit Entry";
      editBtn.addEventListener("click", () => editEntry(studentId, i, e));
      
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-delete";
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.title = I18N[currentLanguage].delete_entry || "Delete Entry";
      deleteBtn.addEventListener("click", () => deleteEntry(studentId, i));
      
      actionsTd.appendChild(editBtn);
      actionsTd.appendChild(deleteBtn);
      tr.appendChild(actionsTd);
      
      tbody.appendChild(tr);
    }
    t.appendChild(tbody);
    wrap.innerHTML = "";
    wrap.appendChild(t);
  }

  // ---------------- Entry Management ----------------
  function editEntry(studentId, entryIndex, entry) {
    // Pre-fill the form with existing entry data
    document.getElementById("entryStudent").value = studentId;
    document.getElementById("entryDate").value = entry.date;
    document.getElementById("entrySura").value = entry.sura || "";
    document.getElementById("personalCorrection").value = entry.personalCorrection;
    document.getElementById("teacherCorrection").value = entry.teacherCorrection;
    document.getElementById("tajweed").value = entry.tajweed;
    document.getElementById("fluency").value = entry.fluency;
    document.getElementById("finalMark").value = entry.finalMark;
    
    // Store the entry index for updating
    document.getElementById("entryForm").setAttribute("data-editing-index", entryIndex);
    
    // Change the submit button text
    const submitBtn = document.querySelector("#entryForm button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = I18N[currentLanguage].update_entry || "Update Entry";
    submitBtn.setAttribute("data-original-text", originalText);
    
    // Show cancel button
    const cancelBtn = document.getElementById("cancelEditBtn");
    if (cancelBtn) {
      cancelBtn.style.display = "inline-block";
    }
    
    // Scroll to the form
    document.getElementById("entryForm").scrollIntoView({ behavior: 'smooth' });
  }

  function deleteEntry(studentId, entryIndex) {
    const entry = studentIdToEntries[studentId][entryIndex];
    const confirmMsg = I18N[currentLanguage].confirm_delete || 
      `Are you sure you want to delete the entry for ${entry.date}?`;
    
    if (confirm(confirmMsg)) {
      studentIdToEntries[studentId].splice(entryIndex, 1);
      saveData(); // Auto-save after deletion
      renderEntriesTable(studentId);
    }
  }

  function cancelEdit() {
    // Clear the form
    document.getElementById("entryForm").reset();
    document.getElementById("entryDate").value = formatDateISO(new Date());
    
    // Remove editing state
    document.getElementById("entryForm").removeAttribute("data-editing-index");
    
    // Restore original button text
    const submitBtn = document.querySelector("#entryForm button[type='submit']");
    const originalText = submitBtn.getAttribute("data-original-text");
    if (originalText) {
      submitBtn.textContent = originalText;
      submitBtn.removeAttribute("data-original-text");
    }
    
    // Hide cancel button
    const cancelBtn = document.getElementById("cancelEditBtn");
    if (cancelBtn) {
      cancelBtn.style.display = "none";
    }
  }

  // ---------------- Data Management ----------------
  function saveStudentNames() {
    const inputs = document.querySelectorAll("#studentsList input[data-student-id]");
    inputs.forEach((inp) => {
      const id = inp.getAttribute("data-student-id");
      const s = students.find((x) => x.id === id);
      if (s) s.name = inp.value.trim() || s.name;
    });
    saveData(); // Auto-save after name changes
  }

  // ---------------- Parent Report ----------------
  function buildParentReportHTML(student, entries, lang) {
    const t = I18N[lang];
    const style = `
      <style>
        body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, \"Noto Naskh Arabic UI\", \"Noto Sans\", sans-serif; margin:0; padding:16px;}
        header{display:flex; align-items:center; gap:8px; padding:8px 0;}
        .sp{flex:1}
        h1{font-size:20px; margin:0}
        #meta{color:#444; margin-top:4px;}
        table{width:100%; border-collapse:collapse; margin-top:12px}
        th,td{border:1px solid #bbb; padding:8px; text-align:start}
        thead th{background:#eee}
        .no{color:#666; font-style:italic}
        .toolbar{display:flex; gap:8px; margin:8px 0}
        @media print {.toolbar{display:none}}
      </style>
    `;
    const rows = entries.map(e => `
      <tr>
        <td>${e.date}</td>
        <td>${escapeHtml(e.personalCorrection)}</td>
        <td>${escapeHtml(e.teacherCorrection)}</td>
        <td>${escapeHtml(e.tajweed)}</td>
        <td>${escapeHtml(e.fluency)}</td>
        <td>${escapeHtml(e.finalMark)}</td>
      </tr>
    `).join("");
    const table = entries.length ? `
      <table>
        <thead><tr>
          <th>${t.date}</th>
          <th>${t.sura}</th>
          <th>${t.personal_correction}</th>
          <th>${t.teacher_correction}</th>
          <th>${t.tajweed}</th>
          <th>${t.fluency}</th>
          <th>${t.final_mark}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    ` : `<div class="no">${t.no_data}</div>`;

    const dir = lang === "ar" ? "rtl" : "ltr";
    const json = JSON.stringify({ student, entries, lang });
    return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.parent_report_title} - ${escapeHtml(student.name)}</title>
  ${style}
</head>
<body>
  <script id="data" type="application/json">${json.replace(/</g, "\\u003c")}</script>
  <header>
    <h1>${t.parent_report_title}</h1>
    <div class="sp"></div>
    <label>${t.language}: <select id="langSel"><option value="en">English</option><option value="ar">العربية</option></select></label>
    <div class="toolbar"><button onclick="window.print()">${t.print}</button></div>
  </header>
  <div id="meta">${escapeHtml(student.name)}</div>
  <div id="tableWrap">${table}</div>
  <script>
    (function(){
      var dataEl = document.getElementById('data');
      var obj = {};
      try { obj = JSON.parse(dataEl.textContent || '{}'); } catch(e) { obj = {}; }
      var current = obj.lang || 'en';
      var dict = ${JSON.stringify(I18N)};
      var sel = document.getElementById('langSel');
      sel.value = current;
      sel.addEventListener('change', function(){
        var l = sel.value;
        document.documentElement.lang = l;
        document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
        // naive relabel
        var t = dict[l];
        document.title = t.parent_report_title + ' - ' + obj.student.name;
        document.querySelector('header h1').textContent = t.parent_report_title;
        document.querySelector('label').firstChild.nodeValue = t.language + ': ';
        document.querySelector('.toolbar button').textContent = t.print;
        var ths = document.querySelectorAll('thead th');
        var keys = ['date','personal_correction','teacher_correction','tajweed','fluency','final_mark'];
        for (var i=0;i<ths.length;i++){ ths[i].textContent = t[keys[i]]; }
      });
    })();
  </script>
</body>
</html>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function handleGenerateReport() {
    const sel = document.getElementById("entryStudent");
    const studentId = sel.value;
    const student = students.find((s) => s.id === studentId);
    const entries = (studentIdToEntries[studentId] || []).slice();
    const html = buildParentReportHTML(student, entries, currentLanguage);
    const safeName = student.name.replace(/[^\w\-\u0600-\u06FF ]+/g, "_").trim().replace(/\s+/g, "-");
    downloadTextFile(`${safeName}-report.html`, html);
  }

  // ---------------- Password Toggle Functionality ----------------
  function setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    if (input && toggle) {
      toggle.addEventListener("click", () => {
        if (input.type === "password") {
          input.type = "text";
          toggle.textContent = "🙈";
        } else {
          input.type = "password";
          toggle.textContent = "👁️";
        }
      });
    }
  }

  // ---------------- Init & Events ----------------
  async function init() {
    // Language
    const langSelect = document.getElementById("langSelect");
    langSelect.value = currentLanguage;
    langSelect.addEventListener("change", () => applyLanguage(langSelect.value));
    applyLanguage(currentLanguage);

    // Auth
    initAuth();
    document.getElementById("savePasswordBtn").addEventListener("click", () => { handleSavePassword(); });
    document.getElementById("loginBtn").addEventListener("click", () => { handleLogin(); });
    document.getElementById("logoutBtn").addEventListener("click", () => { handleLogout(); });
    
    // Enter key support for password fields
    document.getElementById("newPassword").addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSavePassword();
    });
    document.getElementById("confirmPassword").addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSavePassword();
    });
    document.getElementById("loginPassword").addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });

    // Setup password toggles after auth initialization
    setupPasswordToggle("loginPassword", "toggleLoginPassword");
    setupPasswordToggle("newPassword", "toggleNewPassword");
    setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

    // Students & default data
    const dataLoaded = await loadData();
    if (!dataLoaded) {
      // No saved data, create defaults
      students = createDefaultStudents();
      studentIdToEntries = {};
      ensureEntryArrays();
      await saveData(); // Save initial defaults
    }
    renderStudentNavigation();
    renderStudentsEditor();
    renderStudentSelect();
    renderSuraSelect();
    document.getElementById("entryDate").value = formatDateISO(new Date());

    // Students actions
    document.getElementById("addStudentBtn").addEventListener("click", () => {
      const nextIndex = students.length + 1;
      const newStudent = { id: `S${Date.now()}`, name: `Student ${nextIndex}` };
      students.push(newStudent);
      studentIdToEntries[newStudent.id] = [];
      saveData(); // Auto-save after adding student
      renderStudentNavigation();
      renderStudentsEditor();
      renderStudentSelect();
    });
    document.getElementById("saveNamesBtn").addEventListener("click", () => {
      saveStudentNames();
      renderStudentNavigation();
      renderStudentSelect();
      // Feedback
      alert(I18N[currentLanguage].saved);
    });

    // Entry form
    document.getElementById("entryForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const studentId = document.getElementById("entryStudent").value;
      const date = document.getElementById("entryDate").value || formatDateISO(new Date());
      const sura = document.getElementById("entrySura").value;
      const entry = {
        date,
        sura,
        personalCorrection: document.getElementById("personalCorrection").value.trim(),
        teacherCorrection: document.getElementById("teacherCorrection").value.trim(),
        tajweed: document.getElementById("tajweed").value.trim(),
        fluency: document.getElementById("fluency").value.trim(),
        finalMark: document.getElementById("finalMark").value.trim(),
      };
      
      // Check if we're editing an existing entry
      const editingIndex = e.target.getAttribute("data-editing-index");
      if (editingIndex !== null) {
        // Validate before updating existing entry
        const validation = validateEntry(entry);
        if (!validation.isValid) {
          alert("Validation Error:\n" + validation.errors.join("\n"));
          return;
        }
        // Update existing entry
        studentIdToEntries[studentId][editingIndex] = entry;
        saveData(); // Auto-save after update
        cancelEdit(); // Reset form to create mode
        alert(I18N[currentLanguage].entry_updated || "Entry updated successfully!");
      } else {
        // Create new entry (validation happens in upsertEntry)
        const success = upsertEntry(studentId, entry);
        if (success) {
          alert(I18N[currentLanguage].saved);
        }
      }
      
      renderEntriesTable(studentId);
    });
    
    // Calendar button functionality
    document.getElementById("calendarBtn").addEventListener("click", () => {
      const dateInput = document.getElementById("entryDate");
      dateInput.focus();
      dateInput.showPicker && dateInput.showPicker(); // Modern browsers
    });
    
    // Quick date buttons functionality
    setupQuickDateButtons();
    
    // Cancel edit button
    document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);
    
    // Enter key support for entry form fields
    const entryFields = ["personalCorrection", "teacherCorrection", "tajweed", "fluency", "finalMark"];
    entryFields.forEach(fieldId => {
      document.getElementById(fieldId).addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          document.getElementById("entryForm").dispatchEvent(new Event("submit"));
        }
      });
    });

    // Entries render default selected
    const initialStudentId = students[0].id;
    document.getElementById("entryStudent").value = initialStudentId;
    renderEntriesTable(initialStudentId);
    document.getElementById("entryStudent").addEventListener("change", () => {
      const sid = document.getElementById("entryStudent").value;
      renderEntriesTable(sid);
    });

    // Data is automatically saved to localStorage in JSON format

    // Parent portal auto-loads data from localStorage
    // Generate parent credentials list
    function generateParentCredentials() {
      // Group students by parent
      const parentGroups = {};
      students.forEach(student => {
        if (!parentGroups[student.parentId]) {
          parentGroups[student.parentId] = {
            parentId: student.parentId,
            parentName: student.parentName,
            children: []
          };
        }
        parentGroups[student.parentId].children.push(student);
      });

      // Parent credentials mapping (DEMO VERSION - Replace with real credentials in production)
      const parentCredentials = {
        "P1": { username: "parent1", password: "demo123" },
        "P2": { username: "parent2", password: "demo123" },
        "P3": { username: "parent3", password: "demo123" },
        "P4": { username: "parent4", password: "demo123" },
        "P5": { username: "parent5", password: "demo123" },
        "P6": { username: "parent6", password: "demo123" },
        "P7": { username: "parent7", password: "demo123" },
        "P8": { username: "parent8", password: "demo123" },
        "P9": { username: "parent9", password: "demo123" },
        "P10": { username: "parent10", password: "demo123" },
        "P11": { username: "parent11", password: "demo123" },
        "P12": { username: "parent12", password: "demo123" },
        "P13": { username: "parent13", password: "demo123" }
      };

      const credentialsContainer = document.createElement("div");
      credentialsContainer.className = "pane";
      credentialsContainer.innerHTML = `
        <h3 data-i18n="parent_credentials">Parent Login Credentials</h3>
        <div class="parent-links">
          ${Object.values(parentGroups).map(parent => {
            const creds = parentCredentials[parent.parentId];
            return `
              <div class="parent-link-item">
                <label>${parent.parentName} (${parent.children.length} child${parent.children.length > 1 ? 'ren' : ''}):</label>
                <div class="children-list">
                  ${parent.children.map(child => `<span class="child-name">${child.name}</span>`).join(', ')}
                </div>
                <div class="credentials">
                  <div class="cred-row">
                    <label>Username:</label>
                    <input type="text" readonly value="${creds.username}" onclick="this.select()">
                    <button onclick="copyToClipboard('${creds.username}')" data-i18n="copy">Copy</button>
                  </div>
                  <div class="cred-row">
                    <label>Password:</label>
                    <input type="text" readonly value="${creds.password}" onclick="this.select()">
                    <button onclick="copyToClipboard('${creds.password}')" data-i18n="copy">Copy</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: #0a0f1b; border-radius: 8px; border: 1px solid var(--border);">
          <strong data-i18n="parent_portal_url">Parent Portal URL:</strong>
          <input type="text" readonly value="${window.location.origin}/parent.html" onclick="this.select()" style="margin: 8px 0;">
          <button onclick="copyToClipboard('${window.location.origin}/parent.html')" data-i18n="copy_link">Copy URL</button>
        </div>
      `;
      
      // Insert after entries pane
      const entriesPane = document.querySelector('.pane:last-of-type');
      entriesPane.parentNode.insertBefore(credentialsContainer, entriesPane.nextSibling);
      
      // Apply translations
      applyLanguage(currentLanguage);
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert(I18N[currentLanguage].link_copied || "Link copied to clipboard!");
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(I18N[currentLanguage].link_copied || "Link copied to clipboard!");
      });
    }
    
    // Generate parent credentials after initial setup
    generateParentCredentials();

    // Change password functionality will be initialized after login
  }

  function initializeChangePassword() {
    // Setup password toggles for change password modal
    setupPasswordToggle("currentPassword", "toggleCurrentPassword");
    setupPasswordToggle("newPasswordChange", "toggleNewPasswordChange");
    setupPasswordToggle("confirmPasswordChange", "toggleConfirmPasswordChange");
    
    // Print/PDF button functionality
    document.getElementById("printAllBtn").addEventListener("click", () => {
      // Check if user wants PDF or print
      const choice = confirm("Choose output format:\nOK = Generate PDF\nCancel = Print to printer");
      if (choice) {
        generatePDFReport();
      } else {
        window.print();
      }
    });
    
    // Change password functionality
    document.getElementById("changePasswordBtn").addEventListener("click", () => {
      document.getElementById("changePasswordModal").style.display = "flex";
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPasswordChange").value = "";
      document.getElementById("confirmPasswordChange").value = "";
      document.getElementById("changePasswordMsg").textContent = "";
    });

    document.getElementById("saveNewPasswordBtn").addEventListener("click", async () => {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPasswordChange").value;
      const confirmPassword = document.getElementById("confirmPasswordChange").value;
      const msg = document.getElementById("changePasswordMsg");

      if (!currentPassword || !newPassword || !confirmPassword) {
        msg.textContent = I18N[currentLanguage].password_requirements;
        return;
      }

      if (newPassword !== confirmPassword) {
        msg.textContent = I18N[currentLanguage].password_mismatch;
        return;
      }

      if (newPassword.length < 6) {
        msg.textContent = I18N[currentLanguage].password_requirements;
        return;
      }

      // Verify current password
      const currentHash = localStorage.getItem("qrl_password_hash");
      const inputHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(currentPassword));
      const inputHashHex = Array.from(new Uint8Array(inputHash)).map(b => b.toString(16).padStart(2, '0')).join('');

      if (inputHashHex !== currentHash) {
        msg.textContent = I18N[currentLanguage].invalid_login;
        return;
      }

      // Save new password
      const newHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(newPassword));
      const newHashHex = Array.from(new Uint8Array(newHash)).map(b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem("qrl_password_hash", newHashHex);

      msg.textContent = I18N[currentLanguage].password_saved;
      setTimeout(() => {
        closeChangePasswordModal();
        handleLogout();
      }, 1500);
    });

    // Parent Management functionality
    document.getElementById("parentManagementBtn").addEventListener("click", showParentManagement);
    document.getElementById("saveParentChangesBtn").addEventListener("click", saveParentChanges);
    document.getElementById("refreshParentDataBtn").addEventListener("click", () => {
      renderParentManagement();
      alert("Parent data refreshed!");
    });
  }

  // Global function to close change password modal
  window.closeChangePasswordModal = function() {
    document.getElementById("changePasswordModal").style.display = "none";
  };

  // Global functions for parent management
  window.toggleParentPassword = toggleParentPassword;
  window.resetParentCredentials = resetParentCredentials;

  // Global function to refresh student names
  window.refreshStudentNames = function() {
    const defaultStudents = createDefaultStudents();
    let needsUpdate = false;
    
    // Force update all student names to match the new names
    students.forEach((student, index) => {
      if (defaultStudents[index]) {
        const newName = defaultStudents[index].name;
        const newParentName = defaultStudents[index].parentName;
        if (student.name !== newName || student.parentName !== newParentName) {
          student.name = newName;
          student.parentName = newParentName;
          needsUpdate = true;
        }
      }
    });
    
    if (needsUpdate) {
      saveData(); // Save updated names
      renderStudentNavigation();
      renderStudentsEditor();
      renderStudentSelect();
      alert("Student names updated!");
    } else {
      alert("Student names are already up to date!");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


