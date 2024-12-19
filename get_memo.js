// CASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASS
//
//          JAVASCRIPTS EXAMPLES
//          101 - Retrieve any transaction memo
//
//          Full_node : required
//          Wallet    : optional
//
//          tested on Ubuntu 24, Chia 2.4.4, Nodejs 20.18.1
//          tips : xch1mxuzqqte2kgu85he6jv8k52qcpynkfz9na4v69203y54uejgk3rsh6d2yr
//
//          https://github.com/Chia-Mine
//            npm install clvm_tools
//            npm install chia-agent
//            npm install clvm
//          https://github.com/CMEONE/chia-utils#readme
//            npm install chia-utils
//
// CASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASSCASS

// if nodejs version > 14.0.0
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// chia node modules CLVM_TOOLS & CHIA-AGENT
const clvm_tools = require("clvm_tools");
const {RPCAgent} = require("chia-agent");
const {get_coin_record_by_name, get_puzzle_and_solution} = require("chia-agent/api/rpc/full_node");
const agent = new RPCAgent({service: "full_node"});

// Change TX_ID with your own
// test tx_id from goby wallet, goby_memo_input: ping
const TX_ID = "0xd0771fec448be8fd55eec87a3d6a27586e769989449657f2b82ac4af4eb0ad96";

const coin_record_params = {name : TX_ID};
const res1 = await get_coin_record_by_name(agent, coin_record_params);
console.log("=========================================================");
console.log('\x1b[36m%s\x1b[0m', "Coin Record for Tx_id => " + TX_ID);
console.log(res1);

const parent_coin_id = res1.coin_record.coin.parent_coin_info;
const puzzle_hash = res1.coin_record.coin.puzzle_hash;
const confirmed_block_index = res1.coin_record.confirmed_block_index;
const amount = res1.coin_record.coin.amount;

const puzzle_params = {coin_id : parent_coin_id, height: confirmed_block_index};
const res2 = await get_puzzle_and_solution(agent, puzzle_params);
const solution = res2.coin_solution.solution;
console.log("=========================================================");
console.log('\x1b[36m%s\x1b[0m', "Solution of the parent_coin =>");
console.log(solution);

// redirect output of clvm_tools.go to variable
// https://github.com/Chia-Mine/clvm_tools-js?tab=readme-ov-file#redirect-outputerror-from-consolelog
let outputEl = [];
const printFn = (...messages) => {
    outputEl = (outputEl || "") + messages.join(" ");
  };
clvm_tools.setPrintFunction(printFn);

async function OPD (e) {
    try{
        // opd function from clvm tools
        clvm_tools.go("opd", e);
    }
    catch (e) {
        outputEl = typeof e === "string" ? e : JSON.stringify(e);
    }
  }
OPD(solution);
console.log("=========================================================");
console.log('\x1b[36m%s\x1b[0m', "Deserialize the solution => ");
console.log(outputEl);

//search for matching pattern with puzzle_hash
const found = outputEl.match(puzzle_hash)
const memo = outputEl.slice(found.index).split(' ')[2].split('(')[1].split(')')[0];

// slice at found index, then split, then get rid of parenthesis
console.log("=========================================================");
console.log('\x1b[36m%s\x1b[0m', "Memo => ");
console.log(memo);

// WARNING : depending on how the memo was encoded it might be shown as hex
// a string in goby will show here as string in double quotes, it best suited for tests

// you can then perform any conditions on the memo
// if >= 100000001 mojos or >= 0.000 100 000 001 xch
// here we escape the double quotes as expected from a goby string memo
if(amount > 100000000 && memo == "\"ping\""){
  console.log("=========================================================");
  console.log('\x1b[36m%s\x1b[0m', "ping => pong");
}else{
  console.log("=========================================================");
  console.log('\x1b[36m%s\x1b[0m', "ping => no pong");
}

// WALLET REQUIRED - TIPS TESTING SECTION :)
/*
    const {get_public_keys} = require("chia-agent/api/rpc/wallet");
    const {get_wallet_balance} = require("chia-agent/api/rpc/wallet");
    const {send_transaction} = require("chia-agent/api/rpc/wallet");
    const agent2 = new RPCAgent({service: "wallet"});
    const params = {wallet_id : 1, address : "xch1mxuzqqte2kgu85he6jv8k52qcpynkfz9na4v69203y54uejgk3rsh6d2yr", amount : 10000000000, fee : 1000};
    const response = await send_transaction(agent2, params);
    console.log(response);
*/
