using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class TGradeController : Controller
    {
        Models.JsonResults result = new Models.JsonResults();
        NaiClassEntities1 db = new NaiClassEntities1();
        // GET: TGrade
        public ActionResult AddGrade()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int tid = int.Parse(Session["TeacherID"].ToString());
                ViewBag.classlist = db.Class.Where(c=>c.TeacherID==tid).ToList();
                ViewBag.courselist = db.Course.ToList();
                if (Request["id"] != null)
                {
                    int id = int.Parse(Request["id"]);
                    ViewBag.stulist = db.Student.Include("Grade").Where(c => c.ClassID == id).ToList();
                }
                else
                {
                    ViewBag.stulist = db.Student.Include("Grade").Where(c => c.ClassID == 1).ToList();
                }
            }
            return View();
        }
        [HttpPost]
        public ActionResult AddGrade(Grade gra)
        {

            try
            {
                using (NaiClassEntities1 db = new NaiClassEntities1())
                {
                    var sid = gra.StudentID;
                    var cid = gra.CourseID;
                    int count = db.Grade.Where(s => s.StudentID == sid && s.CourseID == cid).Count();
                    if (count == 0)
                    {
                        db.Grade.Add(gra);
                        if (db.SaveChanges() > 0)
                        {
                            result.status = 1;
                            result.msg = "保存成功！";
                        }
                        else
                        {
                            result.status = 0;
                            result.msg = "保存失败！";
                        }
                    }
                    else
                    {
                        result.status = 0;
                        result.msg = "此学生课程已添加，保存失败！";
                    }
                }
            }
            catch (Exception ex)
            {
                result.status = 0;
                result.msg = "程序异常，异常原因：" + ex.Message;
            }
            return Json(result);
        }

        [HttpPost]
        public ActionResult UpdateGrade(Grade gra)
        {

            try
            {
                using (NaiClassEntities1 db = new NaiClassEntities1())
                {
                    var id = int.Parse(Request["StudentID"]);
                    var cid = int.Parse(Request["CourseID"]);
                    Grade data = db.Grade.FirstOrDefault(a => a.StudentID == id && a.CourseID == cid);//这个id不对  你要变换一下 
                    data.Score = int.Parse(Request["Score"]);
                    if (db.SaveChanges() > 0)
                    {
                        result.status = 1;
                        result.msg = "保存成功！";
                    }
                    else
                    {
                        result.status = 0;
                        result.msg = "保存失败！";
                    }
                }
            }
            catch (Exception ex)
            {
                result.status = 0;
                result.msg = "程序异常，异常原因：" + ex.Message;
            }
            return Json(result);
        }


        public ActionResult GetGrade(int CourseID, string StudentID)
        {
            var sids = StudentID.Split(',');
            string str = "";
            foreach (var val in sids)
            {
                int sid = Convert.ToInt32(val);
                var data = db.Grade.Where(p => p.CourseID == CourseID && p.StudentID == sid).FirstOrDefault();
                if (data != null)
                    str += data.Score + ",";
                else
                    str +=""+data.Score + ",";
            }
            var arrdata = str.Split(',');
            result.Data = arrdata;
            result.msg = "";
            return Json(result);
        }
    }
}