
let {success,fail} = require("../utils/myUtils");
module.exports = {
      transactionHtml : async (ctx)=>{
          await ctx.render("transaction.html");
      },

      sendTransaction : async (ctx)=>{
          ctx.body = success("success");
      }

};