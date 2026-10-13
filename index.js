const http = require('http');
http.createServer((req,res)=>res.end('ANITA GEN EN LIGNE')).listen(process.env.PORT || 3000);

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    auth: state,
    logger: P({level:'silent'}),
    printQRInTerminal: true
  });
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (u) => {
    if (u.connection === 'open') {
      console.log("✅ CONNECTE!");
      await new Promise(r => setTimeout(r, 2000));
      const creds = fs.readFileSync('session/creds.json');
      const base64 = Buffer.from(creds).toString('base64');
      console.log("\n\n========== COPIE TON SESSION_ID CI-DESSOUS ==========\n");
      console.log(base64);
      console.log("\n========== FIN ==========\n");
    }
  });
}
start();
