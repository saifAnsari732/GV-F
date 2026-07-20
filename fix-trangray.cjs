const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const targetDirs = [
  path.join(__dirname, 'src/app'),
  path.join(__dirname, 'src/components'),
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, (filePath) => {
      if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/trangray/g, 'translate');
        
        // Also fix some text-gray-900 that should be text-white on gradients
        newContent = newContent
          .replace(/text-gray-900 font-bold rounded-xl/g, 'text-white font-bold rounded-xl')
          .replace(/text-gray-900 py-3 rounded-xl/g, 'text-white py-3 rounded-xl');

        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Fixed ${filePath}`);
        }
      }
    });
  }
});
