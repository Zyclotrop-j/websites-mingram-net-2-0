const admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const mime = require('mime-types');
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
const lodash = require('lodash');

const zoneid = 'd76e37dc8e30f49f8948833bdd2cbd55';
const contentServerIp = '152.69.163.246';
const domain = 'mingram.net';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || fs2.readFileSync(`${__dirname}/websites-mingram-net-2-0-firebase-adminsdk-ci892-39916be6f9.json`)?.toString();
if(!serviceAccount) {
  throw new Error(`The firebase service account was not found!`);
}
initializeApp({
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});
const cloudflarekey = process.env.CLOUDFLARE_KEY || fs2.readFileSync(`${__dirname}/cloudflare.txt`)?.toString()?.trim();
if(!cloudflarekey) {
    throw new Error(`The cloudflare key was not found!`);
  }
const cf = cloudlfare({
    token: cloudflarekey
});


const walkfiles = async function(dir) {
    const files = await fs.readdir(dir);
    const allfiles = await Promise.all(files.map(async (file) => {
        const stat = await fs.stat(path.resolve(dir, file));
        if(stat && stat.isDirectory()) {
            const discovered = await walkfiles(path.resolve(dir, file));
            return discovered;
        } else {
            return [path.resolve(dir, file)];
        }
    }));
    return allfiles.flat(1);
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
        return JSON.stringify({
            "version":1,
            "id":"5zpved",
            "rows":[
               {
                  "id":"58x7t7",
                  "cells":[
                     {
                        "plugin":{
                           "id":"ory/editor/core/content/slate",
                           "version":1
                        },
                        "size":12,
                        "dataI18n":{
                           "default":{
                              "slate":[
                                 {
                                    "type":"PARAGRAPH/PARAGRAPH",
                                    "children":[
                                       {
                                          "text":"This site has no or corrupted content. Please return to the editor."
                                       }
                                    ]
                                 }
                              ]
                           }
                        },
                        "id":"klljud",
                        "rows":[
                           
                        ],
                        "inline":null
                     }
                  ]
               },
            ]
        });
    }
};

