<%@ WebHandler Language="C#" Class="fileUploader" %>

using System;
using System.Web;
using System.IO;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using RandomNameGenerator;

public class fileUploader : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        try
        {
            var id = HttpContext.Current.Request["id"];
            string dirFullPath = HttpContext.Current.Server.MapPath("~/Logo/");
            string[] files = System.IO.Directory.GetFiles(dirFullPath);
            //int numFiles;
            files = System.IO.Directory.GetFiles(dirFullPath);
            //numFiles = files.Length;
            //numFiles = numFiles + 1;
            string str_image = "";
            
            //foreach (string s in context.Request.Files)
            //{
                HttpPostedFile file = context.Request.Files[0];
                string fileName = file.FileName;
                //string fileExtension = file.ContentType;
                var fileExtension = Path.GetExtension(fileName).ToLower();
            
                if (fileExtension == ".gif" || fileExtension == ".jpg" || fileExtension == ".png" || fileExtension == ".bmp")
                {

                    //var rand = new Random(DateTime.Now.Second);
                    var rand = RandomNameGenerator.NameGenerator.GenerateLastName();

                    if (!string.IsNullOrEmpty(fileName))
                    {
                        
                        //str_image = id.ToString() + "_" + rand + fileExtension;
                        str_image = id.ToString() + "_" + rand + ".jpg"; // fileExtension;
                        string pathToSave_100 = HttpContext.Current.Server.MapPath("~/Logo/") + str_image;

                        var ih = new ImageHandler();
                        var bmpPostedImage = new System.Drawing.Bitmap(file.InputStream);
                        ih.Save(bmpPostedImage, 250, 200, 100, pathToSave_100);

                        //file.SaveAs(pathToSave_100);
                    }
                    //}
                    //  database record update 
                    using (var db = new DBInvoiceEntities())
                    {
                        var idn = Convert.ToInt32(id);
                        var tb = db.tbCompanies.Where(i => i.Id == idn).FirstOrDefault();
                        tb.Logo = str_image;
                        db.SaveChanges();
                    }

                    context.Response.Write(str_image);
                }
                else
                {
                    context.Response.Write("__error_format");
                }
        }
        catch (Exception ac)
        {
            context.Response.Write("__error_unknown");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}