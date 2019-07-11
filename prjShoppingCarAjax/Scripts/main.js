$(function () {
    //ajax測試網址
    //本機VS環境http://localhost:59731
    //本機IIS環境http://218.161.70.68
    //實際網路環境http://rwenshop.wenyinghan.nctu.me
    var apiurl = "http://rwenshop.wenyinghan.nctu.me/api/Ajax/";
    //網頁基本前端設定
    Webformat();
    //管理者用ajax方法修改商品
    PostEditProductForm();
    //點擊購物車展示頂部購物車
    ClinkShoppingCarBtnShowTopShoppingCar();
    //從頁面改變購物車數量
    ChageShoppingCarfQty();
    //固定每個商品圖片大小
    FormatImg();
    //管理者新增產品種類
    AdminnewProductKind();
    //管理者修改訂單狀態(待出貨,已出貨,已送達,完成付款)
    AdminEdintProductStatus();
    //ajax DELETE網頁頁面購物車
    DeleteShoppingCarbyView();
    //ajax POST新增某項商品到購物車
    AddProducInShoppingCar();
    //ajax POST管理者刪除某項商品
    DeleteProduct();
    ///////////////////////////////////////////////////////////////
    ////以下是方法本體，以上是方法調用////////////////////////////////
    ///////////////////////////////////////////////////////////////
    //管理者用ajax方法修改商品
    function PostEditProductForm() {
        $('.PostEditProductForm').ajaxForm(function (data) {
            if (data == 1) {
                alert("修改成功");

                $('.onlyStock').each(function () {
                    if ($(this).children('input').val() != 0) {
                        $(this).css('color', 'black');
                        $(this).children('input').css('color', 'black');
                    } else {
                        $(this).css('color', 'red');
                        $(this).children('input').css('color', 'red');
                    }
                })
            } else {
                alert("修改失敗");
            }
        });
    }
    //網頁基本前端設定
    function Webformat() {
       
        $('.thumbnail').css("background-color", "rgb(255, 255, 255,0.9)");
        //滑入滑出商品會有邊框變化
        $('.thumbnail').hover(function () {
            $(this).css("border-style", "outset");
            $(this).css("background-color", "rgb(255, 255, 255)");
           
        }, function () {
                $(this).css("background-color", "rgb(255, 255, 255,0.9)");
            $(this).css("border", "1px solid #ddd");
        });
        //購物車字體顏色黃
        $('#ShoppingCar a').css("color", "yellow");
        if ($('#shoppingcartable tr').length > 1) {
            $('#OrderShoppingCar').attr('disabled', false);
        } else {
            $('#OrderShoppingCar').attr('disabled', true);
        }
    }
    //點擊購物車展示頂部購物車
    function ClinkShoppingCarBtnShowTopShoppingCar() {
        $("#ShoppingCar").off("click").on("click", function () {
            if ($("#TempCar").css("display") == "none") {
                $(this).css("background-color", "#999999");
                LoadShoppingCar();
                $('#TempCar').slideDown();
            } else {
                $(this).css("background-color", "rgb(34, 34, 34)");
                $('#TempCar').slideUp();
            };
        });
    }
    //從頁面改變購物車數量
    function ChageShoppingCarfQty() {
        $(".ChageShoppingCarfQty").change(function () {
            var fUserId = $('#Member_head').attr("name");
            var fName = $(this).parent().siblings('#fName').attr("name");
            var fPrice = $(this).parent().siblings('#fPrice').attr("name");
            var newfQty = $(this).val();
            var oldfQty = $(this).parent('#fQty').attr("name");
            var fPId = $(this).parent().siblings('#fPId').attr("name");
            var data = "?fUserId=" + fUserId + "&fName=" + fName + "&fPrice=" + fPrice + "&newfQty=" + newfQty + "&oldfQty=" + oldfQty + "&fPId=" + fPId;
            $.ajax({
                url: apiurl + "PutShoppingCar" + encodeURI(data),
                type: 'PUT',
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result != 0) {
                        LoadShoppingCarbyView();
                    } else {
                        alert("修改失敗");
                    }
                }
            });
        });

    };
    //從頂部小購物車改變購物車數量
    function TopChageShoppingCarfQty() {
        $(".TopChageShoppingCarfQty").change(function () {
            var fUserId = $('#Member_head').attr("name");
            var fName = $(this).parent().siblings('#fName').attr("name");
            var fPrice = $(this).parent().siblings('#fPrice').attr("name");
            var newfQty = $(this).val();
            var oldfQty = $(this).parent('#fQty').attr("name");
            var fPId = $(this).parent().parent('#fPId').attr("name");
            var data = "?fUserId=" + fUserId + "&fName=" + fName + "&fPrice=" + fPrice + "&newfQty=" + newfQty + "&oldfQty=" + oldfQty + "&fPId=" + fPId;
            $.ajax({
                url: apiurl + "PutShoppingCar" + encodeURI(data),
                type: 'PUT',
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result != 0) {
                        LoadShoppingCar();
                        LoadShoppingCarbyView();
                    } else {
                        alert("修改失敗");
                    }
                }
            });
        });

    };
    //固定每個商品圖片大小
    function FormatImg() {
        $("img").each(function () {
            if (this.width < this.height) {
                $(this).height(245);
                $(this).width("auto");
                $(this).css('margin-top', 0 + 'px');
                $(this).css('margin-bottom', 0 + 'px');
            } else {
                $(this).width(245);
                $(this).height("auto");
                var heigh = Math.floor($(this).height());
                $(this).css('height', heigh + 'px');
                $(this).css('margin-top', Math.floor(((245 - heigh) / 2)) + 'px');
                $(this).css('margin-bottom', Math.ceil(((245 - heigh) / 2)) + 'px');
            }

        });
        var thumbnail_height = $(".thumbnail:first").height();
        $(".thumbnail").height(thumbnail_height);
        if ($("#preview_progressbarTW_img").width() < $("#preview_progressbarTW_img").height()) {
            $("#preview_progressbarTW_img").height(245);
            $("#preview_progressbarTW_img").width("auto");
            var width = Math.floor($("#preview_progressbarTW_img").width());
            $("#preview_progressbarTW_img").css('margin-top', 0 + 'px');
            $("#preview_progressbarTW_img").css('margin-bottom', 0 + 'px');
            $("#preview_progressbarTW_img").css('margin-left', Math.floor(((245 - width) / 2)) + 'px');
            $("#preview_progressbarTW_img").css('margin-right', Math.ceil(((245 - width) / 2)) + 'px');
        }
        else {
            $("#preview_progressbarTW_img").width(245);
            $("#preview_progressbarTW_img").height("auto");
            var heigh = Math.floor($("#preview_progressbarTW_img").height());
            $("#preview_progressbarTW_img").css('height', heigh + 'px');
            $("#preview_progressbarTW_img").css('margin-top', Math.floor(((245 - heigh) / 2)) + 'px');
            $("#preview_progressbarTW_img").css('margin-bottom', Math.ceil(((245 - heigh) / 2)) + 'px');
        }


    }
    //限制input只能打數字
    function isNull(str) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    };
    //管理者新增產品種類
    function AdminnewProductKind() {
        $('#newfKind_btn').off("click").on("click", function () {
            if (isNull($('#newfKind').val()) == false) { $('#fKind').append('<option value=' + $('#newfKind').val().replace(/\s+/g, "") + '>' + $('#newfKind').val().replace(/\s+/g, "") + '</option>'); }
            $('#fKind option[value=' + $('#newfKind').val().replace(/\s+/g, "") + ']').attr('selected', 'selected');
        })
        //新增商品圖案時能馬上預覽
        $("input[name='fImg']").change(function () {
            //當檔案改變後，做一些事 
            readURL(this);
        });
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(input).parent("p").parent().parent().prev("img").attr('src', e.target.result);
                    $('#preview_progressbarTW_img').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
                reader.onloadend = function (e) {
                    FormatImg();
                }
            }
        }
    }
    //管理者修改訂單狀態(待出貨,已出貨,已送達,完成付款)
    function AdminEdintProductStatus() {
        $('.OrderStatusEdit').off("click").on("click", function () {
            var r = confirm("確定要修改嗎?");
            if (r == true) {
                var fOrderGuid, fStatus;
                fOrderGuid = $(this).parent().siblings('.fOrderGuid').attr('id');
                fStatus = $(this).siblings('select').val();
                var data = "?fOrderGuid=" + fOrderGuid + "&fStatus=" + fStatus;
                $.ajax({
                    url: apiurl + "PutEditProductStatus" + encodeURI(data),
                    type: 'PUT',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        if (result != 0) {
                            alert("修改成功");
                        } else {
                            alert("修改失敗");
                        }
                    }
                });
            }
        });
    }
    //ajax get載入網頁頂部購物車
    function LoadShoppingCar() {
        var fUserId = $('#Member_head').attr("name");
        var data = "?fUserId=" + fUserId;
        $.ajax({
            url: apiurl + "PostShowShoppingCar" + encodeURI(data),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#TempCar table').empty();
                var total = 0;
                $('#TempCar table').append('<tr><th>產品</th><th>單價</th><th>數量</th><th>總價</th></tr>')
                for (var i = 0; i < data.length; i++) {
                    $('#TempCar table').append(
                        '<tr id="fPId" name="' + data[i].fPId + '"><td id="fName" name="' + data[i].fName + '">' + data[i].fName +
                        '</td ><td id="fPrice" name="' + data[i].fPrice + '">' + data[i].fPrice +
                        '</td ><td id="fQty" name="' + data[i].fQty + '">' + '<input min="1" max="20" step="1" class="TopChageShoppingCarfQty" type="number" value="' + data[i].fQty + '">' +
                        '</td ><td>' + data[i].fQty * data[i].fPrice +
                        '</td><td><div class="btn btn-primary deleteShoppingCar">刪除購物車</div></td>' +
                        "</tr > "
                    )
                    total += data[i].fQty * data[i].fPrice;
                }
                $('#temptotal').text("總金額：" + total);
                DeleteShoppingCar();
                TopChageShoppingCarfQty();
                if ($('#shoppingcartable tr').length > 1) {
                    $('#OrderShoppingCar').attr('disabled', false);
                } else {
                    $('#OrderShoppingCar').attr('disabled', true);
                }
                $('.deleteShoppingCar').parent('td').width(110);
                $('#TempCar table tr td').css('white-space', 'nowrap');
               
            }
        });
    }
    //ajax DELETE網頁頂部購物車
    function DeleteShoppingCar() {
        $('.deleteShoppingCar').off("click").on("click", function () {
            var thisItem = $(this).parent().parent('tr');
            var fUserId = $('#Member_head').attr("name");
            var fName = $(this).parent().siblings('#fName').attr("name");
            var fPrice = $(this).parent().siblings('#fPrice').attr("name");
            var fQty = $(this).parent().siblings('#fQty').attr("name");
            var fPId = $(this).parent().parent('#fPId').attr("name");
            var data = "?fUserId=" + fUserId + "&fName=" + fName + "&fPrice=" + fPrice + "&fQty=" + fQty + "&fPId=" + fPId;
            $.ajax({
                url: apiurl + "DeleteShoppingCar" + encodeURI(data),
                type: 'DELETE',
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result != 0) {
                        thisItem.remove();
                        LoadShoppingCarbyView();
                        LoadShoppingCar();
                    } else {
                        alert("刪除失敗");
                    }
                }
            });

        })

    }
    //ajax DELETE網頁頁面購物車
    function DeleteShoppingCarbyView() {
        $('.deleteShoppingCarbyView').off("click").on("click", function () {
            var thisItem = $(this).parent().parent('tr');
            var fUserId = $(this).parent().siblings('#fUserId').attr("name");
            var fName = $(this).parent().siblings('#fName').attr("name");
            var fPrice = $(this).parent().siblings('#fPrice').attr("name");
            var fQty = $(this).parent().siblings('#fQty').attr("name");
            var fPId = $(this).parent().siblings('#fPId').attr("name");
            var data = "?fUserId=" + fUserId + "&fName=" + fName + "&fPrice=" + fPrice + "&fQty=" + fQty + "&fPId=" + fPId;
            $.ajax({
                url: apiurl + "DeleteShoppingCar" + encodeURI(data),
                type: 'DELETE',
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result != 0) {
                        thisItem.remove();

                    } else {
                        alert("刪除失敗");
                    }
                    LoadShoppingCarbyView();
                }
            });


        });

    }
    //ajax GET載入網頁頁面購物車
    function LoadShoppingCarbyView() {
        var fUserId = $('#Member_head').attr("name");
        var data = "?fUserId=" + fUserId;
        $.ajax({
            url: apiurl + "PostShowShoppingCar" + encodeURI(data),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#shoppingcartable tr:first-child').siblings('tr').remove();
                var alltotal = 0;
                for (var i = 0; i < data.length; i++) {
                    $('#shoppingcartable').append(
                        '<tr>' +
                        '<td id="fUserId" name="' + data[i].fUserId + '">' + data[i].fUserId + '</td>' +
                        '<td id="fPId" name="' + data[i].fPId + '">' + data[i].fPId + '</td>' +
                        '<td id="fName" name="' + data[i].fName + '">' + data[i].fName + '</td>' +
                        '<td id="fPrice" name="' + data[i].fPrice + '">' + data[i].fPrice + '</td>' +
                        '<td id="fQty" name="' + data[i].fQty + '">' + '<input  type="number"  min="1" max="20" step="1" class="ChageShoppingCarfQty" value="' + data[i].fQty + '" required >' + '</td>' +
                        '<td>' + data[i].fPrice * data[i].fQty + '</td>' +
                        '<td><div class="btn btn-primary deleteShoppingCarbyView">刪除購物車</div></td>' +
                        '</tr>'
                    )
                    alltotal += data[i].fPrice * data[i].fQty;
                }
                $('#alltotal').text("總金額：" + alltotal);
                DeleteShoppingCarbyView();
                ChageShoppingCarfQty();
                if ($('#shoppingcartable tr').length > 1) {
                    $('#OrderShoppingCar').attr('disabled', false);
                } else {
                    $('#OrderShoppingCar').attr('disabled', true);
                }
            }
        });
    }
    //ajax POST新增某項商品到購物車
    function AddProducInShoppingCar() {
        $('.btnAddCar').off("click").on("click", function () {
            var fUserId, fPId;
            fUserId = $('#Member_head').attr("name");
            fPId = $(this).siblings("h2").attr("id");
            var data = "?fPId=" + fPId + "&fUserId=" + fUserId;
            $.ajax({
                url: apiurl + "PostAddCar" + encodeURI(data),
                type: 'POST',
                cache: false,
                contentType: false,
                processData: false,
                success: function (result) {
                    if (result != 0) {
                        alert("加入成功");
                        LoadShoppingCar();
                    } else {
                        alert("單一商品購買數量上限為20個");
                    }
                }
            });
        });
        //如果購物車沒東西就不能下單
        $('.onlyStock').each(function () {
            if ($(this).attr('name') == "0") {
                $(this).css('color', 'red');
                $(this).siblings('.btnAddCar').attr('disabled', true);
                $(this).siblings('.btnAddCar').off('click');
            }
        })
    }
    //ajax POST管理者刪除某項商品
    function DeleteProduct() {
        $('.btnDeleteProduct').off("click").on("click", function () {
            var r = confirm("確定要刪除嗎?");
            if (r == true) {
                var fPId;
                thisItem = $(this).parent().parent().parent().parent(".col-lg-4");
                fPId = $(this).siblings("#fPId").children("input").attr("id");
                var data = "?fPId=" + fPId;
                $.ajax({
                    url: apiurl + "DeleteProduct" + encodeURI(data),
                    type: 'DELETE',
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        if (result != 0) {
                            alert("刪除成功");
                            thisItem.remove();

                        } else {
                            alert("刪除失敗");
                        }
                    }
                });
            }
        })
    }
});
