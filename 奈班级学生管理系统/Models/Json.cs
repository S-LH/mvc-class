using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace 奈班级学生管理系统.Models
{
    public class JsonResults
    {
        /// <summary>
        /// 状态，0失败，1成功
        /// </summary>
        public int status { get; set; }
        /// <summary>
        /// 返回的数据
        /// </summary>
        public Object Data { get; set; }
        /// <summary>
        /// 返回的信息：提示信息或者报错 信息
        /// </summary>
        public string msg { get; set; }
        /// <summary>
        /// 返回数据条数
        /// </summary>
        public int Count { get; set; }
    }
}