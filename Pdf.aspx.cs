using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


public partial class Pdf : System.Web.UI.Page
{
    public tbUserDocument Doc = new tbUserDocument();
    public tbCompany Company = new tbCompany();
    public double Total1;
    protected void Page_Load(object sender, EventArgs e)
    {
        var docId = (Request["id"]) == null ? "1" : Convert.ToString(Request["id"]);
        var docTp = (Request["tp"]) == null ? "H" : Convert.ToString(Request["tp"]);
        
        System.Web.HttpResponse Response = System.Web.HttpContext.Current.Response;
        try
        {
            // create an API client instance
            pdfcrowd.Client client = new pdfcrowd.Client("alexvirtech", "a5ee3194848d3bb6cf94309709bb765f");

            // convert a web page and write the generated PDF to a memory stream
            MemoryStream Stream = new MemoryStream();
            var url = string.Format("http://www.vir-tec.net/inv/previewB.aspx?id={0}", docId);
            client.convertURI(url, Stream);

            // set HTTP response headers
            Response.Clear();
            Response.AddHeader("Content-Type", "application/pdf");
            Response.AddHeader("Cache-Control", "max-age=0");
            Response.AddHeader("Accept-Ranges", "none");

            var pdf = string.Format("{0}_{1}.pdf", docTp, docId);
            Response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}",pdf));

            // send the generated PDF
            Stream.WriteTo(Response.OutputStream);
            Stream.Close();
            Response.Flush();
            Response.End();
        }
        catch (pdfcrowd.Error why)
        {
            Response.Write(why.ToString());
        }
    }
}