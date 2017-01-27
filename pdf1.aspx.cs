using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class pdf1 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        if (Request["id"] == null) Response.End();
        var docID = Convert.ToInt32(Request["id"]);

        var creator = new PDFCreator(docID);
        if (creator.Success)
        {
            Response.ContentType = "application/pdf";
            Response.AppendHeader("Content-Disposition", "attachment; filename=" + creator.FileName);
            byte[] data = File.ReadAllBytes(creator.FilePath);
            Response.BinaryWrite(data);
            Response.End();
        }
        else
        {
            Response.Write("error");
        }

        //var creator = WebConfigurationManager.AppSettings["PDFCreator"];

        //using (var db = new DBInvoiceEntities())
        //{
        //    var doc = db.vDocCompAndTypes.Where(i=>i.Id==docID).FirstOrDefault();
        //    if (doc == null)
        //    {
        //        Response.Write("error");
        //        Response.End();
        //    }

        //    // company folder
        //    var folder = string.Format("{0}\\{1}", WebConfigurationManager.AppSettings["DocFolder"], doc.CompanyID.ToString());
        //    if (!Directory.Exists(folder))
        //    {
        //        Directory.CreateDirectory(folder);
        //    }

        //    var fname = string.Format("{0}_{1}.pdf",doc.IPCode.Trim(),doc.Id.ToString());
        //    var file = string.Format("{0}\\{1}",folder, fname);
        //    var previewUrl = string.Format("http://{0}/PreviewB.aspx", HttpContext.Current.Request.Url.Authority);

        //    if (!File.Exists(file)){
        //        string switches = string.Format("{0} {1}?id={2}&print=1 {3}", //http://localhost:2812/PreviewB.aspx
        //        "--margin-top 10mm --margin-bottom 10mm --margin-right 10mm --margin-left 10mm --page-size Letter ",
        //        previewUrl,
        //        docID.ToString(), file);
        //        Utils.LaunchCommandLineApp(creator, switches);
        //    }

        //    Response.ContentType = "application/pdf";
        //    Response.AppendHeader("Content-Disposition", "attachment; filename=" + fname);
        //    byte[] data = File.ReadAllBytes(file);
        //    Response.BinaryWrite(data);
        //    Response.End();

        //    //Response.Write("ok");

        //}



        
    }

 
}