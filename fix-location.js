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

    // Change useLocation to usePathname
    if (content.includes('useLocation')) {
      content = content.replace(/useLocation/g, 'usePathname');
      // If code was accessing location.pathname, it should now just be usePathname directly, or we can replace it.
      // E.g., `const location = usePathname(); location.pathname` -> `const pathname = usePathname(); pathname`
      // For simplicity, let's just do:
      content = content.replace(/const\s+location\s*=\s*usePathname\(\);/g, 'const pathname = usePathname();');
      content = content.replace(/location\.pathname/g, 'pathname');
      // Any generic 'location' access might break, but usually in React Router it's just location.pathname.
      // Let's also check isActive('/courses') -> might be using location.pathname implicitly or explicitly.
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed useLocation in', filePath);
    }
  }
});
