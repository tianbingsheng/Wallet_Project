function saveKeystoreNext() {
    $("#save-keystore").hide();
    $("#save-privatekey").show();
}

function unlockAccountWithPrivatekey(){
    let privatekey = $("#input-privatekey").val();
    console.log(privatekey);
    $.post("/privateunlock",`privatekey=${privatekey}`,function (res,status) {
        console.log(status+JSON.stringify(res));

        if (res.code == 0){
            //将服务端返回的账户信息显示到页面
            configAccountInfo(res.data);
        }
    });
}

//解锁完成以后对账户进行设置数据
function configAccountInfo(data) {
    //将服务端返回的账户信息显示到页面
    $("#account-address").text(data.address);
    $("#account-balance").text(data.balance+ " Ether");

    //隐藏
    $("#transaction-first").hide();
    $("#transaction-second").show();


    //解锁完账户以后,就要将本账户的私钥以及账户地址赋值到转账的隐藏表单当中

    $("input[name=fromaddress]").val(data.address);
    $("input[name=privatekey]").val(data.privatekey);

    $("#account-token-info").text(data.tokenbalance +""+data.symbol);
    $("#send-transaction-token-symbol").text(data.symbol);
}

//通过keystore进行解锁账户
function unlockAccountWithKeystore(){

    //首先判断有没有选择文件
    var filedata = $("#unlock-accout-file").val();
    if (filedata.length <= 0) {
        alert("请选择文件!");
        return
    }

//文件上传通过Formdata去储存文件的数据
    var data = new FormData();
    data.append("file", $("#unlock-accout-file")[0].files[0]);
    data.append("password", $("#unlock-account-password").val());
    // alert(data);
    //请求路径
    var urlStr = "/keystoreunlock";

    $.ajax({
        url: urlStr,
        type: "post",
        dataType: "json",
        contentType: false,
        data: data,
        processData: false,
        success: function (res, status) {
            alert(JSON.stringify(res)+status);

            if (res.code == 0) {
                //将服务端返回的账户信息显示到页面
                configAccountInfo(res.data)
            }
        },
        error: function (res, status) {
            alert(JSON.stringify(res)+status)
        }
    })
}

//所有文档加载完成以后
$(document).ready(function () {


    $("input[name=unlocktype]").change(function () {
        if (this.value == 1) {
            $("#unlock-account-keystore").show();
            $("#unlock-account-privatekey").hide();
        }else{
            $("#unlock-account-keystore").hide();
            $("#unlock-account-privatekey").show();
        }
    });

    //转账
    $("#send-transaction-form").validate({
        //rules需要验证的字段,验证表单的操作
        rules:{
            toaddress:{
                required: true,
            },
            number:{
                required:true,
            },
        },
        messages:{
            toaddress:{
                required:"请输入对方地址",
            },
            number:{
                required:"请输入转账数额"
            },
        },

        submitHandler: function(form)
        {
            var urlStr
            let tokenType = $("#send-transaction-token-type").val();
            if (tokenType == 1){
                urlStr = "/sendtransaction";
            }else{
                urlStr = "/sendtoken";
            }

            $(form).ajaxSubmit({
                url:urlStr,
                type:"post",
                dataType:"json",
                success:function (res, status) {
                    console.log(status+JSON.stringify(res));

                    if (res.code == 0){
                        $("#transaction-complete-hash").text(res.data.transactionHash);
                        $("#transaction-complete-blockhash").text(res.data.blockHash);
                        $("#transaction-complete").show();
                    }
                },
                error:function (res, status) {
                    console.log(status + JSON.stringify(res))
                }
            });
        }
    })

});

function checkTransaction() {
    let hash = $("#transaction-info-hash").val();
    console.log(hash);

    $.post("/checktransaction","hash=" +hash,function (data,status) {
          console.log(status,JSON.stringify(data));

        if (data.code == 0){
            //格式化操作
            $("#transaction-info").text(JSON.stringify(data.data,null,4));
        }

    });

}























