using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using PagedList;

using prjShoppingCarAjax.Models;

namespace prjShoppingCarAjax.Controllers
{
    public class HomeController : Controller
    {
        ShoppingCarEntities db = new ShoppingCarEntities();
        int pageSize = 9; //一頁9筆資料
        // 首頁
        public ActionResult Index(string orderby = "日期排序新到舊", string productkind = "全部", string keyword = "", int page = 1)
        {
            int currentPage = page < 1 ? 1 : page;
            var products = db.tProduct.OrderByDescending(m => m.fDate).ToList();
            Session["AllProducts"] = db.tProduct
                                       .GroupBy(m => m.fKind)
                                       .Select(g => g.FirstOrDefault())
                                       .ToList();
            Session["Orderby"] = orderby;
            Session["Keyword"] = keyword;
            Session["Productkind"] = productkind;
            if (orderby == "日期排序新到舊")
            {
                products = db.tProduct.OrderByDescending(m => m.fDate).ToList();
            }
            else if (orderby == "日期排序舊到新")
            {
                products = db.tProduct.OrderBy(m => m.fDate).ToList();
            }
            else if (orderby == "種類排序")
            {
                products = db.tProduct.OrderBy(m => m.fKind).ToList();
            }
            else if (orderby == "銷量排序高到低")
            {
                products = db.tProduct.OrderByDescending(m => m.fSales).ToList();
            }
            else if (orderby == "銷量排序低到高")
            {
                products = db.tProduct.OrderBy(m => m.fSales).ToList();
            }
            else if (orderby == "價錢排序高到低")
            {
                products = db.tProduct.OrderByDescending(m => m.fPrice).ToList();
            }
            else if (orderby == "價錢排序低到高")
            {
                products = db.tProduct.OrderBy(m => m.fPrice).ToList();
            }

            if (productkind != "全部")
            {
                products = products.Where(m => m.fKind.Contains(productkind)).ToList();
            }

            if (keyword != "")
            {
                products = products.Where(m => m.fName.Contains(keyword)).ToList();
            }

            var result_product = products.ToPagedList(currentPage, pageSize);

            if (Session["Member"] != null)
            {
                //如果是會員就給會員Layout
                return View("Index", "_LayoutMember", result_product);
            }

            if (Session["Admin"] != null)
            {
                //如果是管理者就給管理者Layout
                return View("Index", "_LayoutAdmin", result_product);
            }
            //如果是訪客就給訪客Layout
            return View("Index", "_Layout", result_product);
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
            if (member.fUserId == "admin" && member.fPwd == "admin")
            {
                //管理員登入
                Session["Admin"] = member;
            }
            else
            {
                //會員登入
                Session["Member"] = member;
                Session["MemberUserId"] = (Session["Member"] as tMember).fUserId;
            }
            Session["WelCome"] = member.fName + " - 歡迎光臨";
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
                fSales = 0,
                stock = int.Parse(stock),
                fDate = DateTime.Today
            };
            db.tProduct.Add(prduct);
            db.SaveChanges();

            return RedirectToAction("Index");
        }
        //訂單列表
        public ActionResult OrderList()
        {
            //找出會員帳號並指定給fUserId
            if (Session["Admin"] != null)
            {
                return View("OrderList", "_LayoutAdmin", db.tOrder.OrderByDescending(m => m.fDate).ToList());
            }
            string fUserId = (Session["Member"] as tMember).fUserId;
            //找出目前會員的所有訂單主檔記錄並依照fDate進行遞增排序
            //將查詢結果指定給orders
            var orders = db.tOrder.Where(m => m.fUserId == fUserId)
                .OrderByDescending(m => m.fDate).ToList();
            //目前會員的訂單主檔
            //指定OrderList.cshtml套用_LayoutMember.cshtml，View使用orders模型
            return View("OrderList", "_LayoutMember", orders);
        }
        //訂單明細
        public ActionResult OrderDetail(string fOrderGuid)
        {
            //根據fOrderGuid找出和訂單主檔關聯的訂單明細，並指定給orderDetails
            var orderDetails = db.tOrderDetail
                .Where(m => m.fOrderGuid == fOrderGuid).ToList();
            //目前訂單明細
            //指定OrderDetail.cshtml套用_LayoutMember.cshtml，View使用orderDetails模型
            return View("OrderDetail", "_LayoutMember", orderDetails);
        }
        //進到購物車&結帳去頁面
        public ActionResult ShoppingCar()
        {
            //取得登入會員的帳號並指定給fUserId
            string fUserId = (Session["Member"] as tMember).fUserId;
            //找出未成為訂單明細的資料，即購物車內容
            var orderDetails = db.tOrderDetail.Where
                (m => m.fUserId == fUserId && m.fIsApproves == "否")
                .ToList();
            //指定ShoopingCar.cshtml套用_LayoutMember.cshtml，View使用orderDetails模型
            return View("ShoppingCar", "_LayoutMember", orderDetails);
        }


