
let web3 = require('../utils/myUtils').getweb3();
let fs = require('fs');
let myUtils = require('../utils/myUtils');

async  function getAccountBalance(address){
    let balance = await web3.eth.getBalance(address);

    return web3.utils.fromWei(balance, 'ether');
}
module.exports = {
    unlockAccountWithPrivate : async (ctx)=>{
        //通过ajax,获取前端页面传来的数据
        //1.获取私钥
        let privatekey = ctx.request.body.privatekey;
        console.log(privatekey);
        //2.通过web3接口,根据私钥进行解锁账户,获得账户对象;
        let account = web3.eth.accounts.privateKeyToAccount(privatekey);
        console.log(account);
        //3.获取账户余额
        let balance  = await  getAccountBalance(account.address);
        console.log(balance);
        //返回响应的数据给前端
        responseData = myUtils.success({
            balance : balance,
            address : account.address
        });

        ctx.body = responseData;
    },

    unlockAccountWithKeystore:async (ctx)=>{

        //1.获取前端传递的数据,密码
        let password = ctx.request.body.password;
        console.log(password);
        //2.获取前段传递来的keystore
        let keystore = ctx.request.files.file;
        console.log(keystore);

        //3.读取keystore里面的数据
        let keystoreData = fs.readFileSync(keystore.path,"utf8");
        console.log(keystoreData);

        //传入的是keystoreData的数据对象
        //4.通过keystore和密码去解锁账户
      let account = web3.eth.accounts.decrypt(JSON.parse(keystoreData), password);
      console.log(account);

        //5.获取账户余额
        let balance  = await  getAccountBalance(account.address);
        console.log(balance);

        //6.返回响应的数据给前端
        responseData = myUtils.success({
            balance : balance,
            address : account.address
        });

        ctx.body = responseData ;

    }
};














