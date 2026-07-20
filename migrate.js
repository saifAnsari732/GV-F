import fs from 'fs';
import path from 'path';

const srcDir = './src';
const pagesDir = path.join(srcDir, 'pages');
const appDir = path.join(srcDir, 'app');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function convertToClientComponent(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('use client')) {
      content = '"use client";\n' + content;
    }
    // Very basic replacement of useNavigate and Link
    content = content.replace(/from 'react-router-dom'/g, "from 'next/navigation'");
    content = content.replace(/from "react-router-dom"/g, "from 'next/navigation'");
    content = content.replace(/<Link /g, '<a ');
    content = content.replace(/<\/Link>/g, '</a>');
    
    fs.writeFileSync(filePath, content);
  }
}

function moveRoute(oldPath, newAppPath) {
  const fullOld = path.join(pagesDir, oldPath);
  const fullNew = path.join(appDir, newAppPath);
  if (fs.existsSync(fullOld)) {
    ensureDir(path.dirname(fullNew));
    fs.copyFileSync(fullOld, fullNew);
    convertToClientComponent(fullNew);
    console.log(`Moved ${oldPath} to ${newAppPath}`);
  } else {
    console.log(`Not found: ${oldPath}`);
  }
}

const routes = {
  'Home.jsx': 'page.jsx',
  'Login.jsx': 'login/page.jsx',
  'Register.jsx': 'register/page.jsx',
  'Courses.jsx': 'courses/page.jsx',
  'CourseDetail.jsx': 'courses/[id]/page.jsx',
  'Jobs.jsx': 'jobs/page.jsx',
  'JobDetail.jsx': 'jobs/[id]/page.jsx',
  'Profile.jsx': 'profile/page.jsx',
  'Admin/AdminDashboard.jsx': 'admin/dashboard/page.jsx',
  'Student/StudentDashboard.jsx': 'student/dashboard/page.jsx',
  'Admin/CourseManagemen.jsx': 'admin/courses/page.jsx',
  'Admin/AttendanceManagement.jsx': 'admin/attendance/page.jsx',
  'Admin/Jobcreate.jsx': 'createjob/page.jsx',
  'Admin/Applications.jsx': 'jobapplication/page.jsx',
  'Student/FeeInformation.jsx': 'student/fees/page.jsx',
  'Admin/AdminFeeManagement.jsx': 'admin/fees/manage/page.jsx',
};

// Execute
for (const [oldP, newP] of Object.entries(routes)) {
  moveRoute(oldP, newP);
}

// Convert components to client components as well
const componentsDir = path.join(srcDir, 'components');
if (fs.existsSync(componentsDir)) {
  const processDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        processDir(fullPath);
      } else if (fullPath.endsWith('.jsx')) {
        convertToClientComponent(fullPath);
      }
    });
  };
  processDir(componentsDir);
}

console.log("Migration script finished.");
