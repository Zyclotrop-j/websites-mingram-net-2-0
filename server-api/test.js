const admin = require("firebase-admin");
const { getAuth } = require('firebase-admin/auth');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, getDoc, Timestamp, FieldValue } = require('firebase-admin/firestore');
const fs = require('node:fs/promises');
const fs2 = require('node:fs');
const os = require('os');
const path = require('path');
const sanitize = require("sanitize-filename");
const fse = require('fs-extra');
const util = require('util');
const Piscina = require('piscina');
const { resolve } = require('path');
const { MessageChannel } = require('worker_threads');
const exec = util.promisify(require('child_process').exec);

const fastify = require('fastify')({ logger: true });

const package = require('../package.json')


fastify.register(require('@fastify/cors'), { 
  origin: (origin, cb) => {
    cb(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  // maxAge: 1000
});
fastify.decorateRequest('user', { uid: '' });
// Update our property
fastify.addHook('preValidation', async (request, reply) => {
  const auth_header = request.headers['authorization'] || '';
  const [bearer, stoken] = auth_header.split(" ");
  if(bearer?.toLowerCase() !== 'bearer' || !stoken) {
    const err = new Error()
    err.statusCode = 401;
    err.message = 'Missing jwt token'
    throw err;
  }
  let token;
  try {
    token = await getAuth().verifyIdToken(stoken);
  } catch(e) {
    const err = new Error()
    err.statusCode = 403;
    err.message = `Firebase authentication failed - ${e.message}`;
    throw err;
  }
  if(!token.user_id) {
    const err = new Error()
    err.statusCode = 403;
    err.message = 'Missing user_id in token'
    throw err;
  }
  // todo: require confirmed email
  request.user = { uid: token.user_id };
})
fastify.register(require('@fastify/rate-limit'), {
  max: 10,
  timeWindow: 1000 * 60 * 60,
  keyGenerator: request => {
    const k = `${request.routerPath}-${request?.user?.uid}-${request.routerMethod}`;
    request.log.info(`Request on key ${k}`)
    return k;
  }
});

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || fs2.readFileSync(path.join(__dirname, `websites-mingram-net-2-0-firebase-adminsdk-ci892-39916be6f9.json`))?.toString();
if(!serviceAccount) {
  throw new Error(`The firebase service account was not found!`);
}
initializeApp({
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});



const template = fs.readFile(path.join(__dirname, `../pages/readonly.tsx`));
const piscina = new Piscina({
  filename: path.resolve(__dirname, 'task.js')
});

const ssecbsperuser = {};

// Declare a route
fastify.get('/', async (request, reply) => {
  return request.user.uid;
})
fastify.post('/', {
  schema: {
    body: {
      type: 'object',
      properties: {
        site: { type: 'string' }
      },
      required: ['site']
    }
  }
}, async (request, reply) => {
  const user_id = request.user.uid;
  const siteid = request.body.site;
  const request_id = request.id;

  const file = await template;
  
  ssecbsperuser[user_id] ??= {};
  ssecbsperuser[user_id][siteid] ??= [];
  const channel = new MessageChannel();
  channel.port2.on('message', (message) => {
    const { kind, data } = JSON.parse(message);
    request.log[kind](...data);
    const tryCatch = (fn) => {
      try {
        fn();
      } catch(e) {
        request.log.error(e);
      }
    }
    
    ssecbsperuser[user_id][siteid].push({ user_id, siteid, request_id, data });
  });

  const result = piscina.run({ template: file.toString(), user_id, siteid, currentdir: __dirname, port: channel.port1 }, { transferList: [channel.port1] });
  result.then(i => console.log(i));
  result.then(() => {
    channel.port2.close();
    delete ssecbsperuser[user_id][siteid];
  });
  
  return {};
})
fastify.get('/progress', (request, reply) => {
  const user_id = request.user.uid;
  ssecbsperuser[user_id] ??= {};
  reply.send(ssecbsperuser[user_id]);
});
fastify.get('/progress/:site', (request, reply) => {
  const user_id = request.user.uid;
  const site_id = request.params.site;
  ssecbsperuser[user_id] ??= {};
  reply.send(ssecbsperuser[user_id][siteid] ?? []);
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 4000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
