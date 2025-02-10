using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace 奈班级学生管理系统.Controllers
{
    public class ChatController : Controller
    {
        // GET: Chat
        public ActionResult Chat()
        {
            ViewBag.time = DateTime.Now;
            ViewBag.name = Session["TeacherName"];
          
            return View();
        }
        public ActionResult ChatStu()
        {
            ViewBag.time = DateTime.Now;
            ViewBag.name = Session["StuName"];
          
            return View();
        }
        
   
        
    }
}