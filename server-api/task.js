const admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('node:fs/promises');
const fs2 = require('node:fs');
const os = require('os');
const path = require('path');
const sanitize = require("sanitize-filename");
const fse = require('fs-extra');
const util = require('util');
const { parentPort } = require('worker_threads');
const exec = util.promisify(require('child_process').exec);
const package = require('../package.json');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || fs2.readFileSync(`${__dirname}/websites-mingram-net-2-0-firebase-adminsdk-ci892-39916be6f9.json`).toString();
if(!serviceAccount) {
  throw new Error(`The firebase service account was not found!`);
}
initializeApp({
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const withTmpDir = async (cb) => {
    let tmpDir;
    const appPrefix = 'websites-mingram-net-2-0-';
    try {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), appPrefix));
        await cb(tmpDir);
    } finally {
        try {
        if (tmpDir) {
            await fs.rm(tmpDir, { recursive: true });
        }
        } catch (e) {
        throw new Error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
        }
    }
}
const ensureJSON = (content, docId) => {
    try {
        const json = JSON.parse(content);
        return JSON.stringify(json);
    } catch(e) {
        throw new Error(`Detected invalid content in document ${docId}`)
    }
};

module.exports = async ({ template, user_id, siteid, currentdir, port }) => {
    const log = (...args) => {
        port.postMessage(JSON.stringify({ kind: "info", data: args }));
    }

    const db = getFirestore();
    const site = await db.collection(`users/${user_id}/sites`).doc(siteid).get();
    const sansiteid = sanitize(site.id)?.toLowerCase();
    const { title: sitetitle } = site.data();
    // 'x4iEJ2hndi8VU85zkIX7'
    const pages = await db.collection(`users/${user_id}/pages`).get();
    const writeOps = [];
    const t = (await template).toString();
    await withTmpDir(async (dir) => {
        await fs.mkdir(`${dir}/pages`);
        pages.forEach((doc) => {
            const { title, content } = doc.data();
            writeOps.push(fs.writeFile(`${dir}/pages/${sanitize(title)}.tsx`, 
            t.replace('"PAGE_CONTENT"', ensureJSON(content, sanitize(doc.id)))
            ));
        });
        await (fs.writeFile(`${dir}/pages/_app.js`, 
            (await fs.readFile(path.join(currentdir, `../pages/_app.js`))).toString()
        ));
        await (fs.writeFile(`${dir}/.gitignore`, 
            (await fs.readFile(path.join(currentdir, `../.gitignore`))).toString()
        ));
        await (fs.writeFile(`${dir}/next.config.js`, 
            (await fs.readFile(path.join(currentdir, `../next.config.js`))).toString()
        ));
        await (fs.writeFile(`${dir}/yarn.lock`, 
            (await fs.readFile(path.join(currentdir, `../yarn.lock`))).toString()
        ));
        await (fs.writeFile(path.join(dir, 'package.json'), 
            JSON.stringify({
            "name": `@websites-mingram-net/${site.id.toLowerCase()}`,
            "version": "1.0.0",
            "private": true,
            "sideEffects": false,
            "user": user_id,
            "site": site.id,
            "scripts": {
                "dev": "next dev",
                "build": "next build && next export -o build && touch build/.nojekyll",
                "start": "next start"
            },
            "peerDependencies": {
                ...package.peerDependencies
            },
            "dependencies": {
                ...package.dependencies
            },
            "devDependencies": {
                ...package.devDependencies
            }
            }, null, "  ")
        ));
    
        await Promise.all(writeOps);

        log("Copied file\n Copying folders....")
        await Promise.all([
            fse.copy(path.join(currentdir, `../components/`), `${dir}/components/`),
            fse.copy(path.join(currentdir, `../plugins/`), `${dir}/plugins/`),
            fse.copy(path.join(currentdir, `../styles/`), `${dir}/styles/`),
            fse.copy(path.join(currentdir, `../node_modules/`), `${dir}/node_modules/`),
        ]);
        log("Copied folders\n Running yarn....")
    
        const { stdout, stderr } = await exec(`cd ${dir} && yarn`);
        log("Ran yarn\n Running build....");
        const { stdout2, stderr2 } = await exec(`cd ${dir} && yarn build`);
        log("Ran build\n Finalising....")

        
    
        // todo: copy these to the actual host-dir!
        await fs.mkdir(`${currentdir}/d/${sansiteid}`, { recursive: true });
        await fse.copy(`${dir}/build`, `${currentdir}/d/${sansiteid}/`, { overwrite: true });
    
        /*
        await fs.mkdir(`${currentdir}/${sansiteid}`, { recursive: true });
        fse.copySync(dir, `${currentdir}/${sansiteid}/`, { overwrite: true }, function (err) {
            if (err) {                 
            console.error(err);     
            } else {
            log("success!");
            }
        });
        */
    });
    return { count: writeOps.length, sitetitle };
}

