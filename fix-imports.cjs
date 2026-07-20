const fs = require('fs');
const path = require('path');

function replaceFileContent(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(search, replacement);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

// 1. courses/[id]/page.jsx
const coursesIdPage = path.join(__dirname, 'src/app/courses/[id]/page.jsx');
if (fs.existsSync(coursesIdPage)) {
  replaceFileContent(coursesIdPage, "import api from '../services/api';", "import api from '../../../services/api';");
}

// 2. jobs/[id]/page.jsx
const jobsIdPage = path.join(__dirname, 'src/app/jobs/[id]/page.jsx');
if (fs.existsSync(jobsIdPage)) {
  replaceFileContent(jobsIdPage, "import ApplyModal from '../components/ApplyModal';", "import ApplyModal from '../../../components/ApplyModal';");
  replaceFileContent(jobsIdPage, "import api from '../services/api';", "import api from '../../../services/api';");
}

// 3. profile/page.jsx
const profilePage = path.join(__dirname, 'src/app/profile/page.jsx');
if (fs.existsSync(profilePage)) {
  replaceFileContent(profilePage, "import api from '../services/api';", "import api from '../../services/api';");
}
