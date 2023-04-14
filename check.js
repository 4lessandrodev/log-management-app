const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

function compareVersions(a, b) {
    return a.replace(/\^|\~|\=/g, '') === b.version;
}

try {
    const npmDeps = execSync('npm ls --json');
    const { dependencies: npmDepsObject = {} } = JSON.parse(npmDeps.toString());

    const packageFile = readFileSync(resolve('package.json'), 'utf8');
    const { dependencies: prdDeps = {}, devDependencies: devDeps = {} } = JSON.parse(packageFile);

    const keys = Object.keys(npmDepsObject);

    const prdResult = keys.reduce((acc, key) => {
        if (prdDeps[key] && !compareVersions(prdDeps[key], npmDepsObject[key])) {
            acc.push({
                dependencies: key,
                'package.json': prdDeps[key],
                'node_modules': npmDepsObject[key].version,
                equal: false
            });
        }
        return acc;
    }, []);
    if (prdResult.length > 0) {
        console.table(prdResult);
    }

    const devResult = keys.reduce((acc, key) => {
        if (devDeps[key] && !compareVersions(devDeps[key], npmDepsObject[key])) {
            acc.push({
                devDependencies: key,
                'package.json': devDeps[key],
                'node_modules': npmDepsObject[key].version,
                equal: false
            });
        }
        return acc;
    }, []);
    if (devResult.length > 0) {
        console.table(devResult);
    }
} catch (error) {
    console.error(error.message);
    process.exit(1);
}