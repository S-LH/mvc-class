using System.Web;
using System.Web.Mvc;

namespace 奈班级学生管理系统
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
