using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class SNoticeController : Controller
    {
        // GET: SNotice
        public ActionResult Index()
        {

            return View();
        }
        public ActionResult SNotice()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int id = int.Parse(Session["TeaID"].ToString());
                ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.TeacherID == id).ToList();


            }
            return View();
        }
        //模糊查询方法
        [HttpPost]
        public ActionResult SNotice(string Title, string Time)
        {
            int id = int.Parse(Session["TeaID"].ToString());
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                //判断文本框是否有值
                if (Title != "")
                {
                    //模糊查询：Contains等价于数据库 like '%key%'指定的字符串对象是否出现在字符串中
                    ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.Title.Contains(Title) && t.TeacherID == id).ToList();

                }
                else if (Time != "")
                {
                    ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.Time.ToString() == Time && t.TeacherID == id).ToList();
                }
                else
                {
                    ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.TeacherID == id).ToList();
                }
                return PartialView("NoticeList");
            }

        }


        public ActionResult Detail(int id)
        {

            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                var notice = db.Notice.Find(id);
                ViewBag.tlist = db.Teacher.ToList();
                ViewBag.notice = notice;
                return View();
            }
        }
        public ActionResult Select()
        {

            return View();
        }
    }
}