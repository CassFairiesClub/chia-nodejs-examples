# chia-nodejs-examples
Simple examples using chia-agent javascript library for learning purposes

# install npm packages
npm install clvm_tools

npm install clvm

npm install chia-agent

npm install chia-utils

## test
node get_memo.js
```
=========================================================
Coin Record for Tx_id => 0xd0771fec448be8fd55eec87a3d6a27586e769989449657f2b82ac4af4eb0ad96
[Object: null prototype] {
  coin_record: [Object: null prototype] {
    coin: [Object: null prototype] {
      amount: 1000000000,
      parent_coin_info: '0x6fd64edf58fef22d232d57dba71e097dfbb5931cc3b364d49b56a9298ea3296c',
      puzzle_hash: '0x0fc956b015c4b8637cb24b2d01d4a73c07570d04dba7a2d0b2466559b9f5ea89'
    },
    coinbase: false,
    confirmed_block_index: 6370060,
    spent: false,
    spent_block_index: 0,
    timestamp: 1734600493
  },
  success: true
}
=========================================================
Solution of the parent_coin =>
0xff80ffff01ffff33ffa00fc956b015c4b8637cb24b2d01d4a73c07570d04dba7a2d0b2466559b9f5ea89ff843b9aca00ffff8470696e678080ffff33ffa0d9b82001795591c3d2f9d4987b5140c0493b24459f6acd154f89295e6648b447ff840569c1ea80ffff3cffa030d4933d285764e4f86618dced1bb09f2cb5293190fa03063cae72f59b026bf18080ff8080
=========================================================
Deserialize the solution => 
(() (q (51 0x0fc956b015c4b8637cb24b2d01d4a73c07570d04dba7a2d0b2466559b9f5ea89 0x3b9aca00 ("ping")) (51 0xd9b82001795591c3d2f9d4987b5140c0493b24459f6acd154f89295e6648b447 0x0569c1ea) (60 0x30d4933d285764e4f86618dced1bb09f2cb5293190fa03063cae72f59b026bf1)) ())
=========================================================
Memo => 
"ping"
=========================================================
ping => pong
```
