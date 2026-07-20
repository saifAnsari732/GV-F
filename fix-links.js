import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Fix the broken tags:
    // If we have <a and </a> we want to convert to <Link href= and </Link>
    // But since my previous script did: 
    // content = content.replace(/<Link /g, '<a ');
    // content = content.replace(/<\/Link>/g, '</a>');
    // I will replace `<a ` with `<Link ` if it has `to=` or `href=`
    
    // Also replacing `to=` with `href=`
    content = content.replace(/<a /g, '<Link ');
    content = content.replace(/<\/a>/g, '</Link>');
    
    // If there were genuine <a> tags, this converts them to <Link>, which is mostly fine in Next.js.
    // Replace `to=` with `href=` in Link tags
    content = content.replace(/<Link\s+to=/g, '<Link href=');
    content = content.replace(/<Link([\s\S]*?)to=/g, '<Link$1href=');
    
    // Ensure next/link is imported if <Link is used
    if (content.includes('<Link ') && !content.includes("from 'next/link'") && !content.includes('from "next/link"')) {
      content = content.replace(/("use client";\n?)/, '$1import Link from "next/link";\n');
      if (!content.includes('import Link')) {
        content = 'import Link from "next/link";\n' + content;
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
