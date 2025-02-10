using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.IO;
using 奈班级学生管理系统.logic;
using 奈班级学生管理系统.Models;
using PagedList;
namespace 奈班级学生管理系统.Controllers
{
    public class CoursesController : Controller
    {
        private NaiClassEntities1 db = new NaiClassEntities1();

        // GET: Courses

       /* public ActionResult Index(int Page=1)
        {
            List<Course> list = db.Course.ToList();

            ViewBag.mypagelist = list.ToPagedList(Page, 5);

            return View(list);
        }*/
       public ActionResult hh( )
        {

            return View(db.Course.ToList());
        }

        /*public ActionResult edit(int id)
        {
            var roles = db.Course.Where(p => p.CourseID == id).Select(p => new { p.CourseName, p.Credit ,p.CreditTime,p.Rate,p.Rteacher}).FirstOrDefault();
            return Json(roles, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult edit(Course role)
        {
            var code = 0;
            var message = "修改失败";
            db.Entry(role).State = System.Data.Entity.EntityState.Modified;
            if (db.SaveChanges() > 0)
            {
                code = 1;
                message = "修改成功";
            }
            var res = new
            {
                code = code,
                message = message
            };
            return Json(res, JsonRequestBehavior.AllowGet);
        }
*/

        public ActionResult Login()
        {
            List<Course> list = db.Course.ToList();

           

            return View(list);
        }
        // GET: Courses/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Course course = db.Course.Find(id);
            if (course == null)
            {
                return HttpNotFound();
            }
            return View(course);
        }

        // GET: Courses/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Courses/Create
        // 为了防止“过多发布”攻击，请启用要绑定到的特定属性。有关
        // 详细信息，请参阅 https://go.microsoft.com/fwlink/?LinkId=317598。
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Create(Course course)
        {
           
                db.Course.Add(course);
                db.SaveChanges();
                return RedirectToAction("Login");
            

           
        }

