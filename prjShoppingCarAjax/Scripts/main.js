$(function () {
    $('#ShoppingCar a').css("color", "yellow");
    if ($('#shoppingcartable tr').length > 1) {
        $('#OrderShoppingCar').attr('disabled', false);
    } else {
        $('#OrderShoppingCar').attr('disabled', true);
    }

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



    //從頁面改變購物車數量
    function ChageShoppingCarfQty() {
        $(".ChageShoppingCarfQty").change(function () {
            var thisItem = $(this).parent().parent('tr');
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


    ChageShoppingCarfQty();
    //從頂部改變購物車數量
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
    //localhost:59731
    //http://218.161.70.68
    var apiurl = "http://rwenshop.wenyinghan.nctu.me/api/Ajax/";

    function FormatImg() {
        $('.thumbnail').find('img').each(function () {

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
        if ($("#preview_progressbarTW_img").width() < $("#preview_progressbarTW_img").height()) {
            $("#preview_progressbarTW_img").height(245);
            $("#preview_progressbarTW_img").width("auto");
            var width = Math.floor($("#preview_progressbarTW_img").width());
            $("#preview_progressbarTW_img").css('margin-top', 0 + 'px');
            $("#preview_progressbarTW_img").css('margin-bottom', 0 + 'px');
            $("#preview_progressbarTW_img").css('margin-left', Math.floor(((245 - width) / 2)) + 'px');
            $("#preview_progressbarTW_img").css('margin-right', Math.ceil(((245 - width) / 2)) + 'px');
        } else {

            $("#preview_progressbarTW_img").width(245);
            $("#preview_progressbarTW_img").height("auto");
            var heigh = Math.floor($("#preview_progressbarTW_img").height());
            $("#preview_progressbarTW_img").css('height', heigh + 'px');
            $("#preview_progressbarTW_img").css('margin-top', Math.floor(((245 - heigh) / 2)) + 'px');
            $("#preview_progressbarTW_img").css('margin-bottom', Math.ceil(((245 - heigh) / 2)) + 'px');
        }
    }
    FormatImg();
    $("input[name='fImg']").change(function () {
        //當檔案改變後，做一些事 
        readURL(this);   // this代表<input id="imgInp">
    });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(input).parent("p").parent(".caption").prev("img").attr('src', e.target.result);
                $('#preview_progressbarTW_img').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
            reader.onloadend = function (e) {
                FormatImg();
            }
        }
    }
    function EditProduct() {
        $('.btnEditProduct').off("click").on("click", function () {
            var r = confirm("確定要修改嗎?");
            if (r == true) {
                var stock, fName, fPrice, fPId;
                stock = $(this).siblings().children("#stock").val();
                fName = $(this).siblings().children("#fName").val();
                fPrice = $(this).siblings().children("#fPrice").val();
                fPId = $(this).siblings("#fPId").attr("name");
                var data = "?fPId=" + fPId + "&stock=" + stock + "&fName=" + fName + "&fPrice=" + fPrice;
                $.ajax({
                    url: apiurl + "PutProduct" + encodeURI(data),
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
        })
    }
    EditProduct();
    function isNull(str) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }
    $('#newfKind_btn').off("click").on("click", function () {
        if (isNull($('#newfKind').val()) == false) { $('#fKind').append('<option value=' + $('#newfKind').val().replace(/\s+/g, "") + '>' + $('#newfKind').val().replace(/\s+/g, "") + '</option>'); }
        $('#fKind option[value=' + $('#newfKind').val().replace(/\s+/g, "") + ']').attr('selected', 'selected');
    })
    function LoadData(Orderby, Purview) {
        $.ajax({
            url: apiurl + Orderby,
            type: 'GET',
            success: function (data) {
                if (Purview == 'Admin') {
                    $('#rowShow').empty();
                    for (var i = 0; i < data.length; i++) {
                        $('#rowShow').append(
                            '<div class="col-lg-4">' +
                            '<div class="thumbnail">' +
                            '<img src="/images/' + data[i].fImg + '" style="width:70%" id="' + data[i].fPId + '">' +
                            '<div class="caption">' +
                            '<p>上傳產品照片：<input type="file" name="fImg" id="fImg" accept="image/gif, image/jpeg, image/png" /></p>' +
                            '<p id = "fPId" name = "' + data[i].fPId + '" >' + ' 編號：' + data[i].fPId + '</p >' +
                            '<p>種類：' + data[i].fKind + '</p>' +
                            '<h2><input type="text" value="' + data[i].fName + '" id="fName" name="fPrice"></h2>' +
                            '<p>單價：<input type="text" value="' + data[i].fPrice + '" id="fPrice" name="fPrice"></p>' +
                            '<p>庫存：<input type="text" value="' + data[i].stock + '" id="stock" name="stock"></p>' +
                            '<p>銷量：' + data[i].fSales + '</p>' +
                            '<p>上架日期：' + data[i].fDate + '</p>' +
                            '<p><div class="btn btn-primary btnEditProduct">修改產品</div></p>' +
                            '<p><div class="btn btn-primary btnDeleteProduct">刪除產品</div></p>' +
                            '</div ></div ></div >'
                        )
                    }
                }
                FormatImg();
                DeleteProduct();
                EditProduct();
            }
        })
    }

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

    function LoadShoppingCar() {
        var fUserId = $('#Member_head').attr("name");
        var data = "?fUserId=" + fUserId;
        $.ajax({
            url: apiurl + "GetShowShoppingCar" + encodeURI(data),
            type: 'GET',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#TempCar table').empty();
                var total = 0;
                for (var i = 0; i < data.length; i++) {
                    $('#TempCar table').append(
                        '<tr id="fPId" name="' + data[i].fPId + '"><td id="fName" name="' + data[i].fName + '">產品:' + data[i].fName +
                        '</td ><td id="fPrice" name="' + data[i].fPrice + '">單價:' + data[i].fPrice +
                        '</td ><td id="fQty" name="' + data[i].fQty + '">數量:' + '<input min="1" max="20" step="1" class="TopChageShoppingCarfQty" type="number" value="' + data[i].fQty + '">' +
                        '</td ><td>總價:' + data[i].fQty * data[i].fPrice +
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
            }
        });
    }
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
    DeleteShoppingCarbyView();




    function LoadShoppingCarbyView() {
        var fUserId = $('#Member_head').attr("name");
        var data = "?fUserId=" + fUserId;
        $.ajax({
            url: apiurl + "GetShowShoppingCar" + encodeURI(data),
            type: 'GET',
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
    function DeleteProduct() {
        $('.btnDeleteProduct').off("click").on("click", function () {
            var r = confirm("確定要刪除嗎?");
            if (r == true) {
                var fPId;
                fPId = $(this).siblings("#fPId").attr("name");
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
                            LoadData('GetProductBySales', 'Admin');
                        } else {
                            alert("刪除失敗");
                        }
                    }
                });
            }
        })
    }
    DeleteProduct();










});
