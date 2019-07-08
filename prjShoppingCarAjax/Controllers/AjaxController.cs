using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using prjShoppingCarAjax.Models;
using System.Web;



namespace prjShoppingCarAjax.Controllers
{
    public class AjaxController : ApiController
    {
        ShoppingCarEntities db = new ShoppingCarEntities();
        /*    // GET: api/Ajax
            public IEnumerable<string> GetProductByPrice() //依照產品價錢
            {
                return new string[] { "value1", "value2" };
            }

            // GET: api/Ajax/5
            public string GetProductByKind(int id)//依照產品種類
            {
                return "value";
            }
            */
        public List<tProduct> GetProductBySales()//依照產品銷量
        {
            var products = db.tProduct.OrderByDescending(m => m.fSales).ToList();
            return products;
        }
        /*
            // POST: api/Ajax
            public void PostShoppingCar([FromBody]string value)//用戶新增購物車
            {
            }
            public void PostProduct([FromBody]string value)//管理者新增商品
            {
            }*/
        // PUT: api/Ajax/5
        public int PutProduct(string fPId, string stock, string fName, string fPrice)//管理者修改商品
        {


            int num = 1;
            try
            {
                /*  string fileName = "";//舊圖檔名
                  string newfilename = "";//新圖名
                  //把舊圖檔名改成新的guid檔名
                  fileName = Path.GetFileName(fImg.FileName);
                  var path = Path.Combine(HttpContext.Current.Server.MapPath("~/images"), fileName);
                  fImg.SaveAs(path);
                  string new_path = HttpContext.Current.Server.MapPath("~") + "\\images\\";
                  string oldfile = new_path + fileName;
                  newfilename = Guid.NewGuid().ToString() + Path.GetExtension(fImg.FileName);
                  string newfile = new_path + newfilename;
                  System.IO.File.Move(oldfile, newfile);*/

                var OrderDetails = db.tOrderDetail
                        .Where(m => m.fIsApproves == "否"
                        && m.fPId == fPId).ToList();
                foreach (var item in OrderDetails)
                {
                    item.fPrice = int.Parse(fPrice);
                    item.fName = fName;
                }
                var product = db.tProduct
                    .Where(m => m.fPId == fPId)
                    .FirstOrDefault();
                product.fName = fName;
                product.fPrice = int.Parse(fPrice);
                product.stock = int.Parse(stock);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                num = 0;
            }

            return num;
        }

        public int PutEditProductStatus(string fOrderGuid, string fStatus)//管理者修改商品狀態
        {

            int num = 1;
            try
            {
                var orders = db.tOrder.Where(m => m.fOrderGuid == fOrderGuid).FirstOrDefault();
                orders.fStatus = fStatus;
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                num = 0;
            }
            return num;
        }
        public int PostAddCar(string fPId, string fUserId)//用戶加入購物車
        {
            int num = 1;

            try
            {
                var currentCar = db.tOrderDetail
                .Where(m => m.fPId == fPId && m.fIsApproves == "否" && m.fUserId == fUserId)
                .FirstOrDefault();

                var product = db.tProduct.Where(m => m.fPId == fPId).FirstOrDefault();
                if (currentCar == null)
                {
                    tOrderDetail orderDetail = new tOrderDetail
                    {
                        fUserId = fUserId,
                        fPId = product.fPId,
                        fName = product.fName,
                        fPrice = product.fPrice,
                        fQty = 1,
                        fIsApproves = "否"
                    };
                    db.tOrderDetail.Add(orderDetail);
                }
                else if (currentCar.fQty < 20)
                {
                    currentCar.fQty += 1;
                }
                else
                {
                    num = 0;
                }
                db.SaveChanges();

                // var currentCars = db.tOrderDetail.Where(m => m.fUserId == fUserId && m.fIsApproved == "否").ToList();
            }
            catch (Exception ex)
            {
                num = 0;
            }
            return num;
        }
        public List<tOrderDetail> GetShowShoppingCar(string fUserId)//用戶顯示購物車
        {
            var currentCars = db.tOrderDetail.Where(m => m.fUserId == fUserId && m.fIsApproves == "否").ToList();
            return currentCars;
        }



        /*
            public void PutShoppingCar(int id, [FromBody]string value)//用戶修改購物車
            {
            }
            */
        // DELETE: api/Ajax/5
        public int DeleteShoppingCar(string fPId, string fName, string fQty, string fPrice, string fUserId)//用戶刪除購物車
        {
            int num = 1;
            int myfPrice = int.Parse(fPrice);
            int myfQty = int.Parse(fQty);
            try
            {
                var currentCar = db.tOrderDetail
                        .Where(m => m.fUserId == fUserId
                        && m.fIsApproves == "否"
                        && m.fPId == fPId
                        && m.fName == fName
                        && m.fPrice == myfPrice
                        && m.fQty == myfQty).FirstOrDefault();
                db.tOrderDetail.Remove(currentCar);
                db.SaveChanges();

            }
            catch (Exception ex)
            {
                num = 0;
            }

            return num;
        }



        public int PutShoppingCar(string fPId, string fName, string oldfQty, string newfQty, string fPrice, string fUserId)//用戶刪除購物車
        {
            int num = 1;
            int myfPrice = int.Parse(fPrice);
            int myoldfQty = int.Parse(oldfQty);
            int mynewfQty = 1;
            if (int.TryParse(newfQty, out int i))
            {
                mynewfQty = i;
            }
            mynewfQty = mynewfQty > 20 ? 20 : mynewfQty;
            mynewfQty = mynewfQty < 1 ? 1 : mynewfQty;
            try
            {
                var currentCar = db.tOrderDetail
                        .Where(m => m.fUserId == fUserId
                        && m.fIsApproves == "否"
                        && m.fPId == fPId
                        && m.fName == fName
                        && m.fPrice == myfPrice
                        && m.fQty == myoldfQty).FirstOrDefault();
                currentCar.fQty = mynewfQty;
                db.SaveChanges();

            }
            catch (Exception ex)
            {
                num = 0;
            }

            return num;
        }








        public int DeleteProduct(string fPId)//管理者商品下架
        {
            int num = 1;
            try
            {
                var currentCars = db.tOrderDetail
                    .Where(m => m.fPId == fPId && m.fIsApproves == "否").ToList();
                var product = db.tProduct
                    .Where(m => m.fPId == fPId)
                    .FirstOrDefault();
                db.tProduct.Remove(product);
                foreach (var item in currentCars)
                {
                    db.tOrderDetail.Remove(item);
                }
                db.SaveChanges();
                string new_path = System.Web.HttpContext.Current.Server.MapPath("~") + "\\images\\";
                string productImgName = product.fImg;
                string FileName = new_path + productImgName;
                System.IO.File.Delete(FileName);
            }
            catch (Exception ex)
            {
                num = 0;
            }

            return num;
        }

    }
}
