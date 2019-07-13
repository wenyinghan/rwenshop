$(function () {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '442140166626777', // 填入 FB APP ID
            cookie: true,
            xfbml: true,
            version: 'v3.3'
        });
        fb_login = function () {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        }

    };





    // 處理各種登入身份
    function statusChangeCallback(response) {
        console.log(response);
              
        // 登入 FB 且已加入會員
        if (response.status === 'connected') {
            FB.api('/me?fields=id,name,email', function (response) {
                console.log(response);
                
                var data = { fUserId: response.email, fEmail: response.email, fName: response.name }
                $.ajax({
                    url: 'https://rwenshop.wenyinghan.nctu.me/Home/Register',
                    type: 'POST',
                    data: data,
                    success: function () {
                        window.location.href = 'https://rwenshop.wenyinghan.nctu.me';
                    }
                });
            });
        }
 
    }

    // 點擊登入
    $("#FB_login").click(function () {
        // 進行登入程序
        FB.login(function (response) {
            statusChangeCallback(response);
            console.log(window.location.href);
        }, {
                scope: 'public_profile,email'
            });
    });


    // 載入 FB SDK
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/zh_TW/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

});
