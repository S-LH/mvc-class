using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;
using Aop.Api;
using Aop.Api.Domain;
using Aop.Api.Request;
using Aop.Api.Response;

namespace 奈班级学生管理系统.Controllers
{
    public class SStudentController : Controller

    {
        NaiClassEntities1 db = new NaiClassEntities1();
        /* 配置文件 PZ类*/
        AlipayTradePagePayModel model = new AlipayTradePagePayModel();
        AlipayTradePagePayResponse response = null;
        AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();
        DefaultAopClient client = new DefaultAopClient(PZ.wayUrl, PZ.app_id, PZ.private_key, "json", "1.0", PZ.sign_type, PZ.alipay_public_key, PZ.charset);
      
        // GET: SStudent
        public ActionResult Student()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {


                int StuId = int.Parse(Session["StuID"].ToString());
                ViewBag.Slist = db.Student.Include("Teacher").Where(a => a.StudentID == StuId).ToList();
                ViewBag.CourseList = db.Course.ToList().Take(6);
                ViewBag.Count = db.Course.Count();
                return View();
            }

        }
        public ActionResult Safety()
        {
            return View();
        }
      
      
        [HttpPost]
        public ActionResult EditPassword(String StudentPwd)
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int id = int.Parse(Session["StuID"].ToString());
                string pwd = Request["StudentPwd"];
                //判断密码是否存在
                var stupwd = db.Student.FirstOrDefault(n => n.StudentPwd == pwd && n.StudentID == id);
                if (stupwd != null)
                {
                    return Json(0);
                }
                else
                {
                    return Json(1);
                }
            }
        }
        public ActionResult UpadatePwd(string StudentNPwd)
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                string newpwd = Request["StudentNPwd"];

                if (newpwd != null)
                {
                    int id = int.Parse(Session["StuID"].ToString());

                    //通过id找到原始的学生数据
                    var oldstu = db.Student.Find(id);
                    //把新的密码赋值给原始学生的密码
                    oldstu.StudentPwd = newpwd;
                    db.SaveChanges();
                }

                return new EmptyResult();
            }

        }
        /// <summary>
        /// 缴费列表
        /// </summary>
        /// <returns></returns>
        public ActionResult Money()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int cid = int.Parse( Session["ClassID"].ToString());

                var list = (from a in db.PayTable
                         
                            join c in db.Student on a.StudentID equals c.StudentID
                            select new { stely = a.PayStely, state = a.Paystate, money = a.PayMoney, stuname = c.StudentName, stuid = c.StudentID, time = a.Time,sposition=c.Position ,cid=c.ClassID,pid=a.PayID}).Where(a => a.sposition == "生活委员"&&a.cid==cid).ToList();
               
                List<dynamic> Paylist = new List<dynamic>();
                foreach (var data in list.ToList())
                {
                    dynamic dyObject = new ExpandoObject();
                    dyObject.stely = data.stely;

                    dyObject.state = data.state == 0 ? "未缴费" : "已缴费";
                    dyObject.money = double.Parse(data.money.ToString()).ToString("C");
                    dyObject.stuname = data.stuname;
                    dyObject.stuid = data.stuid;
                    dyObject.time = data.time;
                    dyObject.position = data.sposition;
                    dyObject.payid = data.pid;
                    Paylist.Add(dyObject);
                }
                ViewBag.posit = Session["Position"];
                ViewBag.PayList = Paylist;

                return View();

            }

        }
        public ActionResult App(int?id)
        {

            using (NaiClassEntities1 db =new NaiClassEntities1())
            {

                var pay = db.PayTable.Find(id);
                string OrderNo = DateTime.Now.Year.ToString().Substring(2, 2) + DateTime.Now.Month.ToString().PadLeft(2, '0') + DateTime.Now.Day.ToString().PadLeft(2, '0') + DateTime.Now.Hour.ToString().PadLeft(2, '0') + DateTime.Now.Minute.ToString().PadLeft(2, '0') + DateTime.Now.Second.ToString().PadLeft(2, '0') + DateTime.Now.ToString("fff");
                //订单号赋值给TextBox1控件值
                //TextBox1.Text = OrderNo;
                //订单号赋值
                string WIDout_trade_no = OrderNo.Trim();
                //订单名称上传赋值
                string subject = pay.PayStely;
                //订单号上传赋值
                string out_trade_no = WIDout_trade_no.Trim();
                //订单价格上传赋值
                //string money =decimal.Parse(pay.PayMoney.ToString()).ToString();
                string total_amount =pay.PayMoney;
                
                //上传支付宝后台接收值
                //订单名称
                model.Subject = subject;
                model.TotalAmount = total_amount;
                model.OutTradeNo = out_trade_no;
                model.ProductCode = "FAST_INSTANT_TRADE_PAY";

                request.SetReturnUrl(PZ.AliPayReturn_url);
                request.SetNotifyUrl("");
                request.SetBizModel(model);
                try
                {
                    response = client.pageExecute(request, null, "post");
                    Response.Write(response.Body);
                    Response.Write(PZ.AliPayReturn_url);
                    pay.Paystate = 1;
                    db.SaveChanges();
                    return View();
               
                   


                }
                catch (Exception exp)
                {
                    throw exp;

                }
            }
           
           

        }
    }
}
