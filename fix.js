import fs from 'fs';
const files = ['src/components/AdminCertificate.jsx', 'src/components/ReviewHelper.jsx'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('use client')) {
      content = '"use client";\n' + content;
    }
    content = content.replace(/react-router-dom/g, 'next/navigation');
    fs.writeFileSync(f, content);
  }
});
