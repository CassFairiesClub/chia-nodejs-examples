# chia-nodejs-examples
Simple examples using chia-mine javascript tools for learning purposes.

chia-mine is a set of tools to run CLVM and different RPC/websosket services : https://github.com/Chia-Mine.
  - clvm-js : Javascript implementation of CLVM (Chia Lisp VM) 
  - clvm_tools-js : Javascript implementation of clvm_tools (clvm = Chia Lisp VM)
  - chia-agent : chia rpc/websocket client library for NodeJS.

# installation
## config
  - chia-blockchain => 2.4.4 (full_node required)
  - ubuntu => 24.04
  - nodejs => 20.18.1

## install npm packages
```
npm install clvm_tools
npm install clvm
npm install chia-agent
npm install socket.io
```
# Examples
## 101 get any transaction memo
Warning : Depending on how the tx and memo were submited (from gui, cli, goby etc.) the memo field encoding can differ (hex, string, int etc.)
Therefore the result and method to properly retrieve the memo from the deserialized solution needs to be adjusted in the script (escaping double quotes or not, adding a conversion from hex to ascii etc.)

The script takes the assumption the memo and tx were submited with goby, and typeof(memo) = string.

[101 get memo](https://github.com/CassFairiesClub/chia-nodejs-examples/blob/main/examples/101_get_memo/101_get_memo.js)
```
node get_memo.js
>
=========================================================
Coin Record for Tx_id => 0xa446d89dfe8521fe8565380ec2e25436c5e425e1dbb7232b4578c3e3d2534343
[Object: null prototype] {
  coin_record: [Object: null prototype] {
    coin: [Object: null prototype] {
      amount: 1000000000,
      parent_coin_info: '0x678829ec79ddb86415689b2d7e138071fb0505432e50adce75b2f5b5072a46ab',
      puzzle_hash: '0x53c8e63bb7e61215db3c109a168a8c7ce7d1828c438b542abe9368c83ad3f0ff'
    },
    coinbase: false,
    confirmed_block_index: 6371155,
    spent: false,
    spent_block_index: 0,
    timestamp: 1734620721
  },
  success: true
}
=========================================================
Solution of the parent_coin =>
0xff80ffff01ffff33ffa053c8e63bb7e61215db3c109a168a8c7ce7d1828c438b542abe9368c83ad3f0ffff843b9aca00ffff8470696e678080ffff34ff82604880ffff33ffa0d9b82001795591c3d2f9d4987b5140c0493b24459f6acd154f89295e6648b447ff84773533b880ffff3cffa0f590f3b819f40473daaa4cc2154e2d39bea6801d70e803fb840c42308414740a8080ff8080
=========================================================
Deserialize the solution => 
(() (q (51 0x53c8e63bb7e61215db3c109a168a8c7ce7d1828c438b542abe9368c83ad3f0ff 0x3b9aca00 ("ping")) (52 24648) (51 0xd9b82001795591c3d2f9d4987b5140c0493b24459f6acd154f89295e6648b447 0x773533b8) (60 0xf590f3b819f40473daaa4cc2154e2d39bea6801d70e803fb840c42308414740a)) ())
=========================================================
Memo => 
"ping"
=========================================================
ping => pong
```
## 102 XCH Picker - websocket connection to the daemon
[102 xch_picker](https://github.com/CassFairiesClub/chia-nodejs-examples/blob/main/examples/102_XCH_Picker/)
Let's spice things up! We add here a simple http server and a websocket connection, basically building our first app interacting with the full node daemon.
The XCH Picker takes block header hashes first 12 hex characters and converts it to an integer. After sample rejection to make sure we don't introduce a bias, we then modulo that integer with a max range number.

I've seen horrible ways of doing draws to choose winners lately on the timeline, the XCH picker is a tool to provably make a draw :
  1.  publish the potential winners list and announce a block in advance, a block that have not been produced by the blockchain.
  2.  make your draw using the xch picker
  3.  anyone can check the result of the draw given the list and the chosen block

The function can be implemented by anyone : 
```
function hash2rand(header_hash, max) {
  const safe_big_int = 281474976710655; // 0xffff ffff ffff 
  const HH_Int = parseInt(header_hash.substring(0,14), 16)+1;
  // Check if within range, if not discard the header_hash
  if(HH_Int > Math.floor(safe_big_int/max)*max){
    return 0; 
  }else{
    return String(((HH_Int % max) + 1)).padStart(max.length, '0');
  }
}
```
