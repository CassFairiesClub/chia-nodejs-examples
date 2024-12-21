// CASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASS
//
//          JAVASCRIPTS EXAMPLES
//          102 - Random Number Generator using block header hash
//
//          Full_node : required
//
//          tested on Ubuntu 24, Chia 2.4.4, Nodejs 20.18.1
//          tips : xch1mxuzqqte2kgu85he6jv8k52qcpynkfz9na4v69203y54uejgk3rsh6d2yr
//
//          https://github.com/Chia-Mine
//             npm install clvm_tools
//          *  npm install chia-agent
//             npm install clvm
//          https://github.com/CMEONE/chia-utils#readme
//             npm install chia-utils
//          https://github.com/socketio/socket.io
//          *  npm install socket.io
//
// CASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASS

// if nodejs version > 14.0.0
// it's only in order to have ES and CommonJS modules both work in a js script from what I understood
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

import http from "http";
import { Server } from 'socket.io';
const fs = require('fs').promises;

const {RPCAgent,getDaemon} = require("chia-agent");
const {get_block_record_by_height} = require("chia-agent/api/rpc/full_node");
const agent = new RPCAgent({service: "full_node"});

const daemon = getDaemon(); // This is the websocket connection handler
await daemon.connect(); // connect to local daemon using config file.
await daemon.subscribe("wallet_ui");
var height = 0;
    daemon.addMessageListener("chia_full_node", (message) => {
    if(message.command == "get_blockchain_state"){
        let currentHeight = message.data.blockchain_state.peak.height;
        if(currentHeight != height){
          height = currentHeight;
          const payload = message.data.blockchain_state.peak.height + " " + message.data.blockchain_state.peak.header_hash
          console.log(payload);
          io.emit('block', payload);
        }
    }
  });

async function getHH(block) {
    const res = await get_block_record_by_height(agent, {height: block});
    const header_hash = res.block_record.header_hash
        return header_hash
};

const requestListener = function (req, res) {
  fs.readFile(__dirname + "/index.html")
      .then(contents => {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(contents);
      })
      .catch(err => {
          res.writeHead(500);
          res.end(err);
          return;
      });
};
const host = 'localhost';
const port = 8000;

const server = http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
  socket.on('verify', (block) => {
    if(block > (height)){
      console.log("not a valid block")
      io.emit('header_hash', "Not a valid block");
    }else{
      const headerhash = getHH(block)
      headerhash.then((hh) => {
        console.log("verify block " + block + " " + hh)
        io.emit('header_hash', block + " " + hh);
      });
    }
    });
});


