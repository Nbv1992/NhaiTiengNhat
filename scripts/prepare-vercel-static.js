const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputDirectory = path.join(projectRoot, 'dist');
const frontendDirectories = ['assets', 'components', 'css', 'data', 'js', 'pages'];
const pdfJsBuild = path.join(projectRoot, 'backend', 'node_modules', 'pdfjs-dist', 'build');

if (!fs.existsSync(path.join(projectRoot, 'index.html'))) {
  throw new Error('Could not find the frontend root index.html.');
}
if (!fs.existsSync(path.join(pdfJsBuild, 'pdf.mjs')) ||
    !fs.existsSync(path.join(pdfJsBuild, 'pdf.worker.mjs'))) {
  throw new Error('Install backend dependencies before building the Vercel static output.');
}

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });
fs.copyFileSync(path.join(projectRoot, 'index.html'), path.join(outputDirectory, 'index.html'));

for (const directory of frontendDirectories) {
  const source = path.join(projectRoot, directory);
  if (fs.existsSync(source)) {
    fs.cpSync(source, path.join(outputDirectory, directory), { recursive: true });
  }
}

fs.cpSync(pdfJsBuild, path.join(outputDirectory, 'vendor', 'pdfjs'), { recursive: true });
console.log('Prepared Vercel static output in dist/.');
