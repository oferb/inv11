using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;

/// <summary>
/// Summary description for PDFCreator
/// </summary>
public class PDFCreator
{
    public int DocumentID { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public bool Success { get; set; }
	public PDFCreator(int docID)
	{
        DocumentID = docID;
        var creator = WebConfigurationManager.AppSettings["PDFCreator"];

        using (var db = new DBInvoiceEntities())
        {
            var doc = db.vDocCompAndTypes.Where(i => i.Id == DocumentID).FirstOrDefault();
            if (doc == null)
            {
                //Response.Write("error");
                //Response.End();
                Success = false;
            }

            // company folder
            var folder = string.Format("{0}\\{1}", WebConfigurationManager.AppSettings["DocFolder"], doc.CompanyID.ToString());
            if (!Directory.Exists(folder))
            {
                Directory.CreateDirectory(folder);
            }

            FileName = string.Format("{0}_{1}.pdf", doc.IPCode.Trim(), doc.Id.ToString());
            FilePath = string.Format("{0}\\{1}", folder, FileName);
            var previewUrl = string.Format("http://{0}{1}/PreviewB.aspx",
               HttpContext.Current.Request.Url.Authority,
               WebConfigurationManager.AppSettings["VirtualDir"]);

            if (!File.Exists(FilePath)) // if not exists, create origin
            {
                string switches = string.Format("{0} {1}?id={2}&c=0&print=1 {3}", 
                @" --lowquality --margin-top 10mm --margin-bottom 10mm --margin-right 10mm --margin-left 10mm --page-size Letter ",
                previewUrl,
                docID.ToString(), FilePath);
                //LaunchCommandLineApp(creator, switches); //changed by #ortal&nofar#
                Success = LaunchCommandLineApp(creator, switches);
            }
            else
            {
                var copy = FilePath.Replace(".pdf","_c.pdf");
                if (!File.Exists(copy)) // if copy not exists, create copy
                {
                    string switches = string.Format("{0} {1}?id={2}&c=1&print=1 {3}", 
                    @" --lowquality --margin-top 10mm --margin-bottom 10mm --margin-right 10mm --margin-left 10mm --page-size Letter ",
                    previewUrl,
                    docID.ToString(), copy);
                    //LaunchCommandLineApp(creator, switches); //changed by #ortal&nofar#
                    Success = LaunchCommandLineApp(creator, switches);
                    
                }
                FilePath = copy;
            }

            //Success = true; //changed by ortal&nofar
            //Response.ContentType = "application/pdf";
            //Response.AppendHeader("Content-Disposition", "attachment; filename=" + fname);
            //byte[] data = File.ReadAllBytes(file);
            //Response.BinaryWrite(data);
            //Response.End();

            //Response.Write("ok");

        }
	}

    //private static void LaunchCommandLineApp(string com, string arg) //changed by #ortal&nofar# see bellow
    //{
    //    // Use ProcessStartInfo class
    //    ProcessStartInfo startInfo = new ProcessStartInfo();
    //    startInfo.CreateNoWindow = false;
    //    startInfo.UseShellExecute = false;
    //    startInfo.FileName = com; // "dcm2jpg.exe";
    //    startInfo.WindowStyle = ProcessWindowStyle.Hidden;
    //    startInfo.Arguments = arg; // "-f j -o \"" + ex1 + "\" -z 1.0 -s y " + ex2;

    //    try
    //    {
    //        // Start the process with the info we specified.
    //        // Call WaitForExit and then the using statement will close.
    //        using (Process exeProcess = Process.Start(startInfo))
    //        {
    //            exeProcess.WaitForExit();
    //        }
    //    }
    //    catch
    //    {
    //        // Log error.
    //    }
    //}

    private static bool LaunchCommandLineApp(string com, string arg)
    {
        // Use ProcessStartInfo class 
        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.CreateNoWindow = false;
        startInfo.UseShellExecute = false;
        startInfo.FileName = com; // "dcm2jpg.exe";
        startInfo.WindowStyle = ProcessWindowStyle.Hidden;
        startInfo.Arguments = arg; // "-f j -o \"" + ex1 + "\" -z 1.0 -s y " + ex2;

        try
        {
            // Start the process with the info we specified.
            // Call WaitForExit and then the using statement will close.
            using (Process exeProcess = Process.Start(startInfo))
            {
                exeProcess.WaitForExit();
                return true;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.ToString());
            return false;
        }
    }
}