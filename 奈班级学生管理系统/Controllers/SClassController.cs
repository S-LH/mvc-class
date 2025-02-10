using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;
using System.Data.SqlClient;

using 奈班级学生管理系统.Models;

namespace 奈班级学生管理系统.Controllers
{
    public class SClassController : Controller
    {
        // GET: SClass
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult classList()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                int id = int.Parse(Session["ClassID"].ToString());
                ViewBag.classList = db.Student.Include("Class").Where(c => c.ClassID == id).ToList();
            }
            return View();
        }
        [HttpPost]
        public ActionResult classList(string StudentName)
        {
            int id = int.Parse(Session["ClassID"].ToString());
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                if (StudentName != "")
                {
                    //模糊查询：Contains等价于数据库 like '%key%'指定的字符串对象是否出现在字符串中
                    ViewBag.classList = db.Student.Include("Class").Where(c => c.ClassID == id && c.StudentName.Contains(StudentName)).ToList();

                }
                else
                {
                    ViewBag.classList = db.Student.Include("Class").Where(c => c.ClassID == id).ToList();
                }
                return PartialView("class");
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
                int id = int.Parse(Session["ClassID"].ToString());
                var listStudent = db.Student.Include("Class").Where(c => c.ClassID == id).ToList();
                List<奈班级学生管理系统.Models.Student> listExaminee = listStudent.ToList();//将查询出来的数据转化为对象列表的格式

                NPOI.HSSF.UserModel.HSSFWorkbook excelBook = new NPOI.HSSF.UserModel.HSSFWorkbook();//创建工作簿Excel

                NPOI.SS.UserModel.ISheet sheet1 = excelBook.CreateSheet("班级通讯录");//为工作簿创建工作表并命名

                //编写工作表 (1)表头 (2)数据：listStudent

                NPOI.SS.UserModel.IRow row1 = sheet1.CreateRow(0);//创建第一行

                row1.CreateCell(0).SetCellValue("姓名"); //创建其他列并赋值（ 根据具体数据写代码...）
                row1.CreateCell(1).SetCellValue("性别");
                row1.CreateCell(2).SetCellValue("学号");
                row1.CreateCell(3).SetCellValue("手机号");
                row1.CreateCell(4).SetCellValue("地址");
                row1.CreateCell(5).SetCellValue("宿舍号");
                for (int i = 0; i < listStudent.Count(); i++)

                {

                    //创建行（ 根据具体数据写代码...）

                    NPOI.SS.UserModel.IRow rowTemp = sheet1.CreateRow(i + 1);

                    rowTemp.CreateCell(0).SetCellValue(listExaminee[i].StudentName);//要导出的字段
                    rowTemp.CreateCell(1).SetCellValue(listExaminee[i].Sex);//要导出的字段
                    rowTemp.CreateCell(2).SetCellValue(listExaminee[i].StudentNum);//要导出的字段
                    rowTemp.CreateCell(3).SetCellValue(listExaminee[i].Tell);
                    rowTemp.CreateCell(4).SetCellValue(listExaminee[i].Hometown);
                    rowTemp.CreateCell(5).SetCellValue(listExaminee[i].Dorm);

                }

                var fileName = "班级通讯录" + DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss-ffff") + ".xls";//文件名

                //将Excel表格转化为流，输出

                MemoryStream bookStream = new MemoryStream();//创建文件流

                excelBook.Write(bookStream); //文件写入流（向流中写入字节序列）

                bookStream.Seek(0, SeekOrigin.Begin);//输出之前调用Seek，把0位置指定为开始位置

                return File(bookStream, "application/vnd.ms-excel", fileName);//最后以文件形式返回

            }

        }
    }
}