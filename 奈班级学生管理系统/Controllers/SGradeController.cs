using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class SGradeController : Controller
    {
        // GET: SGrade
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 成绩分析
        /// </summary>
        /// <returns></returns>
        public ActionResult Analyze()
        {

            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int stuid = int.Parse(Session["StuID"].ToString());
                int claid = int.Parse(Session["ClassID"].ToString());
                //年级排名
                string njpm = $" select dense_rank() over(order by s.StudentID) as pm from  Student s join Grade g on s.StudentID=g.StudentID join Course c on c.CourseID=g.CourseID where s.StudentID={stuid}  group by s.StudentID ";
                var rpm = db.Database.SqlQuery<Int64>(njpm).ToList();
                ViewBag.njpm = rpm;
                //班级 排名
                string  bpm = $"select dense_rank() over(order by s.StudentID) as pm from  Student s join Grade g on s.StudentID=g.StudentID join Course c on c.CourseID=g.CourseID where s.StudentID={stuid} and s.ClassID={claid}  group by s.StudentID ";
                var npm = db.Database.SqlQuery<Int64>(bpm).ToList();
                ViewBag.bjpm = npm;
                //合格科目
                ViewBag.hg = db.Grade.Where(s => s.Score > 60 && s.StudentID == stuid).Count();
                //未合格科目
                ViewBag.bhg = db.Grade.Where(s => s.Score < 60 && s.StudentID == stuid).Count();
            }

            return View();

        }
        /// <summary>
        /// 柱状图
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public JsonResult GetEchartsIndex()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int stuid = int.Parse(Session["StuID"].ToString());
                //循环遍历可以不用写，直接转换成Json数据格式，根据自己的足需求来选择1方法或者2方法
                //1、循环遍历添加数据
                var List = db.Grade.Include("Course").GroupBy(s => new { s.Course.CourseName, s.Score, s.StudentID }).Select(s => new { Name = s.Key.CourseName, ID = s.Key.Score, id = s.Key.StudentID }).Where(a => a.id == stuid).ToList();
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
                var all = db.Grade.Include("Course").GroupBy(s => new { s.Course.CourseName, s.Score, s.StudentID }).Select(s => new { Name = s.Key.CourseName, ID = s.Key.Score, id = s.Key.StudentID }).Where(a => a.id == stuid).ToList();
                return Json(new { data = all }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// 饼状图
        /// </summary>
        /// <returns></returns>
        public JsonResult GetEchartsPie()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int stuid = int.Parse(Session["StuID"].ToString());
                //循环遍历可以不用写，直接转换成Json数据格式，根据自己的足需求来选择1方法或者2方法
                //1、循环遍历添加数据
                var List = db.Grade.Include("Course").GroupBy(s => new { s.Course.CourseName, s.Score, s.StudentID }).Select(s => new { Name = s.Key.CourseName, ID = s.Key.Score, id = s.Key.StudentID }).Where(a => a.id == stuid).ToList();
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
                var all = db.Grade.Include("Course").GroupBy(s => new { s.Course.CourseName, s.Score, s.StudentID }).Select(s => new { Name = s.Key.CourseName, ID = s.Key.Score, id = s.Key.StudentID }).Where(a => a.id == stuid).ToList();
                return Json(new { data = all }, JsonRequestBehavior.AllowGet);
            }
        }
        /// <summary>
        /// 成绩中心
        /// </summary>
        /// <returns></returns>
        public ActionResult GradeList()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int stuid = int.Parse(Session["StuID"].ToString());
                ViewBag.Rtea = (from a in db.Course select a.Rteacher).Distinct().ToList();
                ViewBag.GradeList = db.Grade.Include("Course").Where(a => a.StudentID == stuid).ToList();
            }

            return View();
        }
        [HttpPost]
        public ActionResult GradeList(string CourseName, string Rteacher)
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int stuid = int.Parse(Session["StuID"].ToString());
                //判断文本框是否有值
                if (CourseName != "")
                {
                    //模糊查询：Contains等价于数据库 like '%key%'指定的字符串对象是否出现在字符串中
                    ViewBag.GradeList = db.Grade.Include("Course").Where(a => a.StudentID == stuid && a.Course.CourseName.Contains(CourseName)).ToList();

                }
                else if (Rteacher != "请选择老师")
                {
                    ViewBag.GradeList = db.Grade.Include("Course").Where(a => a.StudentID == stuid && a.Course.Rteacher == Rteacher).ToList();
                }
                else
                {
                    ViewBag.GradeList = db.Grade.Include("Course").Where(a => a.StudentID == stuid).ToList();
                }
                return PartialView("Grade");
            }

        }
        /// <summary>
        /// excel导出
        /// </summary>
        /// <returns></returns>
        public ActionResult ExportExcel()

        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int stuid = int.Parse(Session["StuID"].ToString());
                var listGrade = db.Grade.Include("Course").Where(a => a.StudentID == stuid).ToList();
                List<奈班级学生管理系统.Models.Grade> listExaminee = listGrade.ToList();//将查询出来的数据转化为对象列表的格式

                NPOI.HSSF.UserModel.HSSFWorkbook excelBook = new NPOI.HSSF.UserModel.HSSFWorkbook();//创建工作簿Excel

                NPOI.SS.UserModel.ISheet sheet1 = excelBook.CreateSheet("成绩");//为工作簿创建工作表并命名

                //编写工作表 (1)表头 (2)数据：listStudent

                NPOI.SS.UserModel.IRow row1 = sheet1.CreateRow(0);//创建第一行

                row1.CreateCell(0).SetCellValue("课程名称"); //创建其他列并赋值（ 根据具体数据写代码...）
                row1.CreateCell(1).SetCellValue("学分");
                row1.CreateCell(2).SetCellValue("任课老师");
                row1.CreateCell(3).SetCellValue("分数");

                for (int i = 0; i < listGrade.Count(); i++)

                {

                    //创建行（ 根据具体数据写代码...）

                    NPOI.SS.UserModel.IRow rowTemp = sheet1.CreateRow(i + 1);

                    rowTemp.CreateCell(0).SetCellValue(listExaminee[i].Course.CourseName);//要导出的字段
                    rowTemp.CreateCell(1).SetCellValue(listExaminee[i].Course.Credit);//要导出的字段
                    rowTemp.CreateCell(2).SetCellValue(listExaminee[i].Course.Rteacher);//要导出的字段
                    rowTemp.CreateCell(3).SetCellValue(listExaminee[i].Score.ToString());

                }

                var fileName = "成绩" + DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss-ffff") + ".xls";//文件名

                //将Excel表格转化为流，输出

                MemoryStream bookStream = new MemoryStream();//创建文件流

                excelBook.Write(bookStream); //文件写入流（向流中写入字节序列）

                bookStream.Seek(0, SeekOrigin.Begin);//输出之前调用Seek，把0位置指定为开始位置

                return File(bookStream, "application/vnd.ms-excel", fileName);//最后以文件形式返回

            }

        }
    }
}