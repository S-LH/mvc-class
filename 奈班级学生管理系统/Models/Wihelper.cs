using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace 奈班级学生管理系统.Models
{
    public class Wihelper
    {
        public static string DelLastComma(string str)
        {

            if (!string.IsNullOrEmpty(str))
            {
                return str.Substring(0, str.LastIndexOf(","));
            }
            else
            {
                return str;
            }
        }
    }
}