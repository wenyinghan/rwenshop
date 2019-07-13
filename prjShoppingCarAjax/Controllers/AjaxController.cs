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
        //管理者修改商品狀態(待出貨,運送中,已送達,完成付款)
        public int PutEditProductStatus(string fOrderGuid, string fStatus)
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
        //用戶將商品加入購物車
        public int PostAddCar(string fPId, string fUserId)
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
            }
            catch (Exception ex)
            {
                num = 0;
            }
            return num;
        }
        //顯示某個用戶的購物車GET方法沒隱私
        /* public List<tOrderDetail> GetShowShoppingCar(string fUserId)
          {
              var currentCars = db.tOrderDetail.Where(m => m.fUserId == fUserId && m.fIsApproves == "否").ToList();
              return currentCars;
          }*/
        //顯示某個用戶的購物車GET方法沒隱私
         public List<tProduct> GetAllProducts()
          {
              var products = db.tProduct.OrderByDescending(m=>m.fSales).ToList();
              return products;
          }
        //顯示某個用戶的購物車POST方法有隱私
        public List<tOrderDetail> PostShowShoppingCar(string fUserId)
        {
            var currentCars = db.tOrderDetail.Where(m => m.fUserId == fUserId && m.fIsApproves == "否").ToList();
            return currentCars;
        }
        //用戶刪除購物車上的某個商品選項
        public int DeleteShoppingCar(string fPId, string fName, string fQty, string fPrice, string fUserId)
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
        //用戶修改購物車的某個商品的數量
        public int PutShoppingCar(string fPId, string fName, string oldfQty, string newfQty, string fPrice, string fUserId)
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
        //管理者將某商品下架
        public int DeleteProduct(string fPId)
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
