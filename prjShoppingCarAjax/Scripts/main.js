$(function () {
    var apiurl = "http://localhost:59731/api/Ajax/";






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
        $('.btnEditProduct').unbind('click').click(function () {
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
    $('#newfKind_btn').unbind('click').click(function () {
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


    function DeleteProduct() {
        $('.btnDeleteProduct').unbind('click').click(function () {
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
