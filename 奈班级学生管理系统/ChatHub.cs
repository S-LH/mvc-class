using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace 奈班级学生管理系统
{
    public class ChatHub : Hub
    {
        //当前用户数量
        

    public void Send(string name, string message)
        {
            // Call the addNewMessageToPage method to update clients.
            //在客户端上调用函数(，例如 addNewMessageToPage 函数) 来更新客户端。
            Clients.All.addNewMessageToPage(name, message);
            
        }

    }
}