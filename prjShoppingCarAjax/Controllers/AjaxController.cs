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
        dbShoppingCarEntities db = new dbShoppingCarEntities();
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
        public int PutProduct(string fPId, string stock , string fName, string fPrice)//管理者修改商品
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
                var product = db.tProduct
                    .Where(m => m.fPId == fPId)
                    .FirstOrDefault();
                product.fName = fName;
                product.fPrice = int.Parse(fPrice);
                product.stock = int.Parse(stock);
                db.SaveChanges();
            }
            catch(Exception ex)
            {
                num = 0;
            }

            return num;
        }
        /*
            public void PutShoppingCar(int id, [FromBody]string value)//用戶修改購物車
            {
            }

            // DELETE: api/Ajax/5
            public void DeleteShoppingCar(int fId)//用戶刪除購物車
            {
            }
            */
            public int DeleteProduct(string fPId)//管理者商品下架
            {
            int num = 1;
            try
            {
              
                var product = db.tProduct
                    .Where(m => m.fPId == fPId)
                    .FirstOrDefault();
                db.tProduct.Remove(product);
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                num = 0;
            }

            return num;
        }

    }
}
