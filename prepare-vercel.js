/*
 * Copyright (C) 2024-present Puter Technologies Inc.
 *
 * This file is part of Puter.
 *
 * Puter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'src', 'gui', 'dist');
const publicDir = path.join(rootDir, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy dist contents to public
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

if (fs.existsSync(distDir)) {
    console.log(`Copying ${distDir} to ${publicDir}...`);
    copyRecursiveSync(distDir, publicDir);
    console.log('✓ Build files copied to public directory');
} else {
    console.error(`Error: ${distDir} does not exist. Run 'npm run build' first.`);
    process.exit(1);
}

// Create a basic index.html if it doesn't exist
const indexHtmlPath = path.join(publicDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
    console.log('Creating basic index.html...');
    fs.writeFileSync(indexHtmlPath, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puter</title>
    <link rel="stylesheet" href="/bundle.min.css">
</head>
<body>
    <script>window.puter_gui_enabled = true;</script>
    <script src="/gui.js"></script>
    <script src="/bundle.min.js"></script>
    <script>
        window.addEventListener('load', function() {
            if (typeof gui === 'function') {
                gui();
            }
        });
    </script>
</body>
</html>`);
    console.log('✓ Created index.html');
}

