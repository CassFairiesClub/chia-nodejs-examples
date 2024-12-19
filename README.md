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
```
# Examples
## 101 get any transaction memo
Warning : Depending on how the tx and memo were submited (from gui, cli, goby etc.) the memo field encoding can differ (hex, string, int etc.)
Therefore the result and method to properly retrieve the memo from the deserialized solution needs to be adjusted in the script (escaping double quotes or not, adding a conversion from hex to ascii etc.)

The script takes the assumption the memo and tx were submited with goby, and typeof(memo) = string.

[101 get memo](https://github.com/CassFairiesClub/chia-nodejs-examples/blob/main/examples/101_get_memo.js)
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
```

This will give the following output :

