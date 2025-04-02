const fs = require('fs/promises');
const path = require('path');

async function countLinesInDirectory(dir, extensions) {
    let totalLinesData = [];
    try {
      // 使用fs.readdir的withFileTypes选项，得到Dirent对象，可以判断是文件还是目录，避免多次调用stat
        const files = await fs.readdir(dir, { withFileTypes: true });
        for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory() && !fullPath.includes('node_modules')) {
                const data = await countLinesInDirectory(fullPath, extensions);
                totalLinesData.push(...data)
            } else if (file.isFile()) {
                const fileExt = path.extname(file.name).slice(1).toLowerCase();
                if (extensions.includes(fileExt)) {
                    const content = await fs.readFile(fullPath, 'utf-8');
                    const line = content.split('\n').length;
                    totalLinesData.push({
                      path: fullPath,
                      line
                    })
                }
            }
        }
    } catch (err) {
        console.error(`Error processing directory ${dir}: ${err.message}`);
        throw err;
    }
    return totalLinesData;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('Usage: node count.js <directory> <extensions...>');
        console.error('Example: node count.js src js ts');
        process.exit(1);
    }

    const [directory, ...extArgs] = args;
    const extensions = extArgs.map(ext =>
        ext.replace(/^\./, '').toLowerCase()
    );

    try {
        const total = await countLinesInDirectory(directory, extensions);
        console.log(`Total lines of code: \n`);
        total.map(item => `${item.path}\t${item.line}\n`).forEach(data => {
          console.log(data)
        })
    } catch (error) {
        console.error('Process failed:', error.message);
        process.exit(1);
    }
}

main();
// 例如命令行输入node readLine.js  ~/yuruyuan/blogs/js js ts