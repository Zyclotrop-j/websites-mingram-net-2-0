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
const cloudlfare = require('cloudflare');

const zoneid = 'd76e37dc8e30f49f8948833bdd2cbd55';
const contentServerIp = '152.69.163.246';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || fs2.readFileSync(`${__dirname}/websites-mingram-net-2-0-firebase-adminsdk-ci892-39916be6f9.json`).toString();
if(!serviceAccount) {
  throw new Error(`The firebase service account was not found!`);
}
initializeApp({
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});
const cloudflarekey = process.env.CLOUDFLARE_KEY || fs2.readFileSync(`${__dirname}/cloudflare.txt`).toString();
if(!cloudflarekey) {
    throw new Error(`The cloudflare key was not found!`);
  }
const cf = cloudlfare({
    token: cloudflarekey
});


const walkfiles = function(dir, done) {
    let results = [];
    fs2.readdir(dir, function(err, list) {
      if (err) return done(err);
      let pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walkfiles(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

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
        await (fs.writeFile(`${dir}/pages/index.tsx`, 
            `import React from 'react'; 
            export default function DefaultIndex() {
              return <div>index page</div>;
            }`
        ));
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
        log("Ran build\n Copying to targetdir")
    
        await fs.mkdir(`/var/www/d/${sansiteid}`, { recursive: true });
        // todo: clear directory to remove files that no longer exist!
        await fse.copy(`${dir}/build`, `/var/www/d/${sansiteid}/`, { overwrite: true });

        log("Files successfully copied to targetdir\n Setting up dns or purging cache")

        try {
            const { result: records } = await cf.dnsRecords.browse(zoneid);
            const dnsname = `${sansiteid}-d.${records[0].zone_name}`;
            const dnsentry = records.find(({ name }) => name === dnsname);
            if(dnsentry) {
                const files = await new Promise((res, rej) => walkfiles(`/var/www/d/${sansiteid}`, (err, result) => err ? rej(err) : res(result)));
                const serverfiles = files.map(i => i.replace(`/var/www/d/${sansiteid}`, ''));
                log(`Found ${serverfiles.length} files to purge\n Puring files`);
                await cf.zones.purgeCache(zoneid, { files : serverfiles });
                log(`Cache purged with ${serverfiles.length} files purged\n Done`);
            } else {
                log(`Found no dns record ${dnsname}\n Adding dns record`);
                await cf.dnsRecords.add(zoneid, {
                    name: dnsname,
                    type: 'A',
                    content: contentServerIp,
                    proxiable: true,
                    proxied: true,
                });
                log(`Created dns record for ${dnsname}\n Done`);
            }
        } catch(e) {
            console.error(e);
            log(`Something went wrong when setting up the dns: ${e.message}\n Done`);
        }
        // todo delete:
        /*
            await cf.dnsRecords.del(zoneid, dnsentry.id)
        */
    });
    return { count: writeOps.length, sitetitle };
}

