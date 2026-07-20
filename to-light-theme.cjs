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
        
        let newContent = content
          // Fix gradients and additional backgrounds
          .replace(/from-gray-900/g, 'from-gray-100')
          .replace(/via-gray-800/g, 'via-white')
          .replace(/to-gray-900/g, 'to-gray-100')
          .replace(/from-gray-950/g, 'from-gray-50')
          .replace(/via-gray-950/g, 'via-gray-50')
          .replace(/to-gray-950/g, 'to-gray-50')
          .replace(/bg-gray-950/g, 'bg-gray-50')
          .replace(/bg-gray-900/g, 'bg-gray-50')
          .replace(/bg-gray-800/g, 'bg-white')
          .replace(/bg-gray-700/g, 'bg-gray-100')
          // Fix navbar bg (if any)
          .replace(/bg-gray-950\/80/g, 'bg-white/80')
          .replace(/bg-gray-900\/80/g, 'bg-white/80')
          .replace(/bg-gray-950\/50/g, 'bg-white/50')
          .replace(/bg-gray-900\/50/g, 'bg-white/50')
          .replace(/bg-gray-800\/50/g, 'bg-white/50')
          .replace(/bg-[#080C14]/g, 'bg-gray-50')
          .replace(/bg-\[\#111827\]/g, 'bg-white')
          .replace(/text-\[\#F0F6FF\]/g, 'text-gray-900')
          .replace(/text-\[\#8B9AB5\]/g, 'text-gray-600')
          .replace(/text-gray-200/g, 'text-gray-800')
          .replace(/text-gray-300/g, 'text-gray-700')
          .replace(/text-gray-400/g, 'text-gray-600')
          .replace(/text-gray-100/g, 'text-gray-900')
          .replace(/text-white/g, 'text-gray-900') // Replace all text-white with text-gray-900 first...
          .replace(/text-gray-900 font-bold px-10 py-4/g, 'text-white font-bold px-10 py-4') // Then restore it for buttons
          .replace(/text-gray-900 font-bold px-8 py-4/g, 'text-white font-bold px-8 py-4')
          .replace(/text-gray-900 font-bold px-6 py-3/g, 'text-white font-bold px-6 py-3')
          .replace(/text-gray-900 font-bold py-4/g, 'text-white font-bold py-4')
          .replace(/text-gray-900 font-bold py-3/g, 'text-white font-bold py-3')
          .replace(/text-2xl text-gray-900/g, 'text-2xl text-white') // Icons in gradient backgrounds
          .replace(/text-3xl text-gray-900/g, 'text-3xl text-white')
          .replace(/text-4xl text-gray-900/g, 'text-4xl text-white')
          .replace(/text-5xl text-gray-900/g, 'text-5xl text-white');

        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`Updated ${filePath}`);
        }
      }
    });
  }
});
