import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Remove 'Link' from next/navigation imports
    content = content.replace(/import\s*{([^}]*)}\s*from\s*['"]next\/navigation['"];?/g, (match, imports) => {
      let parts = imports.split(',').map(s => s.trim()).filter(Boolean);
      parts = parts.filter(p => p !== 'Link');
      
      // Also change useNavigate to useRouter
      parts = parts.map(p => p === 'useNavigate' ? 'useRouter' : p);

      if (parts.length === 0) return '';
      return `import { ${parts.join(', ')} } from 'next/navigation';`;
    });

    // Replace function calls to useNavigate with useRouter
    content = content.replace(/useNavigate\(\)/g, 'useRouter()');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed imports in', filePath);
    }
  }
});
