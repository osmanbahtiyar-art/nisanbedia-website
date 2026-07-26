const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'public');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = [
    'index.html',
    'style.css',
    'app.js',
    'config.js',
    'nisan_bedia_portrait.jpg'
];

filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(destDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    }
});

// Copy superadminx folder
const superadminxSrc = path.join(__dirname, 'superadminx');
const superadminxDest = path.join(destDir, 'superadminx');

if (fs.existsSync(superadminxSrc)) {
    if (!fs.existsSync(superadminxDest)) {
        fs.mkdirSync(superadminxDest, { recursive: true });
    }
    const adminFiles = fs.readdirSync(superadminxSrc);
    adminFiles.forEach(f => {
        fs.copyFileSync(path.join(superadminxSrc, f), path.join(superadminxDest, f));
    });
}

console.log('Build completed successfully! All static files copied to /public.');
