using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class SCourseController : Controller
    {
        // GET: SCourse
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult SCourse()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                ViewBag.Rtea = (from a in db.Course select a.Rteacher).Distinct().ToList();
                ViewBag.SCourseList = db.Course.ToList();
            }

            return View();
        }
        [HttpPost]
        public ActionResult SCourse(string CourseName, string Rteacher)
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                //判断文本框是否有值
                if (CourseName != "")
                {
                    //模糊查询：Contains等价于数据库 like '%key%'指定的字符串对象是否出现在字符串中
                    ViewBag.SCourseList = db.Course.Where(c => c.CourseName.Contains(CourseName)).ToList();

                }
                else if (Rteacher != "请选择老师")
                {
                    ViewBag.SCourseList = db.Course.Where(c => c.Rteacher.Contains(Rteacher)).ToList();
                }
                else
                {
                    ViewBag.SCourseList = db.Course.ToList();
                }
                return PartialView("SCourseList");
            }


        }
    }
}