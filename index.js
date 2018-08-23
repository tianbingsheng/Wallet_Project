//导入./router/route这个包,导出的router就是导出的数据
let router = require("./router/router");
let koa = require('koa');
let static = require('koa-static');
let path = require('path');
let views = require("koa-views");
let koaBody = require('koa-body');


//通过koa创建一个应用程序
let app = new koa();

app.use(async (ctx,next)=>{
    console.log(`${ctx.method} ${ctx.url}.............`);
    await next();
});

//可以解析多个字段,针对于文件上传的时候,可以解析多个字段;
app.use(koaBody({multipart:true}));

//注册静态文件的库到中间件
app.use(static(path.join(__dirname,"static")));
//注册模板引擎的库到中间件
app.use(views(path.join(__dirname,"views"),{extension:"ejs",map:{html:"ejs"}}));

//路由要放到后面
app.use(router.routes());
console.log("正在监听8888端口");
app.listen(8888);