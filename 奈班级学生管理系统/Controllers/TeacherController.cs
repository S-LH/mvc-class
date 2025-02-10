using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class TeacherController : Controller
    {
        // GET: Teacher
        public ActionResult Index()
        {


            return View();
        }
        public ActionResult Top()
        {

            return View();
        }
        public ActionResult Left()
        {
            return View();
        }
        public ActionResult Right()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult QQ()
        {
            return View();
        }
         public ActionResult dl()
        {
            return View();
        }
        [HttpPost]
        public ActionResult dl(string Phone,string Pwd)
        {
            if (ModelState.IsValid)
            {
                using (NaiClassEntities1 db = new NaiClassEntities1())
                {
                    //获取文本款的值
                    string phone = Request["Phone"];
                    string pwd = Request["Pwd"];
                    if (phone != "" && pwd != "")
                    {
                        //判断手机号是否存在
                        var ph = db.Teacher.FirstOrDefault(p => p.Phone == phone);
                        if (ph != null)
                        {
                            //判断手机号是否与密码匹配
                            var pd = db.Teacher.FirstOrDefault(p => p.Phone == phone && p.Pwd == pwd);
                            if (pd != null)
                            {
                                Session["TeacherID"] = pd.TeacherID;
                                Session["TeacherName"] = pd.TeacherName;
                                return RedirectToAction("Index");
                            }
                            else
                            {
                                ViewBag.msg = "手机号或密码不正确！";
                            }
                        }
                        else
                        {
                            ViewBag.msg = "此手机号码不存在！";
                        }
                    }
                    else
                    {
                        ViewBag.msg = "请输入手机号和密码！";
                    }
                }
            }
            return View();
        }
        public static string PostUrl = ConfigurationManager.AppSettings["WebReference.Service.PostUrl"];
        public void Page_Load(string phonePass)
        {
            string account = "C26396451";//用户名是登录用户中心->验证码、通知短信->帐户及签名设置->APIID
            string password = "34b869bf3a530d1f95691b70df03c642"; //密码是请登录用户中心->验证码、通知短信->帐户及签名设置->APIKEY
            string mobile = phonePass;
            Random rad = new Random();
            int mobile_code = rad.Next(1000, 10000);
            string content = "您的验证码是：" + mobile_code + " 。请不要把验证码泄露给其他人。";
            //Session["mobile_code"] = mobile_code;
            Session["mobile_code"] =1234;
            Session["mobile"] = mobile;

            string postStrTpl = "account={0}&password={1}&mobile={2}&content={3}";

            UTF8Encoding encoding = new UTF8Encoding();
            byte[] postData = encoding.GetBytes(string.Format(postStrTpl, account, password, mobile, content));

            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(PostUrl);
            myRequest.Method = "POST";
            myRequest.ContentType = "application/x-www-form-urlencoded";
            myRequest.ContentLength = postData.Length;

            Stream newStream = myRequest.GetRequestStream();
            // Send the data.
            newStream.Write(postData, 0, postData.Length);
            newStream.Flush();
            newStream.Close();

            HttpWebResponse myResponse = (HttpWebResponse)myRequest.GetResponse();
            if (myResponse.StatusCode == HttpStatusCode.OK)
            {
                StreamReader reader = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);

                //Response.Write(reader.ReadToEnd());

                string res = reader.ReadToEnd();
                int len1 = res.IndexOf("</code>");
                int len2 = res.IndexOf("<code>");
                string code = res.Substring((len2 + 6), (len1 - len2 - 6));
                //Response.Write(code);

                int len3 = res.IndexOf("</msg>");
                int len4 = res.IndexOf("<msg>");
                string msg = res.Substring((len4 + 5), (len3 - len4 - 5));
                Response.Write(msg);

                Response.End();

            }
            else
            {
                //访问失败
            }
        }

        //匹配验证码
        public ActionResult take()
        {
            int a = 0890;
            //string mobile_code = Session["mobile_code"].ToString();
            string mobile_code = a.ToString();
            return Json(mobile_code, JsonRequestBehavior.AllowGet);
           
        }
        // GET: Send

        public ActionResult wjmm()
        {
            return View();
        }
        [HttpPost]
        public ActionResult wjmm(string phonePass)
        {
            using (NaiClassEntities1 db=new NaiClassEntities1 ())
            {
                var phone= db.Teacher.FirstOrDefault(p => p.Phone == phonePass);
            
                if (phone != null)
                {
                    Session["TeacherID"] = phone.TeacherID;
                    Session["TeacherName"] = phone.TeacherName;
                    return Content("true");
                }
                else
                {
                    return Content("false");
                }
            }
           
        }

        public ActionResult Bootom()
        {
            ViewBag.Time = DateTime.Now;
            return View();
        }


    }
}