        //Post:Index/ShoppingCar
        [HttpPost]
        public ActionResult ShoppingCar(string fReceiver, string fEmail, string fAddress)
        {
            //找出會員帳號並指定給fUserId
            string fUserId = (Session["Member"] as tMember).fUserId;
            //建立唯一的識別值並指定給guid變數，用來當做訂單編號
            //tOrder的fOrderGuid欄位會關聯到tOrderDetail的fOrderGuid欄位
            //形成一對多的關係，即一筆訂單資料會對應到多筆訂單明細
            string guid = Guid.NewGuid().ToString();
            //建立訂單主檔資料
            tOrder order = new tOrder
            {
                fOrderGuid = guid,
                fUserId = fUserId,
                fReceiver = fReceiver,
                fEmail = fEmail,
                fAddress = fAddress,
                fDate = DateTime.Now,
                fStatus = "待出貨"
            };
            db.tOrder.Add(order);
            //找出目前會員在訂單明細中是購物車狀態的產品
            var carList = db.tOrderDetail
                .Where(m => m.fIsApproves == "否" && m.fUserId == fUserId)
                .ToList();
            //將購物車狀態產品的fIsApproved設為"是"，表示確認訂購產品
            foreach (var item in carList)
            {
                var product = db.tProduct.Where(m => m.fPId == item.fPId).FirstOrDefault();
                if (item.fQty > product.stock)
                {
                    Session["StockShort"] = product.fName + " 庫存不足。庫存僅剩 " + product.stock + " 請更改數量後在下單。";
                    return RedirectToAction("ShoppingCar");
                }
                product.stock -= item.fQty;
                product.fSales += item.fQty;
                item.fOrderGuid = guid;
                item.fIsApproves = "是";
            }
            //更新資料庫，異動tOrder和tOrderDetail
            //完成訂單主檔和訂單明細的更新
            db.SaveChanges();
            //執行Home控制器的OrderList動作方法
            return RedirectToAction("OrderList");
        }

        //會員註冊
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Register(tMember pMember)
        {
            //若模型沒有通過驗證則顯示目前的View
            if (ModelState.IsValid == false)
            {
                return View();
            }
            // 依帳號取得會員並指定給member
            var member = db.tMember
                .Where(m => m.fUserId == pMember.fUserId)
                .FirstOrDefault();
            //若member為null，表示會員未註冊
            if (member == null)
            {
                //將會員記錄新增到tMember資料表
                db.tMember.Add(pMember);
                db.SaveChanges();
                //執行Home控制器的Login動作方法

                var real_member = db.tMember
                .Where(m => m.fUserId == pMember.fUserId && m.fPwd == pMember.fPwd)
                .FirstOrDefault();

                //使用Session變數記錄歡迎詞
                Session["WelCome"] = real_member.fName + " - 歡迎光臨";
                //使用Session變數記錄登入的會員物件
                Session["Member"] = real_member;
                return RedirectToAction("Index");
            }
            ViewBag.Message = "此帳號己有人使用，註冊失敗";
            return View();
        }
    }
}