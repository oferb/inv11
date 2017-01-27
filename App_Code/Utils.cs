using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.Configuration;
using WebSupergoo.ABCpdf9;
using WebSupergoo.ABCpdf9.Objects;
using WebSupergoo.ABCpdf9.Atoms;
using WebSupergoo.ABCpdf9.Operations;
using System.Configuration;
using System.Diagnostics;
using System.Net; 

/// <summary>
/// Summary description for Utils
/// </summary>
public class Utils
{
    public static tbUser Login(string mail, string password)
    {
        using (var db = new DBInvoiceEntities())
        {
            return db.tbUsers.Where(i => i.Email == mail && i.Password == password && (!i.IsArchive.HasValue || !(bool)i.IsArchive)).FirstOrDefault();
        }

       
        
    }

    public static tbUser Login(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            return db.tbUsers.Where(i => i.Id == id && (!i.IsArchive.HasValue || !(bool)i.IsArchive)).FirstOrDefault();
        }

    }

    public static bool Restore(string mail, string file)
    {
        using (var db = new DBInvoiceEntities())
        {
            var u = db.tbUsers.Where(i => i.Email == mail).FirstOrDefault();
            if (u == null)
            {
                return false;
            }
            else
            {
                var ms = new MailSender();
                StreamReader sr = new StreamReader(file);
                string mailBody = sr.ReadToEnd();
                sr.Close();
                mailBody = mailBody.Replace("#user#", u.FName + " " + u.LName);
                mailBody = mailBody.Replace("#password#", u.Password);
                var isAdm = u.IsAdmin ?? false;
                var to = isAdm ? "alex@vir-tec.net" : u.Email;
                ms.Send(to, "שחזור  סיסמא", mailBody);
                return true;
            }
        }
    }

    public static tbUser Register(string reg_mail, string reg_fname, string reg_lname, string reg_ident, string reg_password)
    {
        using (var db = new DBInvoiceEntities())
        {
            var u = db.tbUsers.Where(i => i.Email == reg_mail).FirstOrDefault();
            if (u != null)
            {
                return null;
            }
            else
            {
                var user = new tbUser();
                user.Email = reg_mail;
                user.FName = reg_fname;
                user.LName = reg_lname;
                user.Identificator = reg_ident;
                user.Password = reg_password;
                user.RegDate = DateTime.Now;
                db.tbUsers.Add(user);
                db.SaveChanges();

                // cretae user documentNumbers records
                //Utils.AddUserDocNumbers();

                return user;
            }
        }
    }

    public static object UpdateUserData(dynamic obj)
    {
        using (var db = new DBInvoiceEntities())
        {
            string mail = Convert.ToString(obj["mail"]);
            string password = Convert.ToString(obj["password"]);
            var user = db.tbUsers.Where(i => i.Email == mail && i.Password == password).FirstOrDefault();
            if (user == null)
            {
                return null;
            }
            else
            {
                user.FName = Convert.ToString(obj["fname"]);
                user.LName = Convert.ToString(obj["lname"]);
                user.Identificator = Convert.ToString(obj["ident"]);
                db.SaveChanges();
                return user;
            }
        }
    }

    public static object ChangePassword(dynamic obj)
    {
        using (var db = new DBInvoiceEntities())
        {
            string mail = Convert.ToString(obj["mail"]);
            string password = Convert.ToString(obj["password"]);
            var user = db.tbUsers.Where(i => i.Email == mail && i.Password == password).FirstOrDefault();
            if (user == null)
            {
                return null;
            }
            else
            {
                user.Password = Convert.ToString(obj["newpassword"]);
                db.SaveChanges();
                return user;
            }
        }
    }

    public static string GetFullUserData(int uid)
    {
        string tempSqlConnectionStr = WebConfigurationManager.AppSettings["SQLServer"];
        DataSet dataset = new DataSet();

        using (var conn = new SqlConnection(tempSqlConnectionStr))
        {
            conn.Open();
            using (var cmd = new SqlCommand("[dbo].[spGetUserData]", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@uid", uid);

                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    //da.FillSchema(dataset, SchemaType.Source);
                    da.Fill(dataset);
                    conn.Close();
                    return Newtonsoft.Json.JsonConvert.SerializeObject(dataset, new IsoDateTimeConverter());
                }
            }
            
        }
    }

    public static string DeleteCompany(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            var comp = db.tbCompanies.Where(i => i.Id == id).FirstOrDefault();
            if (comp == null)
            {
                return "error";
            }
            else
            {
                comp.IsArchive = true;
                db.SaveChanges();
                return "ok";
            }
        }
    }

    public static object UpdateCompany(dynamic obj,int uid)
    {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                var id = (int)Convert.ToInt32(obj["Id"]);
                var c = id == 0 ? new tbCompany() : db.tbCompanies.Where(i => i.Id == id).FirstOrDefault();
                c.Account = Convert.ToString(obj["Account"]);
                c.Street = Convert.ToString(obj["Street"]);
                c.City = Convert.ToString(obj["City"]);
                c.Country = Convert.ToString(obj["Country"]);
                c.CardExp = Convert.ToString(obj["CardExp"]);
                c.CardNds = Convert.ToString(obj["CardNds"]);
                c.KupatCash = Convert.ToString(obj["KupatCash"]);
                c.KupatChecks = Convert.ToString(obj["KupatChecks"]);
                c.BankName = Convert.ToString(obj["BankName"]);
                c.Branch = Convert.ToString(obj["Branch"]);
                c.EAddress = Convert.ToString(obj["EAddress"]);
                c.EBankAddress = Convert.ToString(obj["EBankAddress"]);
                c.EBankName = Convert.ToString(obj["EBankName"]);
                c.EName = Convert.ToString(obj["EName"]);
                c.EPayName = Convert.ToString(obj["EPayName"]);
                c.ESubTitle = Convert.ToString(obj["ESubTitle"]);
                c.Email = Convert.ToString(obj["Email"]);
                c.Fax = Convert.ToString(obj["Fax"]);
                c.IBAN = Convert.ToString(obj["IBAN"]);
                c.Identificator = Convert.ToString(obj["Identificator"]);
                c.Index = Convert.ToString(obj["Index"]);
                c.IsArchive = false;
                c.Mobile = Convert.ToString(obj["Mobile"]);
                c.Name = Convert.ToString(obj["Name"]);
                c.PayName = Convert.ToString(obj["PayName"]);
                c.Phone = Convert.ToString(obj["Phone"]);
                c.SWIFT = Convert.ToString(obj["SWIFT"]);
                c.SubTitle = Convert.ToString(obj["SubTitle"]);
                c.InvName = Convert.ToString(obj["InvName"]);
                c.InvMail = Convert.ToString(obj["InvMail"]);
                c.CodeA1 = Convert.ToString(obj["CodeA1"]);
                c.CodeA2 = Convert.ToString(obj["CodeA2"]);
                if (id == 0)
                {
                    db.tbCompanies.Add(c);
                    db.SaveChanges();
                    var rec = new tbUserCompany();
                    rec.UserID = uid;
                    rec.CompanyID = c.Id;
                    rec.IsArchive = false;
                    db.tbUserCompanies.Add(rec);
                    // add company documents for numbering
                    CreateCompanyDocNumbers(c.Id);
                }
                db.SaveChanges();
                return c.Id.ToString();
            }
        }
        catch (Exception ex)
        {
            return "error";
        }
    }

    public static object UpdateCustomer(dynamic obj, int uid, dynamic cid)
    {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                var comp = (int)Convert.ToInt32(cid);
                var id = (int)Convert.ToInt32(obj["Id"]);
                var c = id == 0 ? new tbCustomer() : db.tbCustomers.Where(i => i.Id == id).FirstOrDefault();
                c.Account = Convert.ToString(obj["Account"]);
                c.AStreet = Convert.ToString(obj["AStreet"]);
                c.ACity = Convert.ToString(obj["ACity"]);
                c.ACountry = Convert.ToString(obj["ACountry"]);
                c.CardID = Convert.ToString(obj["CardID"]);
                c.Comments = Convert.ToString(obj["Comments"]);
                c.BankName = Convert.ToString(obj["BankName"]);
                c.Branch = Convert.ToString(obj["Branch"]);
                c.CName = Convert.ToString(obj["CName"]);
                c.PayName = Convert.ToString(obj["PayName"]);
                c.CPhone = Convert.ToString(obj["CPhone"]);
                c.CMobile = Convert.ToString(obj["CMobile"]);
                c.CEmail = Convert.ToString(obj["CEmail"]);
                c.Identificator = Convert.ToString(obj["Identificator"]);
                c.AIndex = Convert.ToString(obj["AIndex"]);
                c.IsArchive = false;
                c.IsActive = Convert.ToBoolean(obj["IsActive"]);
                c.Name = Convert.ToString(obj["Name"]);
                if (id == 0)
                {
                    db.tbCustomers.Add(c);
                    db.SaveChanges();
                    var rec = new tbUserCustomer();
                    rec.UserID = uid;
                    rec.CustomerID = c.Id;
                    rec.IsArchive = false;
                    db.tbUserCustomers.Add(rec);
                    // add to cross
                    var rel = new tbCompanyCustomer();
                    rel.CompanyID = comp;
                    rel.CustomerID = c.Id;
                    db.tbCompanyCustomers.Add(rel);
                }
                db.SaveChanges();
                return c.Id.ToString();
            }
        }
        catch (Exception ex)
        {
            return "error";
        }
    }

    public static string DeleteCustomer(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            var comp = db.tbCustomers.Where(i => i.Id == id).FirstOrDefault();
            if (comp == null)
            {
                return "error";
            }
            else
            {
                comp.IsArchive = true;
                db.SaveChanges();
                return "ok";
            }
        }
    }

    public static string ActiveCustomer(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            var comp = db.tbCustomers.Where(i => i.Id == id).FirstOrDefault();
            if (comp == null)
            {
                return "error";
            }
            else
            {
                comp.IsActive = !comp.IsActive;
                db.SaveChanges();
                return "ok";
            }
        }
    }

    //
    public static object UpdateProduct(dynamic obj, int uid)
    {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                var id = (int)Convert.ToInt32(obj["Id"]);
                var c = id == 0 ? new tbProduct() : db.tbProducts.Where(i => i.Id == id).FirstOrDefault();
                c.CompanyID = Convert.ToInt32(obj["CompanyID"]);
                c.Makat = Convert.ToString(obj["Makat"]);
                c.Name = Convert.ToString(obj["Name"]);
                c.Price = Convert.ToDecimal(obj["Price"]);
                c.Description = Convert.ToString(obj["Description"]);
                c.UserID = uid;
                c.IsArchive = false;
                if (id == 0)
                {
                    db.tbProducts.Add(c);
                }
                db.SaveChanges();
                return c.Id.ToString();
            }
        }
        catch (Exception ex)
        {
            return "error";
        }
    }

    public static string DeleteProduct(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            var item = db.tbProducts.Where(i => i.Id == id).FirstOrDefault();
            if (item == null)
            {
                return "error";
            }
            else
            {
                item.IsArchive = true;
                db.SaveChanges();
                return "ok";
            }
        }
    }

     public static object UpdateDocConfig(dynamic obj)
     {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                int comp = 0;
                foreach (var item in obj)
                {
                    var id = (int)Convert.ToInt32(item["Id"]);
                    if(comp==0)comp = (int)Convert.ToInt32(item["CompanyID"]);
                    var start = (int)Convert.ToInt32(item["Start"]);
                    var c = db.tbDocumentNumbers.Where(i => i.Id == id).FirstOrDefault();
                    c.Start = start;
                }
                var company = db.tbCompanies.Where(i => i.Id == comp).FirstOrDefault();
                company.IsLocked = true;
                db.SaveChanges();
                return "ok"; 
            }
        }
        catch (Exception ex)
        {
            return "error";
        }
    }

    public static void CreateCompanyDocNumbers(int cid)
    {
        using (var db = new DBInvoiceEntities())
        {
            var docNumbers = db.tbDocumentNumbers.Where(i => i.CompanyID == cid).FirstOrDefault();
            if (docNumbers == null)
            {
                var docs = db.tbDocumentTypes.ToList();
                foreach (var doc in docs)
                {
                    var d = new tbDocumentNumber();
                    d.CompanyID = cid;
                    d.DocID = doc.Id;
                    d.Start = doc.Id * 100000 + 1000000;
                    d.Last = 0;
                    db.tbDocumentNumbers.Add(d);
                }
                db.SaveChanges();
            }
        }
    }
    public static void CreateDocNumerations()
    {
        using (var db = new DBInvoiceEntities())
        {
            var comps = db.tbCompanies.ToList();
            foreach (var c in comps)
            {
                CreateCompanyDocNumbers(c.Id);
            }
        }
    }

    public static string ActiveDocument(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            var doc = db.tbDocumentNumbers.Where(i => i.Id == id).FirstOrDefault();
            if (doc == null)
            {
                return "error";
            }
            else
            {
                doc.IsActive = !doc.IsActive;
                db.SaveChanges();
                return "ok";
            }
        }
    }

    public static string SaveDocDraft(dynamic data,int uid, bool isDraft)
    {
        var obj = data["data"];
        var calc = data["calc"];
        var items = data["items"];
        var payments = data["payments"];

        try
        {
            tbUserDocument rec;
            // add to user documents
            using (var db = new DBInvoiceEntities())
            {
                int id = Convert.ToInt32(obj["Id"]);
                int custId = Convert.ToInt32(obj["Customer"]["Id"]);
                tbCustomer customer = db.tbCustomers.FirstOrDefault(x => x.Id == custId);
                if(id==0){
                    rec = new tbUserDocument();
                }else{
                    rec = db.tbUserDocuments.Where(i => i.Id == id).FirstOrDefault();
                }
                rec.DocumentType = Convert.ToInt32(obj["Type"]);
                //bool isCanceled = rec.DocumentType >= 9 && rec.DocumentType != 11;
                bool isCanceled = rec.DocumentType >= 9 && rec.DocumentType != 11 && rec.DocumentType != 12; //changed by ortal&nofar

                rec.Comments = Convert.ToString(obj["Comments"]);
                rec.CompanyID = Convert.ToInt32(obj["Company"]["Id"]);

                // check and update items
                items = Utils.CheckForNewItems(items, db, (int)rec.CompanyID, uid);

                rec.CompanyAddress = Convert.ToString(obj["Company"]["Street"]) +
                    ", " + Convert.ToString(obj["Company"]["City"]) + ", " + Convert.ToString(obj["Company"]["Country"]);
                rec.CompanyIdentificator = Convert.ToString(obj["Company"]["Identificator"]);
                rec.CompanyMail = Convert.ToString(obj["Company"]["Email"]);
                rec.CompanyName = Convert.ToString(obj["Company"]["Name"]);
                rec.CompanyPhone = Convert.ToString(obj["Company"]["Phone"]);
                rec.CustomerID = custId;
                var st = Convert.ToString(obj["Customer"]["AStreet"]).Trim();
                var city = Convert.ToString(obj["Customer"]["ACity"]).Trim();
                var cnt = Convert.ToString(obj["Customer"]["ACountry"]).Trim();
                rec.CustomerAddress = st + (st=="" ? "" : ", ") + city + (city=="" ? "" : ", ") + cnt;
                rec.CustomerACity = city;
                rec.CustomerACountry = cnt;
                rec.CustomerAStreet = st;
                rec.CustomerAIndex = customer != null ? customer.AIndex : "";
                //rec.CustomerAddress = Convert.ToString(obj["Customer"]["AStreet"]) +
                //    ", " + Convert.ToString(obj["Customer"]["ACity"]) + ", " + Convert.ToString(obj["Customer"]["ACountry"]);
                rec.CustomerIdentificator = Convert.ToString(obj["Customer"]["Identificator"]);
                rec.CustomerMail = Convert.ToString(obj["Customer"]["CEmail"]);
                rec.CustomerName = Convert.ToString(obj["Customer"]["Name"]);
                rec.CustomerPhone = Convert.ToString(obj["Customer"]["CPhone"]);
                rec.Date = ConvertFromStr(Convert.ToString(obj["Date"]));
                rec.Discount = Convert.ToDecimal(obj["Discount"]);
                rec.DiscPer = Convert.ToBoolean(obj["DiscPer"]);
                rec.DocumentNumber = 0;

                if (obj["CreationDate"] != null && Convert.ToString(obj["CreationDate"]) != "")
                    rec.CreationDate = ConvertFromStr(Convert.ToString(obj["CreationDate"]));
                if (obj["DueDate"] != null && Convert.ToString(obj["DueDate"]) != "")
                    rec.DueDate = ConvertFromStr(Convert.ToString(obj["DueDate"]));

                rec.IsArchive = false;
                rec.IsDraft = isDraft;
                rec.Nds = Convert.ToDecimal(obj["Nds"])/100;
                rec.NdsInc = Convert.ToBoolean(obj["NdsInc"]);
                rec.Total = isCanceled ? 0.01M : Convert.ToDecimal(calc["total"]);
                rec.NdsV = Convert.ToDecimal(calc["nds"]);
                rec.DiscV = Convert.ToDecimal(calc["disc"]);
                //if(obj.Type==3)
                //{
                //    rec.PaidTotal = isCanceled ? 0.01M : Convert.ToDecimal(payments["Total"]);
                //}
                //else { rec.PaidTotal = isCanceled ? 0.01M : Convert.ToDecimal(obj["Paid"]["Total"]); }

                //if (rec.DocumentType == 11) changed by ortal&nofar
                if (rec.DocumentType == 11 || rec.DocumentType == 12)
                    rec.DocStatus = Convert.ToInt32(obj["DocStatus"]);

                if (rec.DocumentType == 2 || rec.DocumentType == 3)
                {
                  
                    var sum = 0;
                    foreach (var p in payments)
	                {
		                sum += Convert.ToDecimal(p["Total"]);
	                }
                    rec.PaidTotal = sum;
                }
                else
                {
                    rec.PaidTotal = isCanceled ? 0.01M : Convert.ToDecimal(obj["Paid"]["Total"]);
                }
                
                rec.MasBaMakor = Convert.ToDecimal(obj["Paid"]["MasBaMakor"]);

                rec.UserID = uid;

                if (isCanceled)
                {
                    rec.CancelID = Convert.ToInt32(data["data"]["CancelID"]);
                    rec.CancelMsg = Convert.ToString(data["data"]["CancelMsg"]);
                    var cDoc = db.tbUserDocuments.Where(i => i.Id == rec.CancelID).FirstOrDefault();
                    cDoc.IsCanceled = true;
                }

                if (id == 0) db.tbUserDocuments.Add(rec);
                db.SaveChanges();

                if (!isCanceled) // not cancel doc
                { 
                    if (id != 0)
                    {
                        var del1 = db.tbDocumentProducts.Where(i => i.DocumentID == id).ToList();
                        foreach (var d in del1)
                        {
                            db.tbDocumentProducts.Remove(d);
                        }

                        var del2 = db.tbDocumentPayments.Where(i => i.DocID == id).ToList();
                        foreach (var d in del2)
                        {
                            db.tbDocumentPayments.Remove(d);
                        }
                    }

                    // add to products
                    foreach (var item in items)
                    {
                        var pr = new tbDocumentProduct();
                        pr.Amount = Convert.ToDouble(item["Amount"]);
                        pr.Price = Convert.ToDouble(item["Price"]);
                        pr.DocumentID = rec.Id;
                        pr.ProductID = Convert.ToInt32(item["Id"]);
                        pr.Name = Convert.ToString(item["Name"]);
                        pr.Info = Convert.ToString(item["Info"]);
                        db.tbDocumentProducts.Add(pr);
                    }

                    // add to payments
                    foreach (var item in payments)
                    {
                        var p = new tbDocumentPayment();
                        p.DocID = rec.Id;
                        p.TypeID = Convert.ToInt32(item["Type"]["Id"]);
                        p.Type = Convert.ToString(item["Type"]["Type"]);
                        p.Total = Convert.ToDouble(item["Total"]);
                        if (item["Bank"] != null) p.BankCode = Convert.ToInt32(item["Bank"]["Id"]);
                        if (item["Branch"] != null) p.BranchCode = Convert.ToInt32(item["Branch"]["Id"]);
                        p.Account = Convert.ToString(item["Account"]);
                        p.Check = Convert.ToString(item["Check"]);
                        p.Date = Utils.ConvertFromStr(Convert.ToString(item["Date"]));
                        db.tbDocumentPayments.Add(p);
                    }
                }

                db.SaveChanges();
                if (isDraft)
                {
                    return Newtonsoft.Json.JsonConvert.SerializeObject(rec);
                }
                else
                {
                    return rec.Id.ToString();
                }
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(ex.Message);
            return "error";
        }
    }


    private static dynamic CheckForNewItems(dynamic items, DBInvoiceEntities db, int cid, int uid)
    {
        foreach (var item in items)
        {
            string temp = Convert.ToString(item["Id"]);
            if (temp.StartsWith("temp_"))
            {
                var pr = new tbProduct();
                pr.Name = Convert.ToString(item["Name"]);
                pr.CompanyID = cid;
                pr.UserID = uid;
                pr.Price = Convert.ToDecimal(item["Price"]);
                pr.IsArchive = false;
                pr.IsNew = true;
                db.tbProducts.Add(pr);
                db.SaveChanges();
                item["Id"] = pr.Id;
                item["New"] = true;
            }
            else
            {
                item["New"] = false;
            }
        }
        return items;
    }

    private static DateTime? ConvertFromStr(string s){
        DateTime myDate;
        if (DateTime.TryParse(s, out myDate))
        {
            return myDate;
        }
        else
        {
            try
            {
                return DateTime.ParseExact(s, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                //return DateTime.ParseExact(DateTime.Now.ToShortDateString(), "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
            }
            catch
            {
                return null;
            }
        }
    }

    public static string DeleteDocument(int id)
    {
        using (var db = new DBInvoiceEntities())
        {
            var item = db.tbUserDocuments.Where(i => i.Id == id).FirstOrDefault();
            if (item == null)
            {
                return "error";
            }
            else
            {
                item.IsArchive = true;
                db.SaveChanges();
                return "ok";
            }
        }
    }

    public static string SaveDocAndLock(dynamic data, int uid)
    {
        var result = Utils.SaveDocDraft(data, uid, false);
        if (result == "error")
        {
            return "error";
        }
        else
        {
            int id = Convert.ToInt32(result);
            var obj = data["data"];
            try
            {
                using (var db = new DBInvoiceEntities())
                {
                    // add number
                    // find last number
                    int docTp = Convert.ToInt32(obj["Type"]);
                    int compID = Convert.ToInt32(obj["Company"]["Id"]);
                    var lastDoc = db.tbUserDocuments.Where(i => i.Id == id).FirstOrDefault();
                    var compRec = db.tbDocumentNumbers.Where(i => i.CompanyID == compID && i.DocID == docTp).FirstOrDefault();
                    //int newlast;
                    if (compRec.Last == 0)
                    {
                        compRec.Last = compRec.Start;
                    }
                    else
                    {
                        compRec.Last++;
                    }
                    //db.SaveChanges();
                    //newlast = (int)compRec.Last;
                    lastDoc.DocumentNumber = (int)compRec.Last;
                    db.SaveChanges();

                    return Newtonsoft.Json.JsonConvert.SerializeObject(lastDoc);
                    // create pdf
                    //var tp = db.tbDocumentTypes.Where(i => i.Id == docTp).FirstOrDefault().IPCode.Trim();
                    // deprecated
                    //var sr = Utils.GetPdf(id, tp);
                    //if (sr == "error")
                    //{
                    //    return "error";
                    //}
                    //else
                    //{
                    //    return Newtonsoft.Json.JsonConvert.SerializeObject(lastDoc);
                    //}

                    // deprecated
                    //var pdf = Utils.CreatePdf(id,tp);
                    //if (pdf == "error")
                    //{
                    //    return "error";
                    //}
                    //else
                    //{
                    //    return Newtonsoft.Json.JsonConvert.SerializeObject(lastDoc);
                    //}
                }
            }
            catch (Exception ex)
            {
                 return "error";
            }

        }
    }


    public static string SaveDocAndLockM(dynamic data, int uid)
    {
        var result = Utils.SaveDocDraft(data, uid, false);
        if (result == "error")
        {
            return "error";
        }
        else
        {
            int id = Convert.ToInt32(result);
            var obj = data["data"];
            try
            {
                using (var db = new DBInvoiceEntities())
                {
                    // add number
                    // find last number
                    int docTp = Convert.ToInt32(obj["Type"]);
                    int compID = Convert.ToInt32(obj["Company"]["Id"]);
                    var lastDoc = db.tbUserDocuments.Where(i => i.Id == id).FirstOrDefault();
                    var compRec = db.tbDocumentNumbers.Where(i => i.CompanyID == compID && i.DocID == docTp).FirstOrDefault();
                    //int newlast;
                    if (compRec.Last == 0)
                    {
                        compRec.Last = compRec.Start;
                    }
                    else
                    {
                        compRec.Last++;
                    }

                    lastDoc.DocumentNumber = (int)compRec.Last;
                    db.SaveChanges();

                    var wc = new WebClient();
                    var url = "http://212.224.76.88/inv10/pdf1.aspx?id=" + lastDoc.Id.ToString();
                    wc.OpenRead(url); 
                    // and send
                    SendDocToMailM(lastDoc.Id, Convert.ToString(obj["Mail"]));
                   

                    return Newtonsoft.Json.JsonConvert.SerializeObject(lastDoc);
                }
            }
            catch (Exception ex)
            {
                return "save error: " + ex.Message;
            }

        }
    }
    // deprecated
    private static string GetPdf(int id, string tp)
    {
        System.Web.HttpResponse Response = System.Web.HttpContext.Current.Response;
        try
        {
            // create an API client instance
            pdfcrowd.Client client = new pdfcrowd.Client("alexvirtech", "a5ee3194848d3bb6cf94309709bb765f");

            // convert a web page and write the generated PDF to a memory stream
            MemoryStream Stream = new MemoryStream();
            var url = string.Format("http://www.vir-tec.net/inv/preview.aspx?id={0}", id.ToString());
            client.convertURI(url, Stream);

            // set HTTP response headers
            Response.Clear();
            Response.AddHeader("Content-Type", "application/pdf");
            Response.AddHeader("Cache-Control", "max-age=0");
            Response.AddHeader("Accept-Ranges", "none");
            Response.AddHeader("Content-Disposition", "attachment; filename=google_com.pdf");

            // send the generated PDF
            // Stream.WriteTo(Response.OutputStream);

            var uid = Convert.ToString(HttpContext.Current.Session["uid"]);
            var dir = string.Format("Documents/{0}", uid.Trim());
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            var pdf = string.Format("{0}/{1}_{2}.pdf", dir, tp, id.ToString());
            //Stream.Save(HttpContext.Current.Server.MapPath(pdf)); // for direct dowmload
            using (FileStream file = new FileStream(HttpContext.Current.Server.MapPath(pdf), FileMode.Create, FileAccess.Write))
            {
                Stream.WriteTo(file);
            }

            Stream.Close();
            return "ok";
            //Response.Flush();
            //Response.End();
        }
        catch (pdfcrowd.Error why)
        {
            return "error";
            //Response.Write(why.ToString());
        }
    }

    // deprecated
    private static string CreatePdf(int id, string tp)
    {
        try
        {
            Doc theDoc = new Doc();
            theDoc.Rect.Inset(0, 0);
            theDoc.Rect.Move(-55, -160);
            theDoc.HtmlOptions.UseScript = true;
            theDoc.Page = theDoc.AddPage();
            theDoc.Transform.Magnify(1.15, 1.15, 0, 0);

            int theID;
            var b = GetFullRootUrl();
            //var b = "http://212.224.76.88/inv_pdf";
            var url = string.Format("{0}/Preview.aspx?id={1}", b, id.ToString());
            theID = theDoc.AddImageUrl(url);

            var uid = Convert.ToString(HttpContext.Current.Session["uid"]);
            var dir = string.Format("Documents/{0}",uid.Trim());
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            var pdf = string.Format("{0}/{1}_{2}.pdf",dir, tp, id.ToString());
            theDoc.Save(HttpContext.Current.Server.MapPath(pdf));
            theDoc.Clear();
            //Utils.Log("ok");
            return pdf; // for test
        }
        catch (Exception ex)
        {
            //Utils.Log(ex.Message);
            return "error";
        }
    }

    private static string GetFullRootUrl()
    {
        HttpRequest request = HttpContext.Current.Request;
        return request.Url.AbsoluteUri.Replace(request.Url.AbsolutePath, String.Empty);
    }

    private static void Log(string s){
        string txt = string.Format("{0}{1}{2}",DateTime.Now.ToShortTimeString(),Environment.NewLine,s);
        var path = @"C:\\Project\\InvPlus\\Log\\log.txt";
        if(!File.Exists(path))File.Create(path);

        using (FileStream fs = new FileStream(path, FileMode.OpenOrCreate))
        using (StreamWriter str = new StreamWriter(fs))
        {
            str.BaseStream.Seek(0, SeekOrigin.End);
            str.Write(Environment.NewLine);
            str.WriteLine(DateTime.Now.ToLongTimeString() + " " + DateTime.Now.ToLongDateString());
            string addtext = s + Environment.NewLine;
            str.Flush();
        }

        //File.WriteAllText(path, txt);

        // Open the file to read from. 
        //string readText = File.ReadAllText(path);
    }

    public static string GetFirstDocNumeration(int nu)
    {
        var sqlConnection = ConfigurationManager.AppSettings["SQLServer"];
        using (SqlConnection myConnection = new SqlConnection(sqlConnection))
        {
            using (SqlCommand cmd = new SqlCommand("spGetDocNumeration", myConnection))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                myConnection.Open();

                SqlParameter cid = cmd.Parameters.AddWithValue("@cid", nu);
                DataTable table = new DataTable();
                using (var da = new SqlDataAdapter(cmd))
                {
                    da.Fill(table);
                    return Newtonsoft.Json.JsonConvert.SerializeObject(table);
                }
            }
        }
    }
    
    // test
    public static string GenerateGloballyUniqueFileName(string ext)
    {
        DirectoryInfo info = new DirectoryInfo(@"D:\projects\perets\invplus2\Documents\test");
        long uniqueKey = info.LastWriteTime.Ticks + 1L;
        string filename = String.Format("file{0}.{1}", uniqueKey.ToString(), ext);
        return filename;
    }

    public static string GetNewProducts(int uid)
    {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                // user products
                var list1 = db.tbProducts.Where(i => i.UserID == (int)uid && (bool)i.IsNew).ToList();
                foreach (var item in list1)
                {
                    item.IsNew = false;
                }
                db.SaveChanges();
                // add doc products
                var ar = list1.Select(i => i.Id).ToList();
                var list2 = db.tbDocumentProducts.Where(i => ar.Contains((int)i.ProductID)).ToList();

                // combine doc items with list
                var res = new
                {
                    userProducts = list1,
                    docProducts = list2
                };
                return Newtonsoft.Json.JsonConvert.SerializeObject(res);
            }
        }
        catch (Exception ex)
        {
            return "error";
        }
    }

    public static string GetZip(dynamic obj)
    {
        var a = new List<int>();
        foreach (var item in obj["data"])
        {
            a.Add((int)item);
        }
        //var data = ((JArray)obj["data"]).ToList();
        using (var db = new DBInvoiceEntities())
        {
            var docs = db.vDocCompAndTypes.Where(i => a.Contains(i.Id)).ToList();
            var files = new List<string>();
            var folder = string.Format("{0}\\{1}", WebConfigurationManager.AppSettings["DocFolder"], docs[0].CompanyID.ToString());
            foreach (var doc in docs)
            {
                var fileName = string.Format("{0}_{1}.pdf", doc.IPCode.Trim(), doc.Id.ToString());
                var filePath = string.Format("{0}\\{1}", folder, fileName);
                files.Add(filePath);
            }
            //var zipFolder = string.Format("{0}\\{1}", HttpContext.Current.Server.MapPath("."), WebConfigurationManager.AppSettings["TempFiles"]);
            var zipFolder = WebConfigurationManager.AppSettings["TempFiles1"];
            RemoveOldFiles(zipFolder);
            var zipUniqueFileName = string.Format(@"{0}.zip", Guid.NewGuid());
            var zipPath = string.Format("{0}\\{1}", zipFolder, zipUniqueFileName);
            ZipFileCreator.CreateZipFile(zipPath, files);
            //return string.Format("/{0}/{1}", WebConfigurationManager.AppSettings["TempFiles"], zipUniqueFileName);
            return string.Format("{0}/{1}", WebConfigurationManager.AppSettings["TempFiles"], zipUniqueFileName);
        }
    }

    private static void RemoveOldFiles(string dirName)
    {
        string[] files = Directory.GetFiles(dirName);
        int maxMinutes = 3; // expiration interval in minutes
        foreach (string file in files)
        {
            FileInfo fi = new FileInfo(file);
            if (fi.LastAccessTime < DateTime.Now.AddMinutes((-1) * maxMinutes))
                fi.Delete();
        }
    }

    public static string SendDocToMail(dynamic obj)
    {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                //var docId = Convert.ToInt32(obj["data"]["doc"]);
                var id = (int)obj["data"]["doc"];
                var doc = db.vDocCompAndTypes.Where(i => i.Id == id).FirstOrDefault();
                var folder = string.Format("{0}\\{1}", WebConfigurationManager.AppSettings["DocFolder"], doc.CompanyID.ToString());
                var fileName = string.Format("{0}_{1}.pdf", doc.IPCode.Trim(), doc.Id.ToString());
                var filePath = string.Format("{0}\\{1}", folder, fileName);
                var attach = new List<string>();
                attach.Add(filePath);

                var to = new List<string>();
                to.Add((string)obj["data"]["to"]);
                var mailBody = (string)obj["data"]["body"];
                var subject = (string)obj["data"]["subject"];

                var ms = new MailSender();
                ms.Send(to, subject, mailBody, attach);

                return "ok";
            }
        }
        catch(Exception ex)
        {
            return "error";
        }


        
    }


    public static string SendDocToMailM(int id,string mailto)
    {
        try
        {
            using (var db = new DBInvoiceEntities())
            {
                //var docId = Convert.ToInt32(obj["data"]["doc"]);
                //var id = (int)obj["data"]["doc"];
                var doc = db.vDocCompAndTypes.Where(i => i.Id == id).FirstOrDefault();
                var folder = string.Format("{0}\\{1}", WebConfigurationManager.AppSettings["DocFolder"], doc.CompanyID.ToString());
                var fileName = string.Format("{0}_{1}.pdf", doc.IPCode.Trim(), doc.Id.ToString());
                var filePath = string.Format("{0}\\{1}", folder, fileName);
                var attach = new List<string>();
                attach.Add(filePath);

                var to = new List<string>();
                to.Add(mailto); //(string)obj["data"]["to"]);
                var mailBody = "הודעה זמנית"; // (string)obj["data"]["body"];
                var subject = string.Format("חשבונית מס {0}",id.ToString()); // (string)obj["data"]["subject"];

                var ms = new MailSender();
                ms.Send(to, subject, mailBody, attach);

                return "ok";
            }
        }
        catch(Exception er)
        {
            return "send error: " + er.Message;
        }



    }

    public static string GetUF(dynamic obj)
    {

        var a = new List<int>();
        

        //foreach (var item in obj["data"])
        //{
        //    a.Add((int)item);
        //}
        using (var db = new DBInvoiceEntities())
        {
            var creation = Convert.ToDateTime(obj["data"]["create"]);
            var finish = Convert.ToDateTime(obj["data"]["finish"]);
            var docs = db.tbUserDocuments.Where(i => (i.DocumentType == 1 || i.DocumentType == 2 || i.DocumentType == 3 || i.DocumentType == 4)).ToArray();
            var filteredDocs = docs.Where(i => (i.CreationDate >= creation) && (i.DueDate <= finish)).ToArray();
            var tUniqueFileName = string.Format(@"{0}.TXT", "BKMVDATA");
            var sumeryFileName = string.Format(@"{0}.TXT", "INI");
            var tFolder = string.Format("{0}\\{1}", HttpContext.Current.Server.MapPath("."), WebConfigurationManager.AppSettings["TempFiles"]);
            var tPath = string.Format("{0}\\{1}", tFolder, tUniqueFileName);
            var sumPath = string.Format("{0}\\{1}", tFolder, sumeryFileName);

            var file = new System.IO.StreamWriter(tPath, true, Encoding.GetEncoding("Windows-1255"));
            //// here add rows to file BKMVDATA need to create class to format rows.

            //foreach (var docID in a)   
            //{
            //    var doc = db.tbUserDocuments.Where(i => i.Id == docID).FirstOrDefault();
            //    var customer = db.tbCustomers.Where(i => i.Id == doc.CustomerID).FirstOrDefault();
            //    var fu = new FormatUnitA(db, doc);
            //    var list = fu.GetDataA();
            //    list.ForEach(file.WriteLine);
            //}

            file.Close();
            var file2 = new System.IO.StreamWriter(sumPath, true, Encoding.GetEncoding("Windows-1255"));
            //// here add rows to file INI

            file2.Close();

            var files = new List<string>();
            files.Add(tPath);
            files.Add(sumPath);
           
            var zipFolder = WebConfigurationManager.AppSettings["TempFiles1"];
            RemoveOldFiles(zipFolder);
            var zipUniqueFileName = string.Format(@"{0}.zip", Guid.NewGuid());
            var zipPath = string.Format("{0}\\{1}", zipFolder, zipUniqueFileName);
            ZipFileCreator.CreateZipFile(zipPath, files);
            return string.Format("{0}/{1}", WebConfigurationManager.AppSettings["TempFiles"], zipUniqueFileName);
        }
    }




    public static void AdminTask()
    {
        using (var db = new DBInvoiceEntities())
        {
            var users = db.tbUsers.ToList();
            foreach (var u in users)
            {
                var companies = db.tbUserCompanies.Where(i => i.UserID == u.Id).ToList();
                var customers = db.tbUserCustomers.Where(i => i.UserID == u.Id).ToList();
                foreach (var cmp in companies)
                {
                    foreach (var cst in customers)
                    {
                        var rel = db.tbCompanyCustomers.Where(i => i.CompanyID == cmp.CompanyID && i.CustomerID == cst.CustomerID).FirstOrDefault();
                        if (rel == null)
                        {
                            var rn = new tbCompanyCustomer();
                            rn.CompanyID = cmp.CompanyID;
                            rn.CustomerID = cst.CustomerID;
                            db.tbCompanyCustomers.Add(rn);
                            db.SaveChanges();
                        }
                    }
                }
            }
        }

    }

    public static string GetDocForH(dynamic obj)//get file fo hashavashevet
    {
        var a = new List<int>();
        foreach (var item in obj["data"])
        {
            a.Add((int)item);
        }
        using (var db = new DBInvoiceEntities())
        {
            var tFolder = string.Format("{0}\\{1}", HttpContext.Current.Server.MapPath("."), WebConfigurationManager.AppSettings["TempFiles"]);
            var mFolder = string.Format("{0}\\{1}", HttpContext.Current.Server.MapPath("."), WebConfigurationManager.AppSettings["ConstantFiles"]);
            var tUniqueFileName = string.Format(@"{0}.doc", "movein");
            var mPath = string.Format("{0}{1}",mFolder, "\\movein.prm");
            var tPath = string.Format("{0}\\{1}", tFolder, tUniqueFileName);
            var file = new System.IO.StreamWriter(tPath, true, Encoding.GetEncoding("Windows-1255"));

            foreach (var docID in a)
            {
                var doc = db.tbUserDocuments.Where(i => i.Id == docID).FirstOrDefault();
                var customer = db.tbCustomers.Where(i => i.Id == doc.CustomerID).FirstOrDefault();
                var fu = new FormatUnitA(db, doc);
                var list = fu.GetDataA();
                list.ForEach(file.WriteLine);
            }

            file.Close();

            var files = new List<string>();
            files.Add(tPath);
            files.Add(mPath);
            //return string.Format("{0}/{1}/{2}",
            //     WebConfigurationManager.AppSettings["VirtualDir"],
            //     WebConfigurationManager.AppSettings["TempFiles"],
            //     tUniqueFileName);
            var zipFolder = WebConfigurationManager.AppSettings["TempFiles1"];

           // var zipFolder = string.Format("{0}\\{1}", HttpContext.Current.Server.MapPath("."), WebConfigurationManager.AppSettings["TempFiles1"]);
            RemoveOldFiles(zipFolder);
            var zipUniqueFileName = string.Format(@"{0}.zip", Guid.NewGuid());
            var zipPath = string.Format("{0}\\{1}", zipFolder, zipUniqueFileName);
            ZipFileCreator.CreateZipFile(zipPath, files);
            return string.Format("{0}/{1}",  WebConfigurationManager.AppSettings["TempFiles"], zipUniqueFileName);

        }
    } 

    public static string GetUsersList()
    {
        using (var db = new DBInvoiceEntities())
        {
            var u = db.tbUsers.Where(i=> !i.IsArchive.HasValue || !(bool)i.IsArchive).Select(x=>new {id = x.Id, name = x.FName + " " + x.LName}).ToArray();
            return Newtonsoft.Json.JsonConvert.SerializeObject(u);
        }
    }

    public static string GenBKMFile (int companyID,int year, int MonthFrom, int MonthTo)
    {
        return GenBKMFile(companyID, year, MonthFrom, MonthTo, false);
    }

    public static string GenBKMFile (int companyID,int year, int MonthFrom, int MonthTo, bool isDebugMode)
    {
        DateTime from, to;
        string filePath;
        try
        {
            from = DateTime.Parse (year.ToString()+"/"+(MonthFrom+1)+"/"+"01"); 
            to = DateTime.Parse (year.ToString()+"/"+(MonthTo+1)+"/"+"01"); // calc the end of the month
            to = to.AddMonths(1);
            to = to.Subtract(new TimeSpan(1, 0, 0, 0));

            BKMFileCreator.SetPath(WebConfigurationManager.AppSettings["DocFolder"]);
            BKMFileCreator.setDebugMode(isDebugMode);
            filePath = BKMFileCreator.GenFile(companyID, from, to);
        }
        catch (Exception ex)
        {
            return "";
        }

        return ("http://" + HttpContext.Current.Request.Url.Authority + WebConfigurationManager.AppSettings["VirtualDir"] + "/BKMFile/" + filePath);
    }
}