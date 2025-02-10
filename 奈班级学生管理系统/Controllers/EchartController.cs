using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class EchartController : Controller
    {
        // GET: Echart
        public ActionResult Echart()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int id = int.Parse(Session["TeacherID"].ToString());

                ViewBag.msg = db.Student.Include("Teacher").Where(a=>a.TeacherID==id).Count();
                string gqty = "团员";
                ViewBag.gqty= db.Student.Include("Teacher").Where(a => a.PoliticsStatus == gqty).Count();
                string nan = "男";
                ViewBag.nan = db.Student.Include("Teacher").Where(a => a.Sex == nan).Count();
                string nv = "女";
                ViewBag.nv = db.Student.Include("Teacher").Where(a => a.Sex == nv).Count();
                return View();
            }
        }
      
        [HttpPost]
        public JsonResult GetEchartsIndex()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                //循环遍历可以不用写，直接转换成Json数据格式，根据自己的足需求来选择1方法或者2方法
                //1、循环遍历添加数据
                var List = db.Student.Include("Class").GroupBy(s => new { s.ClassID }).Select(s => new { Name = s.Key.ClassID, ID = s.Count() }).ToList();
                //声明两个动态数据，存储循环出来的数据
                ArrayList xAxisData = new ArrayList();
                ArrayList yAxisData = new ArrayList();
                //循环list将数据循环存储在动态数组中
                foreach (var item in List)
                {
                    xAxisData.Add(item.Name);//通过三目元算符将Bool值“true”或“false”转换成男或女
                    yAxisData.Add(item.ID);
                }
                var result = new { Sex = xAxisData, Num = yAxisData };
                return Json(result, JsonRequestBehavior.AllowGet);

                //2、不循环添加数据直接数据Json化数据
                var all = db.Class.GroupBy(s => new { s.ClassName }).Select(s => new { Name = s.Key.ClassName, ID = s.Count() }).ToList();
                return Json(new { data = all }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult GetEchartsPie()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {


                //声明两个动态数据，存储循环出来的数据
                ArrayList xAxisData = new ArrayList();
                ArrayList yAxisData = new ArrayList();
                //调用BLL层代码
                //int id= int.Parse(Session["TeacherID"].ToString());.Include("Class").Where(a => a.TeacherID == id)

                var List = db.Course.GroupBy(s => new { s.CourseName }).Select(s => new { Name = s.Key.CourseName, ID = s.Count() }).ToList();

                //循环list将数据循环存储在动态数组中
                foreach (var item in List)
                {
                    xAxisData.Add(item.Name);//通过三目元算符将Bool值“true”或“false”转换成男或女
                    yAxisData.Add(item.ID);
                }
                //多个
                //result = new object[] { new { xname = xAxisData, num = yAxisData }, new { } };
                var result = new { Sex = xAxisData, Num = yAxisData };
                return Json(result);
            }
        }
      


        }



    }
