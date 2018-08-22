
let web3 = require("../utils/myUtils").getweb3();
let {success,fail} = require("../utils/myUtils");
module.exports = {
      transactionHtml : async (ctx)=>{
          await ctx.render("transaction.html");
      },

      sendTransaction : async (ctx)=>{
          let {fromaddress,toaddress,number,privatekey} = ctx.request.body;

          //通过调用web3接口进行发送交易

          var Tx = require('ethereumjs-tx');
          var privateKey = new Buffer(privatekey.slice(2), 'hex');

          //获取交易的个数
          let nouce = await  web3.eth.getTransactionCount(fromaddress);
          let  gasPrice = await web3.eth.getGasPrice();
          let value = web3.utils.toWei(number);

          var rawTx = {
              nonce: nouce,                    //交易的个数(与比特币的随机值是有差别的)
              gasPrice: gasPrice,
              gasLimit: '0x2710',
              to: toaddress,
              value: value,
              data: '0x00'  //转token才会用到的一个字段
          };

          //需要将进行的数据进行预估gas的计算,然后将gas值设置到数据参数当中
         let gas = await web3.eth.estimateGas(rawTx);
          //rawTx.gasPrice = gas ;
          rawTx.gas=gas;

          var tx = new Tx(rawTx);
          tx.sign(privateKey);

          var serializedTx = tx.serialize();


          let responseData ;

        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'),function (err,data) {
                console.log(err);
                console.log(data);//交易的hash值
            if (err){
                responseData=fail(err);
            }
        })
            .then(function (data) {
                console.log(data);//是一个对象  包含区块的hash值  区块的高度等等.....
                if (data){
                    responseData=success({
                        "blockHash" : data.blockHash,
                        "transactionHash" : data.transactionHash
                    })
                }else{
                    responseData = fail("交易失败");
                }
            });

            ctx.body = responseData ;
      },

    checkTransaction :async (ctx)=>{
        let hash = ctx.request.body.hash;
        console.log(hash);

       let data = await web3.eth.getTransaction(hash);

        ctx.body = success(data)
    },

    checkTransactionHtml : async (ctx)=>{
     await  ctx.render("checktransaction.html");
    }
};


















