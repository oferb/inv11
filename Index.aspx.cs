using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Index : System.Web.UI.Page
{
    public tbUser CurrentUser;
    protected void Page_Load(object sender, EventArgs e)
    {
        // temp for dev
        //Session["user"] = Utils.Login("a@a.com", "5");
        if (Request["tp"] == "logout")
        {
            Session.Remove("user");
            Session.Remove("uid");
            Response.Redirect("Default.aspx");
        }

        if (Session["user"] == null)
        {
            Response.Redirect("Default.aspx");
        }
        else
        {
            CurrentUser = Session["user"] as tbUser;
        }
    }
}