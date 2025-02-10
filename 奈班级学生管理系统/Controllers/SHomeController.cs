using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;
using System.Web.Security;



namespace 奈班级学生管理系统.Controllers
{
    public class SHomeController : Controller
    {
        // GET: SHome
        public ActionResult Index()
        {
            ViewBag.Message = "欢迎使用财务模块";

            return View();
        }
        public ActionResult Top()
        {
            ViewBag.UserName = Session["StuName"];
            ViewBag.AvailableBalance = "8888.00";
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
        public ActionResult Bootom()
        {
            ViewBag.Time = DateTime.Now;
            return View();
        }
        public ActionResult SLogin()
        {

            return View();
        }
        [HttpPost]
        public ActionResult SLogin(string StudentNum, string StudentPwd)
        {
            if (ModelState.IsValid)
            {
                using (NaiClassEntities1 db = new NaiClassEntities1())
                {
                    //获取文本框的值
                    string num = Request["StudentNum"];
                    string pwd = Request["StudentPwd"];
                    //非空验证
                    if (num != "" && pwd != "")
                    {
                        //判断学号是否存在
                        var stunum = db.Student.FirstOrDefault(n => n.StudentNum == num);
                        if (stunum != null)

                        {

                            //判断学号与密码是否匹配
                            var stu = db.Student.FirstOrDefault(u => u.StudentNum == num && u.StudentPwd == pwd);

                            if (stu != null)
                            {
                                //传递学生姓名
                                Session["StuName"] = stu.StudentName;
                                //传递学生ID
                                Session["StuID"] = stu.StudentID;
                                //传递老师ID
                                Session["TeaID"] = stu.TeacherID;
                                //传递班级ID
                                Session["ClassID"] = stu.ClassID;
                                //传递职务
                                Session["Position"] = stu.Position;
                                //判断密码是否进行修改
                                if (stu.StudentPwd == "123456")
                                {
                                    return RedirectToAction("UpadatePwd");
                                }
                                else
                                {
                                    FormsAuthentication.SetAuthCookie(StudentNum, false);
                                    return RedirectToAction("Index");
                                }


                            }
                            else
                            {
                                ViewBag.StatusMessage = "学号或密码不正确";
                            }
                        }
                        else
                        {
                            ViewBag.StatusMessage = "此学号不存在！";
                        }
                    }
                    else
                    {
                        ViewBag.StatusMessage = "请输入学号和密码！";
                    }



                }
            }
            return View();
        }
        public ActionResult UpadatePwd()
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
        [HttpPost]
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
        
    }
}