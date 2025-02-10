using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using 奈班级学生管理系统.Models;

using 奈班级学生管理系统.logic;
using System.IO;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;
using System.Dynamic;

namespace 奈班级学生管理系统.Controllers
{
    public class TstudentController : Controller
    {
        NaiClassEntities1 db = new NaiClassEntities1();
        /// <summary>
        /// 学生详情
        /// </summary>
        /// <returns></returns>
        // GET: Tstudent
        public ActionResult Index()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                //获取登录老师的id
                int id = int.Parse(Session["TeacherID"].ToString());
                //根据老师ID查询老师所带的班级
                ViewBag.classlist = db.Class.Include("Teacher").Where(a => a.TeacherID == id).ToList();


                ViewBag.stulist = db.Student.ToList();

                //判断是否有老师的Id
                if (Request["id"] != null)
                {
                    //获取班级的ID
                    int classid = int.Parse(Request["id"]);
                    //根据班级ID查询班级
                    ViewBag.stulist = db.Student.Where(a => a.ClassID == classid).ToList();

                }

                return View();

            }

        }
        /// <summary>
        /// 侧边栏和模态框赋值
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        public string GetStudent(int id)
        {

            Student stu=this.db.Student.Where(u => u.StudentID == id).FirstOrDefault();
            person person = new person()
            {
                StudentID = stu.StudentID,
                Name = stu.StudentName,
                Num=stu.StudentNum,
                Tel=stu.Tell,
                Sex=stu.Sex,
                Drom=stu.Dorm,
                Home=stu.Hometown,
                Post=stu.Position
            
            };
            return JsonConvert.SerializeObject(person);
            
        }
        /// <summary>
        /// 定义一个类（需要传值的字段）
        /// </summary>
        public class person {
            public string Name { get; set; }
            public string Num { get; set; }
            public string Tel { get; set; }
            public string Sex { get; set; }
            public string Drom { get; set; }
            public string Home{ get; set; }
            public string Post { get; set; }
            public int StudentID { get; set; }
        }
        /// <summary>
        /// 修改学生信息
        /// </summary>
        /// <param name="nstu"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult EditStu(Student nstu)
        {
            var oldstu = db.Student.Find(nstu.StudentID);
            oldstu.StudentName = nstu.StudentName;
            oldstu.StudentNum = nstu.StudentNum;
            oldstu.Tell = nstu.Tell;
            oldstu.Sex = nstu.Sex;
            oldstu.Dorm = nstu.Dorm;
            oldstu.Hometown = nstu.Hometown;
            db.SaveChanges();
            return RedirectToAction("Stugl");

        }
        /// <summary>
        /// 学生管理
        /// </summary>
        /// <returns></returns>
        public ActionResult Stugl()
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                //获取登录老师的id
                int id = int.Parse(Session["TeacherID"].ToString());
                //根据老师ID查询老师所带的班级
                ViewBag.classlist = db.Class.Include("Teacher").Where(a => a.TeacherID == id).ToList();


                ViewBag.stulist = db.Student.ToList();

                //判断是否有老师的Id
                if (Request["id"] != null)
                {
                    //获取班级的ID
                    int classid = int.Parse(Request["id"]);
                    //根据班级ID查询班级
                    ViewBag.stulist = db.Student.Where(a => a.ClassID == classid).ToList();

                }
                return View();
            }
        }
        /// <summary>
        /// 根据学生id删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult del(int stuid)
        {

            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                Student stu = db.Student.Find(stuid);

                db.Student.Remove(stu);
                db.SaveChanges();
                return RedirectToAction("Stugl");

            }
        }
        /// <summary>
        /// 根据学生ID重置密码
        /// </summary>
        /// <param name="stuid"></param>
        /// <returns></returns>
        public ActionResult RestPwd(int stuid)
        {

            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                Student stu = db.Student.Find(stuid);

                stu.StudentPwd = "123456";
                db.SaveChanges();
                return RedirectToAction("Stugl");

            }
        }

        public ActionResult Sturz()
        {
            //获取登录老师的id
            int id = int.Parse(Session["TeacherID"].ToString());
            //根据老师ID查询老师所带的班级
            ViewBag.classlist = db.Class.Include("Teacher").Where(a => a.TeacherID == id).ToList();


            ViewBag.stulist = db.Student.ToList();

            //判断是否有老师的Id
            if (Request["id"] != null)
            {
                //获取班级的ID
                int classid = int.Parse(Request["id"]);
                //根据班级ID查询班级
                ViewBag.stulist = db.Student.Where(a => a.ClassID == classid).ToList();

            }
            return View();
        }

        /// <summary>
        /// excel导出
        /// </summary>
        /// <returns></returns>
        public ActionResult ExportExcel()

        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
                
                var listStudent = db.Student.ToList();


                List<Student> listExaminee = listStudent.ToList();//将查询出来的数据转化为对象列表的格式

                NPOI.HSSF.UserModel.HSSFWorkbook excelBook = new NPOI.HSSF.UserModel.HSSFWorkbook();//创建工作簿Excel

                NPOI.SS.UserModel.ISheet sheet1 = excelBook.CreateSheet("学生详细信息");//为工作簿创建工作表并命名

                //编写工作表 (1)表头 (2)数据：listStudent

                NPOI.SS.UserModel.IRow row1 = sheet1.CreateRow(0);//创建第一行

                row1.CreateCell(0).SetCellValue("学生姓名"); //创建其他列并赋值（ 根据具体数据写代码...）
                row1.CreateCell(1).SetCellValue("学生电话");
                row1.CreateCell(2).SetCellValue("学生性别");
                row1.CreateCell(3).SetCellValue("学号");
                row1.CreateCell(4).SetCellValue("密码");
                row1.CreateCell(5).SetCellValue("民族");
                row1.CreateCell(6).SetCellValue("政治面貌"); //创建其他列并赋值（ 根据具体数据写代码...）
                //创建其他列并赋值（ 根据具体数据写代码...）
                row1.CreateCell(7).SetCellValue("职务");
                row1.CreateCell(8).SetCellValue("专业");
                row1.CreateCell(9).SetCellValue("招生类型");
                row1.CreateCell(10).SetCellValue("宿舍"); //创建其他列并赋值（ 根据具体数据写代码...）
                row1.CreateCell(11).SetCellValue("家乡");
                row1.CreateCell(12).SetCellValue("班级");
                row1.CreateCell(13).SetCellValue("辅导员");

                for (int i = 0; i < listStudent.Count(); i++)

                {

                    //创建行（ 根据具体数据写代码...）

                    NPOI.SS.UserModel.IRow rowTemp = sheet1.CreateRow(i + 1);

                    rowTemp.CreateCell(0).SetCellValue(listExaminee[i].StudentName);//要导出的字段
                    rowTemp.CreateCell(1).SetCellValue(listExaminee[i].Tell);//要导出的字段
                    rowTemp.CreateCell(2).SetCellValue(listExaminee[i].Sex);//要导出的字段
                    rowTemp.CreateCell(3).SetCellValue(listExaminee[i].StudentNum);//要导出的字段
                    rowTemp.CreateCell(4).SetCellValue(listExaminee[i].StudentPwd);//要导出的字段
                    rowTemp.CreateCell(5).SetCellValue(listExaminee[i].Nation);//要导出的字段
                    rowTemp.CreateCell(6).SetCellValue(listExaminee[i].PoliticsStatus);//要导出的字段
                    rowTemp.CreateCell(7).SetCellValue(listExaminee[i].Position);//要导出的字段
                    rowTemp.CreateCell(8).SetCellValue(listExaminee[i].Major);//要导出的字段
                    rowTemp.CreateCell(9).SetCellValue(listExaminee[i].RecruitType);//要导出的字段
                    rowTemp.CreateCell(10).SetCellValue(listExaminee[i].Dorm);//要导出的字段
                    rowTemp.CreateCell(11).SetCellValue(listExaminee[i].Hometown);//要导出的字段

                    rowTemp.CreateCell(12).SetCellValue((double)listExaminee[i].ClassID);//要导出的字段
                    rowTemp.CreateCell(13).SetCellValue((double)listExaminee[i].TeacherID);//要导出的字段



                }

                var fileName = "学生详细信息" + DateTime.Now.ToString("yyyy-MM-dd-HH-mm") + ".xls";//文件名

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

                    dbdata.Columns.Add("StudentName");
                    dbdata.Columns.Add("Tell");
                    dbdata.Columns.Add("Sex");
                    dbdata.Columns.Add("StudentNum");
                    dbdata.Columns.Add("StudentPwd");
                    dbdata.Columns.Add("Nation");
                    dbdata.Columns.Add("PoliticsStatus");
                    dbdata.Columns.Add("Position");
                    dbdata.Columns.Add("Major");
                    dbdata.Columns.Add("RecruitType");
                    dbdata.Columns.Add("Dorm");
                    dbdata.Columns.Add("Hometown");
                    dbdata.Columns.Add("ClassID");
                    dbdata.Columns.Add("TeacherID");
                    for (int i = 0; i < excelTable.Rows.Count; i++)
                    {
                        DataRow dr = excelTable.Rows[i];
                        DataRow dr_ = dbdata.NewRow();
                        dr_["StudentName"] = dr["学生姓名"];
                        dr_["Tell"] = dr["学生电话"];
                        dr_["Sex"] = dr["学生性别"];
                        dr_["StudentNum"] = dr["学号"];
                        dr_["StudentPwd"] = dr["密码"];
                        dr_["Nation"] = dr["民族"];
                        dr_["PoliticsStatus"] = dr["政治面貌"];
                        dr_["Position"] = dr["职务"];
                        dr_["Major"] = dr["专业"];
                        dr_["RecruitType"] = dr["招生类型"];
                        dr_["Dorm"] = dr["宿舍"];
                        dr_["Hometown"] = dr["家乡"];
                        dr_["ClassID"] = dr["班级"];
                        dr_["TeacherID"] = dr["辅导员"];
                        dbdata.Rows.Add(dr_);
                    }
                    RemoveEmpty(dbdata);

                    string constr = System.Configuration.ConfigurationManager.AppSettings["hh"];

                    SqlBulkCopyByDatatable(constr, "Student", dbdata);

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
        /// <summary>
        /// 班委任职
        /// </summary>
        /// <param name="post"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult EditPost(Student npost)
        {
            var oldpost = db.Student.Find(npost.StudentID);
            oldpost.Position = npost.Position;
            db.SaveChanges();
            return RedirectToAction("Sturz");
        }
        /// <summary>
        /// 发起缴费
        /// </summary>
        /// <returns></returns>
        public ActionResult Money()
        {
            //获取登录老师的id
            int id = int.Parse(Session["TeacherID"].ToString());
        
            //根据老师ID查询老师所带的班级
            ViewBag.stulist = db.Student.Include("Class").Where(a=> a.Position == "生活委员"&&a.TeacherID==id).ToList();

            return View();

        }
        [HttpPost]
        public ActionResult Money(string PayStely,int StudentID,string PayMoney)
        { //获取登录老师的id
            int id = int.Parse(Session["TeacherID"].ToString());
             
             
            PayTable pay = new PayTable()
            {
                PayStely=PayStely,
                StudentID=StudentID,
                PayMoney= PayMoney,
                Paystate=0,
                TeacherID=id,
                Time=DateTime.Now.ToString("f")
                
            };
            db.PayTable.Add(pay);
            db.SaveChanges();
            return RedirectToAction("Money");

        }
        /// <summary>
        /// 查看发起缴费记录
        /// </summary>
        /// <returns></returns>
        public ActionResult MoneyJL()
        {
            //获取登录老师的id
            int id = int.Parse(Session["TeacherID"].ToString());
            //ViewBag.payclass= db.PayTable.Include("Student").Where(a=>a.TeacherID==id).ToList();
            var payclass= (from a in db.PayTable
                           join c in db.Student on a.StudentID equals c.StudentID
                           join b in db.Class on c.ClassID equals b.ClassID
                           select new { stely = a.PayStely, state = a.Paystate, money = a.PayMoney,payid=a.PayID, stuname = c.StudentName, stuid = c.StudentID, time = a.Time ,classname=b.ClassName,teaid=b.TeacherID}).Where(a => a.teaid==id).ToList();
            List<dynamic> pclasslist = new List<dynamic>();
            foreach (var data in payclass.ToList())
            {
                dynamic dyObject = new ExpandoObject();
                dyObject.stely = data.stely;

                dyObject.state = data.state == 0 ? "未缴费" : "已缴费";
                dyObject.money = double.Parse(data.money.ToString()).ToString("C");
                dyObject.stuname = data.stuname;
                dyObject.stuid = data.stuid;
                dyObject.time = data.time;
                dyObject.classname = data.classname;
                dyObject.PayID = data.payid;
                pclasslist.Add(dyObject);
            }
            ViewBag.payclasslist = pclasslist;
            return View();
        }
        /// <summary>
        /// 删除发起的缴费
        /// </summary>
        /// <returns></returns>
        public ActionResult DelPay(int id)
        {
            var Paylist= db.PayTable.Find(id);
            db.PayTable.Remove(Paylist);
            db.SaveChanges();
            return RedirectToAction("MoneyJL");

        }
        public ActionResult DetailPay(int id)
        {
            using (NaiClassEntities1 db = new NaiClassEntities1())
            {
               

                var list = (from a in db.PayTable
                            join c in db.Student on a.StudentID equals c.StudentID
                            join b in db.Class on c.ClassID equals b.ClassID
                            select new { stely = a.PayStely,payid=a.PayID, state = a.Paystate, money = a.PayMoney, stuname = c.StudentName, stuid = c.StudentID, time = a.Time, classname=b.ClassName }).Where(a => a.payid == id).ToList();

                List<dynamic> Paylist = new List<dynamic>();
                foreach (var data in list.ToList())
                {
                    dynamic dyObject = new ExpandoObject();
                    dyObject.stely = data.stely;
                    dyObject.state = data.state == 0 ? "未缴费" : "已缴费";
                    //dyObject.money = double.Parse(data.money.ToString()).ToString("C");
                    dyObject.state = data.money;
                    dyObject.stuname = data.stuname;
                    dyObject.stuid = data.stuid;
                    dyObject.time = data.time;
                    dyObject.PayID = data.payid;
                    dyObject.classname = data.classname;

                    Paylist.Add(dyObject);
                }
                ViewBag.PayList = Paylist;

                return View();

            }
        }

    }
}