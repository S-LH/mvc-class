using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using 奈班级学生管理系统.Models;
using System.Net;
using System.Net.Mail;
using System.Web.Helpers;
using System.Text;
using System.Dynamic;


namespace 奈班级学生管理系统.Controllers
{
    public class QQController : Controller
    {
        // GET: QQ
        /*public ActionResult Index()
        {
            return View();
        }*/
      
        //public ActionResult Index(string customerName, string customerRequest)
        //{

        //    SmtpClient smtp = new SmtpClient(); //实例化一个SmtpClient
        //    smtp.DeliveryMethod = SmtpDeliveryMethod.Network; //将smtp的出站方式设为 Network
        //    smtp.EnableSsl = true;//smtp服务器是否启用SSL加密
        //    smtp.Host = "smtp.qq.com"; //指定 smtp 服务器地址
        //    smtp.Port = 25;             //指定 smtp 服务器的端口，默认是25，如果采用默认端口，可省去
        //                                //如果你的SMTP服务器不需要身份认证，则使用下面的方式，不过，目前基本没有不需要认证的了
        //    smtp.UseDefaultCredentials = false;
        //    smtp.Credentials = new NetworkCredential("2760012953@qq.com", "oiovpcttrvefdcdh");//此处非邮箱密码，是授权码
        //                                                                                      //如果需要认证，则用下面的方式
        //    MailMessage mailMsg = new MailMessage("2760012953@qq.com", "2785137997@qq.com");//两个类，别混了应该引入System.Net.Mail下的


        //    //mailMsg.From = new MailAddress("1085205762@qq.com", "客服中心");//源邮件地址 
        //    //mailMsg.To.Add(new MailAddress("347456018@qq.com", "七戒"));//目的邮件地址。可以有多个收件人
        //    mailMsg.Subject = customerName;//发送邮件的标题 
        //    mailMsg.Body = customerRequest;//发送邮件的内容 
        //    mailMsg.IsBodyHtml = true;
        //    mailMsg.BodyEncoding = Encoding.UTF8;
        //    mailMsg.Priority = MailPriority.Low;
        //    if (mailMsg.Body != null)
        //    {
        //        smtp.Send(mailMsg);

        //    }
        //    //发送邮件，如果不返回异常， 则大功告成了。

        //    return View();
        //}
        public ActionResult Jubao(string customerName, string customerRequest)
        {
            SmtpClient smtp = new SmtpClient(); //实例化一个SmtpClient
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network; //将smtp的出站方式设为 Network
            smtp.EnableSsl = true;//smtp服务器是否启用SSL加密
            smtp.Host = "smtp.qq.com"; //指定 smtp 服务器地址
            smtp.Port = 25;             //指定 smtp 服务器的端口，默认是25，如果采用默认端口，可省去
                                        //如果你的SMTP服务器不需要身份认证，则使用下面的方式，不过，目前基本没有不需要认证的了
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("2760012953@qq.com", "oiovpcttrvefdcdh");//此处非邮箱密码，是授权码
                                                                                              //如果需要认证，则用下面的方式
            MailMessage mailMsg = new MailMessage("2760012953@qq.com", "2785137997@qq.com");//两个类，别混了应该引入System.Net.Mail下的


            //mailMsg.From = new MailAddress("1085205762@qq.com", "客服中心");//源邮件地址 
            //mailMsg.To.Add(new MailAddress("347456018@qq.com", "七戒"));//目的邮件地址。可以有多个收件人
            mailMsg.Subject = customerName;//发送邮件的标题 
            mailMsg.Body = customerRequest;//发送邮件的内容 
            mailMsg.IsBodyHtml = true;
            mailMsg.BodyEncoding = Encoding.UTF8;
            mailMsg.Priority = MailPriority.Low;
            if (mailMsg.Body != null)
            {
                smtp.Send(mailMsg);
                
            }
            //发送邮件，如果不返回异常， 则大功告成了。

            return View();
        }
    }
}