module.exports = async ({ template, user_id, siteid, currentdir, port }) => {
    const log = (...args) => {
        port.postMessage(JSON.stringify({ kind: "info", data: args }));
    }

    const db = getFirestore();
    const site = await db.collection(`users/${user_id}/sites`).doc(siteid).get();
    const sansiteid = sanitize(site.id)?.toLowerCase();
    const { title: sitetitle, theme = {}, advanced } = site.data();
    // 'x4iEJ2hndi8VU85zkIX7'
    const pages = await db.collection(`users/${user_id}/pages`).get();
    const writeOps = [];
    const t = (await template).toString();
    log("Started build\n Creating folders and index files....")
    await withTmpDir(async (dir) => {
        await fs.mkdir(`${dir}/pages`);
        await (fs.writeFile(`${dir}/pages/index.tsx`, 
            `import React from 'react'; 
            export default function DefaultIndex() {
              return <div>please add a page called index to add a default page</div>;
            }`
        ));
        log("Created folders and index files\n Creating pages.....")
        const sitemap = [];
        pages.forEach((doc) => { // pages is NOT an array, hence map doesn't work
            const { title, content, theme: pagetheme = {}, advanced: pageadvanced = false, site_id } = doc.data();
            if(site_id !== site.id) return; // skip pages not belonging to this site

            writeOps.push(fs.writeFile(`${dir}/pages/${sanitize(title)}.tsx`, 
            t
                .replace('"PAGE_CONTENT"', ensureJSON(content, sanitize(doc.id)))
                .replace('"PAGE_THEME"', JSON.stringify(lodash.merge({}, theme, pagetheme))) // theme is a json-object by nature - it's saved as an object in the db!
                .replace('"ADVANCED_THEME"', (advanced || pageadvanced) ? 'true' : 'false')
            ));
            sitemap.push(sanitize(title));
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
        log("Created generic pages\n Creating custom content pages.....")
        await Promise.all(writeOps);

        log("Created all pages\n Copying script, style and utility folders....")
        await Promise.all([
            fse.copy(path.join(currentdir, `../components/`), `${dir}/components/`),
            fse.copy(path.join(currentdir, `../utils/`), `${dir}/utils/`),
            fse.copy(path.join(currentdir, `../plugins/`), `${dir}/plugins/`),
            fse.copy(path.join(currentdir, `../styles/`), `${dir}/styles/`),
            fse.copy(path.join(currentdir, `../node_modules/`), `${dir}/node_modules/`),
            fse.copy(path.join(currentdir, `../public/`), `${dir}/public/`),
        ]);
        await (fs.writeFile(`${dir}/public/sitemap.txt`, 
            `https://${sansiteid}-d.${domain}/
${sitemap.map(i => `https://${sansiteid}-d.${domain}/${encodeURIComponent(i)}`).join('\n')}`
        ));
        log("Copyed script, style and utility folders\n Creating images")
        const createDir = await fs.mkdir(`${dir}/public/images/`, { recursive: true });
        const bucket = getStorage().bucket('gs://websites-mingram-net-2-0.appspot.com')
        const [files] = await bucket.getFiles({ prefix: `images/${user_id}` });
        await Promise.all(files.map(async file => {
            const fext = mime.extension(file.metadata.contentType) || file.metadata.contentType.split('/').pop() || '';
            const fname = file.name.split('/').pop();
            await fs.writeFile(`${dir}/public/images/${fname}.${fext}`, file.createReadStream());
            await fs.writeFile(`${dir}/public/images/${fname}.${fext}.json`, JSON.stringify({
                name: `${fname}.${fext}`,
                selfLink: `https://${sansiteid}-d.${domain}/images/${fname}.${fext}`,
                bucket: `${sansiteid}-d`,
                generation: file.metadata.generation,
                metageneration: file.metadata.metageneration,
                contentType: file.metadata.contentType,
                size: file.metadata.size,
                md5Hash: file.metadata.md5Hash,
                contentDisposition: file.metadata.contentDisposition,
                etag: file.metadata.etag,
                timeCreated: file.metadata.timeCreated,
                updated: file.metadata.updated,
                original: file.metadata.metadata.name,
                user: file.metadata.metadata.user,
                site: file.metadata.metadata.site,
            }));
        }));
        
        log("Created images\n Installing dependencies....")
    
        await exec(`cd ${dir} && yarn`);
        log("Installed dependendcies\n Building and optimising files....");
        await exec(`cd ${dir} && yarn build`);
        log("All files build\n Copying files to target directory")
    
        await fs.mkdir(`/var/www/d/${sansiteid}`, { recursive: true });
        
        await fse.emptyDir(`/var/www/d/${sansiteid}/`);
        await fse.copy(`${dir}/build`, `/var/www/d/${sansiteid}/`, { overwrite: true });

        log("Files successfully copied to target directory\n Setting up dns and purging cache")

        try {
            const { result: records } = await cf.dnsRecords.browse(zoneid);
            const dnsname = `${sansiteid}-d.${records[0].zone_name}`;
            const dnsentry = records.find(({ name }) => name === dnsname);
            if(dnsentry) {
                const files = await walkfiles(`/var/www/d/${sansiteid}`);
                const rawserverfiles = files.map(i => `https://${dnsname}${i.replace(`/var/www/d/${sansiteid}`, '')}`);
                const htmlserverfiles = rawserverfiles.filter(i => i.endsWith('.html') || i.endsWith('.htm')).map(i => i.replace(/\.html?$/, ''));
                const serverfiles = [...htmlserverfiles, ...rawserverfiles];
                log(`Found ${serverfiles.length} files to purge\n Puring files`);
                // max purge 30 urls at once
                const chunkSize = 30 - 1;
                for (let i = 0; i < serverfiles.length; i += chunkSize) {
                    const chunk = serverfiles.slice(i, i + chunkSize);
                    await cf.zones.purgeCache(zoneid, { files : chunk });
                }
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

