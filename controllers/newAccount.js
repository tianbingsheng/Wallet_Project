
//获取web3接口
let web3 = require('../utils/myUtils').getweb3();
let fs = require('fs');
let path = require('path');

module.exports = {
    //获取创建账号的页面
    newAccountHtml:async (ctx) => {
        await  ctx.render("newaccount.html");
    },
    //表单提交被触发的方法
    newAccount:async (ctx) => {
        console.log("newaccount");
        console.log(ctx.request.body.password);

        //1.通过web3接口创建账户
       let account = web3.eth.accounts.create(ctx.request.body.password);
       console.log(account);

       //2.根据账号和密码生成,获取keystore对象
      let keystore =  account.encrypt(ctx.request.body.password);
      console.log(keystore);


      //3.将keystore保存到文件
        let keystoreString = JSON.stringify(keystore);

        let time = new Date();
        let filename = 'UTC--'+time.toISOString()+'--'+account.address.slice(2);
        console.log(filename);

        //4.将keystoreString同步写入文件

        let filePath = path.join(__dirname,"../static/keystore",filename);
        fs.writeFileSync(filePath,keystoreString);

        await ctx.render("downloadkeystore.html",{
            "downloadurl" : "keystore/"+filename,
            "privatekey" : account.privateKey
        });

        // ctx.body = "我已经收到";
    }
};
