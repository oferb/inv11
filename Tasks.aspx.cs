using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Tasks : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int uid = 0;
        string result = "";
        bool isUser = Session["uid"]==null ? false : int.TryParse(Convert.ToString(Session["uid"]), out uid);
        //if (!isUser)Response.End();
        
        int tp=1;
        bool isValid = false;
        dynamic obj=null;
        if (Request["tp"] != null){
             isValid = int.TryParse(Request["tp"], out tp);
        }
        if (!isValid)
        {
            string postData = new System.IO.StreamReader(Request.InputStream).ReadToEnd();
            obj = postData == "" ? null : JObject.Parse(postData);
            tp = (obj == null) ? 0 : (int)obj["tp"];
        }
        switch (tp)
        {
            case -1: // special for admin tasks
                Utils.AdminTask();
                break;
            case 0: // ping
                // for session only
                Response.Write("ok");
                break;
            case 1: // login
                    var log_mail = Convert.ToString(obj["mail"]);
                    var log_password = Convert.ToString(obj["password"]);
                    tbUser log_user = Utils.Login(log_mail, log_password);

                    if (log_user == null)
                    {
                        Response.Write("error");
                    }
                    else
                    {
                        if (log_user.IsAdmin.HasValue && (bool)log_user.IsAdmin)
                            Session["IsAdmin"] = true;
                        else
                            Session["IsAdmin"] = false;
                        Session["user"] = log_user;
                        Session["uid"] = log_user.Id;
                        Response.Write("ok");
                    }
                    break;
            case 2: // restore password
                    var rest_mail = Convert.ToString(obj["mail"]);
                    var file = string.Format("{0}\\{1}", Server.MapPath("."), "Templates/restore.htm");
                    if (Utils.Restore(rest_mail, file))
                    {
                        Response.Write("ok");
                    }
                    else
                    {
                        Response.Write("error");
                    }
                    break;
            case 3: // registration
                    var reg_mail = Convert.ToString(obj["mail"]);
                    var reg_fname = Convert.ToString(obj["fname"]);
                    var reg_lname = Convert.ToString(obj["lname"]);
                    var reg_ident = Convert.ToString(obj["ident"]);
                    var reg_password = Convert.ToString(obj["password"]);

                    var regUser = Utils.Register(reg_mail, reg_fname, reg_lname, reg_ident, reg_password);
                    if (regUser==null)
                    {
                        Response.Write("error");
                    }
                    else
                    {
                        Session["user"] = regUser;
                        Session["uid"] = regUser.Id;
                        // create company
                        var resComp = Utils.UpdateCompany(obj, regUser.Id);
                        if (resComp == "error")
                        {
                            Response.Write("error");
                        }
                        else
                        {
                            var uData = Utils.GetFullUserData(regUser.Id);
                            Response.Write(uData);
                        }
                    }
                    break;
            case 4: // get user data
                    if (Session["user"] == null) Response.End();
                    var u = Session["user"] as tbUser;
                    var userData = Utils.GetFullUserData(u.Id);
                    Response.Write(userData);
                    //Response.Write(Newtonsoft.Json.JsonConvert.SerializeObject(u));
                    break;
            case 5: // update user data
                if (!isUser) Response.End();
                var updated = Utils.UpdateUserData(obj);
                if (updated == null)
                    {
                        Response.Write("error");
                    }
                    else
                    {
                        Session["user"] = updated;
                        Response.Write("ok");
                    }
                    break;
            case 6: // change password
                if (!isUser) Response.End();
                var newPas = Utils.ChangePassword(obj);
                if (newPas == null)
                    {
                        Response.Write("error");
                    }
                    else
                    {
                        Session["user"] = newPas;
                        Response.Write("ok");
                    }
                    break;
            case 71: // delete user company
                    if (!isUser) Response.End();
                    var id = Convert.ToInt32(Request["id"]);
                    result = Utils.DeleteCompany(id);
                    Response.Write(result);
                    break;
            case 72: // delete user customer
                    if (!isUser) Response.End();
                    var idC = Convert.ToInt32(Request["id"]);
                    result = Utils.DeleteCustomer(idC);
                    Response.Write(result);
                    break;
            case 73: // delete user products
                    if (!isUser) Response.End();
                    var idP = Convert.ToInt32(Request["id"]);
                    result = Utils.DeleteProduct(idP);
                    Response.Write(result);
                    break;
            case 74: // delete user document
                    if (!isUser) Response.End();
                    var idD = Convert.ToInt32(Request["id"]);
                    result = Utils.DeleteDocument(idD);
                    Response.Write(result);
                    break;
            case 8: // add/update user company
                    if (!isUser) Response.End();
                    var userId = (int)Convert.ToInt32(obj["data"]["uid"]);
                    if (uid != userId)
                    {
                        Session["uid"] = userId;
                        uid = userId;
                    }
                    result = Utils.UpdateCompany(obj["data"], uid);
                    Response.Write(result);
                    break;
            case 9: // add/update user customer
                    if (!isUser) Response.End();
                    result = Utils.UpdateCustomer(obj["data"], uid, obj["cid"]);
                    Response.Write(result);
                    break;
            case 101: // change customer active/not active param
                    if (!isUser) Response.End();
                    var idA = Convert.ToInt32(Request["id"]);
                    result = Utils.ActiveCustomer(idA);
                    Response.Write(result);
                    break;
            case 102: // change document active/not active param
                    if (!isUser) Response.End();
                    var idDoc = Convert.ToInt32(Request["id"]);
                    result = Utils.ActiveDocument(idDoc);
                    Response.Write(result);
                    break;
            case 11: // add/update product
                    if (!isUser) Response.End();
                    result = Utils.UpdateProduct(obj["data"], uid);
                    Response.Write(result);
                    break;
            case 12: // update doc config
                    if (!isUser) Response.End();
                    result = Utils.UpdateDocConfig(obj["data"]);
                    Response.Write(result);
                    break;
            case 201: // save document (draft)
                    if (!isUser) Response.End();
                    result = Utils.SaveDocDraft(obj, uid, true);
                    Response.Write(result);
                    break;
            case 202: // save, emit and lock document
                    if (!isUser) Response.End();
                    result = Utils.SaveDocAndLock(obj, uid);
                    Response.Write(result);
                    break;
            case 2020: // save, emit and lock document
                    uid = 1;
                    var newDoc = Utils.SaveDocAndLockM(obj, uid);
                    //var mail = Convert.ToString(obj["Mail"]);
                    //var r = Utils.SendDocToMailM(newID, mail);
                    //var mail2 =Convert.ToString(obj["Mail2"]);
                    //if (mail2.trim() != "")
                    //{
                    //    var r2 = Utils.SendDocToMailM(newID, mail2);
                    //}
                    //result = Utils.SendDocToMail(obj);
                    Response.Write(newDoc);
                    break;
            case 203: // get last added products
                    result = Utils.GetNewProducts(uid);
                    Response.Write(result);
                    break;
            case 204: // download documents in Zip
                    result = Utils.GetZip(obj);
                    Response.Write(result);
                    break;
            case 205: // send documents to mail
                    result = Utils.SendDocToMail(obj);
                    Response.Write(result);
                    break;
            case 206: // download documents  for hashavshevet
                    result = Utils.GetDocForH(obj);
                    Response.Write(result);
                    break;
            case 207: // download documents in unique format
                  //  var docID = (int)obj["id"];
                    result = Utils.GetUF(obj);
                    Response.Write(result);
                    break;
            case 400: // request creation of a BKM file
                    try
                    {
                        int companyID = Convert.ToInt32(Request["cid"]);
                        int fYear = Convert.ToInt32(Request["year"]);
                        int fMonthFrom = Convert.ToInt32(Request["from"]);
                        int fMonthTo = Convert.ToInt32(Request["to"]);
                        result = Utils.GenBKMFile(companyID ,fYear ,fMonthFrom , fMonthTo);
                        Response.Write(result);
                    }
                    catch (Exception ex)
                    {
                        result = "Parse error: " + ex.Message;
                    }
                    break;
            case 401: // request creation of a BKM file (in debug mode)
                    try
                    {
                        int companyID = Convert.ToInt32(Request["cid"]);
                        int fYear = Convert.ToInt32(Request["year"]);
                        int fMonthFrom = Convert.ToInt32(Request["from"]);
                        int fMonthTo = Convert.ToInt32(Request["to"]);
                        result = Utils.GenBKMFile(companyID, fYear, fMonthFrom, fMonthTo, true);
                        Response.Write(result);
                    }
                    catch (Exception ex)
                    {
                        result = "Parse error: " + ex.Message;
                    }
                    break;
            case 501: // create all users' document numeration
                    Utils.CreateDocNumerations();
                    break;
            case 502: // get document numeration after first save
                    var nu = Convert.ToInt32(Request["nu"]);
                    Response.Write(Utils.GetFirstDocNumeration(nu));
                    break;
            case 800: // get users list (for admin)
                var isAdmin = Session["IsAdmin"]==null ? false : bool.Parse(Session["IsAdmin"].ToString());
                if (isAdmin)
                    {
                        var users = Utils.GetUsersList();
                        Response.Write(users);
                    }
                    break;
            case 801: // reload selected user (for admin)
                    var isAdmin1 = Session["IsAdmin"]==null ? false : bool.Parse(Session["IsAdmin"].ToString());
                    if (isAdmin1)
                    {
                        if (obj["id"].Value == null)
                        {
                            Response.Write("error");
                            Response.End();
                        }
                        var log_id = Convert.ToInt32(obj["id"]);
                        tbUser log_user_for_admin = Utils.Login(log_id);

                        Session["user"] = log_user_for_admin;
                        Session["uid"] = log_user_for_admin.Id;
                        
                        Response.Write("ok");
                    }
                    break;
            default:
                Response.End();
                break;
        }
        
    }
}