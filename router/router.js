let router = require('koa-router')();
let newAccountController = require("../controllers/newAccount");
let transactionController = require("../controllers/tracsaction");
let accountController = require("../controllers/account");

// router.get("/newaccount",(ctx,next)=>{
//     ctx.body = "创建钱包";    //koa-router这个模块,会自动调用next(),所以不用人为去调用
// });

//获取创建钱包账户的页面
router.get("/newaccount",newAccountController.newAccountHtml);
//提交创建钱包账户的表单
router.post("/newaccount", newAccountController.newAccount);

//获取转账的页面
router.get("/transaction",transactionController.transactionHtml);
//发送交易
router.post("/sendtransaction",transactionController.sendTransaction);

//通过私钥解锁账户
router.post("/privateunlock",accountController.unlockAccountWithPrivate);
//通过keystore配置文件解锁账户
router.post("/keystoreunlock",accountController.unlockAccountWithKeystore);

//查看交易详情
router.post("/checktransaction",transactionController.checkTransaction);
router.get("/checktransaction",transactionController.checkTransactionHtml);

module.exports = router ;