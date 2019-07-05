using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

using prjShoppingCarAjax.Models;

namespace prjShoppingCarAjax.Controllers
{
    public class HomeController : Controller
    {
        dbShoppingCarEntities db = new dbShoppingCarEntities();
        
        // 首頁
        public ActionResult Index()
        {

            var products = db.tProduct.OrderByDescending(m => m.fSales).ToList();

            if (Session["Member"] !=null)
            {
                //如果是會員就給會員Layout
                return View("Index", "_LayoutMember", products);
            }
           
            if (Session["Admin"] != null)
            {
                //如果是管理者就給管理者Layout
                return View("Index", "_LayoutAdmin", products);
            }
            //如果是訪客就給訪客Layout
            return View("Index", "_Layout", products);
        }

        //登入頁面
        public ActionResult Login()
        {
            return View();
        }
        //Post: 登入方法
        [HttpPost]
        public ActionResult Login(string fUserId, string fPwd)
        {
            // 依照帳密找出會員
            var member = db.tMember
                .Where(m => m.fUserId == fUserId && m.fPwd == fPwd)
                .FirstOrDefault();
            //若member為null，表示會員未註冊
            if (member == null)
            {
                ViewBag.Message = "帳密錯誤，登入失敗";
                return View();
            }
            if (member.fUserId == "123" && member.fPwd == "123")
            {
                //管理員登入
                Session["Admin"] = member;
            }
            else
            {
                //會員登入
                Session["Member"] = member;
            }       
            Session["WelCome"] = member.fName + "歡迎光臨";         
            //回到首頁
            return RedirectToAction("Index");
        }
        //登出
        public ActionResult Logout()
        {
            //清除Session變數資料
            Session.Clear(); 
            //回到首頁
            return RedirectToAction("Index");
        }




        public ActionResult CreateProduct()
        {

            List<tProduct> kind = db.tProduct
              .GroupBy(m => m.fKind)
              .Select(g => g.FirstOrDefault())
              .ToList();

            return View("CreateProduct", "_LayoutAdmin", kind);
        }

        [HttpPost]
        public ActionResult CreateProduct(string fPId, string fName, string fPrice, HttpPostedFileBase fImg, string fKind, string stock)
        {
            var check = db.tProduct.Where(m => m.fPId == fPId).FirstOrDefault();
            if (check != null)
            {
                Session["ProductExisted"] = "產品編號 " + fPId + " 重複";
                return RedirectToAction("CreateProduct");
            }

            string fileName = "";
            string newfilename = "";
            if (fImg != null)
            {

                if (fImg.ContentLength > 0)
                {
                    fileName = Path.GetFileName(fImg.FileName);
                    var path = Path.Combine(Server.MapPath("~/images"), fileName);
                    fImg.SaveAs(path);
                    string new_path = Server.MapPath("~") + "\\images\\";
                    string oldfile = new_path + fileName;
                    newfilename = Guid.NewGuid().ToString() + Path.GetExtension(fImg.FileName);
                    string newfile = new_path + newfilename;
                    System.IO.File.Move(oldfile, newfile);

                }
            }


            var prduct = new tProduct
            {
                fPId = fPId,
                fName = fName,
                fPrice = int.Parse(fPrice),
                fImg = newfilename,
                fKind = fKind,
                fSales=0,
                stock = int.Parse(stock)
            };
            db.tProduct.Add(prduct);
            db.SaveChanges();
         
            return RedirectToAction("Index");
        }






    }
}