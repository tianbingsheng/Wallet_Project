function saveKeystoreNext() {
    $("#save-keystore").hide();
    $("#save-privatekey").show();
}

function unlockAccountWithPrivatekey(){
    let privatekey = $("#input-privatekey").val();
    console.log(privatekey);
    $.post("/privateunlock",`privatekey=${privatekey}`,function (res,status) {
        console.log(status+JSON.stringify(res))

        if (res.code == 0){
            //将服务端返回的账户信息显示到页面
            configAccountInfo(res.data);
        }
    });
}

function configAccountInfo(data) {
    //将服务端返回的账户信息显示到页面
    $("#account-address").text(data.address);
    $("#account-balance").text(data.balance+ " Ether");

    //隐藏
    $("#transaction-first").hide();
    $("#transaction-second").show();
}


function unlockAccountWithKeystore(){

    //首先判断有没有选择文件
    var filedata = $("#unlock-accout-file").val();
    if (filedata.length <= 0) {
        alert("请选择文件!")
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
            $("#unlock-account-keystore").hide()
            $("#unlock-account-privatekey").show();
        }

    })
});
