var browser = navigator.appName
var b_version = navigator.appVersion
var version = b_version.split(";");
var trim_Version = version[1].replace(/[ ]/g, "");
var ieFlag = browser == "Microsoft Internet Explorer" && (trim_Version == "MSIE6.0" || trim_Version == "MSIE7.0" || trim_Version == "MSIE8.0");
if ((!ieFlag) && window.top !== window) {
    window.stop ? window.stop() : document.execCommand("Stop");
    window.top.location.href = "/eduboss/login.jsp";
}