        // GET: Courses/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Course course = db.Course.Find(id);
            if (course == null)
            {
                return HttpNotFound();
            }
            return View(course);
        }

        // POST: Courses/Edit/5
        // 为了防止“过多发布”攻击，请启用要绑定到的特定属性。有关
        // 详细信息，请参阅 https://go.microsoft.com/fwlink/?LinkId=317598。
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "CourseID,CourseName,Credit,CreditTime,Rate,Rteacher")] Course course)
        {
            if (ModelState.IsValid)
            {
                db.Entry(course).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(course);
        }


        // GET: Courses/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Course course = db.Course.Find(id);
            if (course == null)
            {
                return HttpNotFound();
            }
            return View(course);
        }
        public ActionResult Del(int id)
        {
            
            using (NaiClassEntities1 db=new NaiClassEntities1())
            {
                Course course = new Course();
                db.Course.Find(id);
                db.Course.Remove(course);
                db.SaveChanges();
            }
            return RedirectToAction("Login");
        }
        // POST: Courses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Course course = db.Course.Find(id);
            db.Course.Remove(course);
            db.SaveChanges();
            return RedirectToAction("Login");
        }
      
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
      

        /// <summary>
        /// excel导出
        /// </summary>
        /// <returns></returns>
        public ActionResult ExportExcel()

        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                var listStudent = db.Course.ToList();
                List<Course> listExaminee = listStudent.ToList();//将查询出来的数据转化为对象列表的格式

                NPOI.HSSF.UserModel.HSSFWorkbook excelBook = new NPOI.HSSF.UserModel.HSSFWorkbook();//创建工作簿Excel

                NPOI.SS.UserModel.ISheet sheet1 = excelBook.CreateSheet("教师课程信息");//为工作簿创建工作表并命名

                //编写工作表 (1)表头 (2)数据：listStudent

                NPOI.SS.UserModel.IRow row1 = sheet1.CreateRow(0);//创建第一行

                row1.CreateCell(0).SetCellValue("课程名称"); //创建其他列并赋值（ 根据具体数据写代码...）
                row1.CreateCell(1).SetCellValue("学分");
                row1.CreateCell(2).SetCellValue("学时");
                row1.CreateCell(3).SetCellValue("通过率");
                row1.CreateCell(4).SetCellValue("任课老师");

                for (int i = 0; i < listStudent.Count(); i++)

                {

                    //创建行（ 根据具体数据写代码...）

                    NPOI.SS.UserModel.IRow rowTemp = sheet1.CreateRow(i + 1);

                    rowTemp.CreateCell(0).SetCellValue(listExaminee[i].CourseName);//要导出的字段
                    rowTemp.CreateCell(1).SetCellValue(listExaminee[i].Credit);//要导出的字段
                    rowTemp.CreateCell(2).SetCellValue(listExaminee[i].CreditTime);//要导出的字段
                    rowTemp.CreateCell(3).SetCellValue(listExaminee[i].Rate);//要导出的字段
                    rowTemp.CreateCell(4).SetCellValue(listExaminee[i].Rteacher);//要导出的字段


                }

                var fileName = "教师课程信息" + DateTime.Now.ToString("yyyy-MM-dd-HH-mm") + ".xls";//文件名

                //将Excel表格转化为流，输出

                MemoryStream bookStream = new MemoryStream();//创建文件流

                excelBook.Write(bookStream); //文件写入流（向流中写入字节序列）

                bookStream.Seek(0, SeekOrigin.Begin);//输出之前调用Seek，把0位置指定为开始位置

                return File(bookStream, "application/vnd.ms-excel", fileName);//最后以文件形式返回

            }

        }
        /// <summary>
        /// 导入
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Import(HttpPostedFileBase file)
        {
            if (file != null)
            {
                if (file.ContentLength == 0)
                {
                    return View();
                }
                else
                {
                    var fileName = file.FileName;
                    var filePath = Server.MapPath(string.Format("~/{0}", "Files"));
                    string path = Path.Combine(filePath, fileName);
                    file.SaveAs(path);

                    DataTable excelTable = new DataTable();
                    excelTable = ImportExcel.GetExcelDataTable(path);

                    DataTable dbdata = new DataTable();
                 
                    dbdata.Columns.Add("CourseName");
                    dbdata.Columns.Add("Credit");
                    dbdata.Columns.Add("CreditTime");
                    dbdata.Columns.Add("Rate");
                    dbdata.Columns.Add("Rteacher");
                    for (int i = 0; i < excelTable.Rows.Count; i++)
                    {
                        DataRow dr = excelTable.Rows[i];
                        DataRow dr_ = dbdata.NewRow();
                     
                        dr_["CourseName"] = dr["课程名称"];
                        dr_["Credit"] = dr["学分"];
                        dr_["CreditTime"] = dr["学时"];
                        dr_["Rate"] = dr["通过率"];
                        dr_["Rteacher"] = dr["任课老师"];
                        dbdata.Rows.Add(dr_);
                    }
                    RemoveEmpty(dbdata);

                    string constr = System.Configuration.ConfigurationManager.AppSettings["hh"];

                    SqlBulkCopyByDatatable(constr, "Course", dbdata);

                }
            }
           
            return RedirectToAction("Index");
        }
        /// <summary>
        /// 大数据插入
        /// </summary>
        /// <param name="connectionString">目标库连接</param>
        /// <param name="TableName">目标表</param>
        /// <param name="dtSelect">来源数据</param>
        public static void SqlBulkCopyByDatatable(string connectionString, string TableName, DataTable dtSelect)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlBulkCopy sqlbulkcopy = new SqlBulkCopy(connectionString, SqlBulkCopyOptions.UseInternalTransaction))
                {
                    try
                    {
                        sqlbulkcopy.DestinationTableName = TableName;
                        sqlbulkcopy.BatchSize = 20000;
                        sqlbulkcopy.BulkCopyTimeout = 0;//不限时间
                        for (int i = 0; i < dtSelect.Columns.Count; i++)
                        {
                            sqlbulkcopy.ColumnMappings.Add(dtSelect.Columns[i].ColumnName, dtSelect.Columns[i].ColumnName);
                        }
                        sqlbulkcopy.WriteToServer(dtSelect);
                    }
                    catch (System.Exception ex)
                    {
                        throw ex;
                    }
                }
            }
        }
        protected void RemoveEmpty(DataTable dt)
        {
            List<DataRow> removelist = new List<DataRow>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                bool IsNull = true;
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if (!string.IsNullOrEmpty(dt.Rows[i][j].ToString().Trim()))
                    {
                        IsNull = false;
                    }
                }
                if (IsNull)
                {
                    removelist.Add(dt.Rows[i]);
                }
            }
            for (int i = 0; i < removelist.Count; i++)
            {
                dt.Rows.Remove(removelist[i]);
            }
        }
    }
}
