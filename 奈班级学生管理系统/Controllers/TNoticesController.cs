using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class TNoticesController : Controller
    {
        NaiClassEntities1 db = new NaiClassEntities1();
        // GET: TNotices
        public ActionResult Index()
        {
            /* ViewBag.tid= int.Parse(Session["TeacherID"].ToString());*/
            ViewBag.time = DateTime.Now.ToString("yyyy-MM-dd");
            return View();
        }
        public ActionResult List()
        {
           
                int id = int.Parse(Session["TeacherID"].ToString());
                ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.TeacherID == id).ToList();


            
            return View();
        }
       [HttpPost]
        public ActionResult List(string Title, string Time)
        {
           
                //判断文本框是否有值
                if (Title != "")
                {

                int id = int.Parse(Session["TeacherID"].ToString());
                //模糊查询：Contains等价于数据库 like '%key%'指定的字符串对象是否出现在字符串中
                ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.Title.Contains(Title)&&t.TeacherID == id).ToList();

                }
                else if (Time != "")
                {
                int id = int.Parse(Session["TeacherID"].ToString());
                ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.Time.ToString() == Time&& t.TeacherID == id).ToList();
                }
                else
            {
                int id = int.Parse(Session["TeacherID"].ToString());
                ViewBag.NList = db.Notice.Include("Teacher").Where(t => t.TeacherID == id).ToList();
            }
                return PartialView("NoticeList");
            

        }

        [HttpPost]
        [ValidateInput(false)]

        public ActionResult addByNottice(string Title,string ContentText)
        {
            
           var date = DateTime.Now.ToString("yyyy-MM-dd");

            Notice notice = new Notice()
            {
                Title = Title,
                Content = ContentText,
                Time=DateTime.Parse( date),
                TeacherID = int.Parse(Session["TeacherID"].ToString())
                
            };
            db.Notice.Add(notice);
            db.SaveChanges();
            return RedirectToAction("Index");
        }
        public ActionResult Detail(int id)
        {

                var notice = db.Notice.Find(id);
                ViewBag.tlist = db.Teacher.ToList();
                ViewBag.notice = notice;
                return View();
            
            
        }
        public ActionResult Del(int id)
        {
           var list= db.Notice.Find(id);
            db.Notice.Remove(list);
            db.SaveChanges();
            return RedirectToAction("List");
        }


    }
}