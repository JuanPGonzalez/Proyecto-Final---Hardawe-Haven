const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const targetDir = path.join(__dirname, 'src', 'app');
console.log('Scanning ' + targetDir);

walkDir(targetDir, (filePath) => {
    if (filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // Remove specific hardcoded dark hex and rgba colors by setting them to transparent
        content = content.replace(/rgba\(15,\s*23,\s*42,\s*0?\.[0-9]+\)/gi, 'transparent');
        content = content.replace(/rgba\(1,\s*6,\s*15,\s*0?\.[0-9]+\)/gi, 'transparent');
        content = content.replace(/#01060F/gi, 'transparent');
        content = content.replace(/rgb\(4,\s*0,\s*24\)/gi, 'transparent');
        content = content.replace(/rgb\(2,\s*6,\s*66\)/gi, 'transparent');
        content = content.replace(/#0f172a/gi, 'transparent');
        
        // Let styles.css handle text color
        content = content.replace(/color:\s*white;?/gi, '');
        content = content.replace(/color:\s*#fff;?/gi, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
