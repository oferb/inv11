using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class PreviewB : System.Web.UI.Page
{
    public tbUserDocument Doc = new tbUserDocument();
    public tbCompany Company = new tbCompany();
    public double Total1;
    public double Total2;
    public static DBInvoiceEntities db;
    public bool IsForPrint = false;
    public string DocOrigin = "מקור";
    public string CustAddress = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        var docId = (Request["id"]) == null ? 1 : Convert.ToInt32(Request["id"]);

        if (Request["print"] != null) IsForPrint = true;
        if (Request["c"] != null && (string)Request["c"] == "1") DocOrigin = "העתק";
        //var docId = 1; // test
        using (db = new DBInvoiceEntities())
        {
            Doc = db.tbUserDocuments.Where(i => i.Id == docId).FirstOrDefault();
            //var user = db.tbUsers.Where(i => i.Id == Doc.UserID).FirstOrDefault();
            Company = db.tbCompanies.Where(i => i.Id == Doc.CompanyID).FirstOrDefault();
            var logo = (Company.Logo == null || Company.Logo.ToString().Trim() == "") ? "0.png" : Company.Logo.Trim();
            uImg.Text = string.Format("<img src='Logo/{0}' style='max-width:150px;max-height:100px' />", logo);

            var dc = db.tbDocumentTypes.Where(i => i.Id == Doc.DocumentType).FirstOrDefault();
            docTitle.Text = dc.Name;

            // items
            var items = db.tbDocumentProducts.Where(i => i.DocumentID == Doc.Id)
                .Select(i => new
                {
                    Name = i.Name,
                    Info = i.Info == null ? "": i.Info,
                    Price = i.Price,
                    Amount = i.Amount,
                    Total = i.Price * i.Amount,
                })
                .ToList();
            if (items.Count > 0)
            {
                Total1 = db.tbDocumentProducts.Where(i => i.DocumentID == Doc.Id).Sum(i => i.Price * i.Amount);
                repItems.DataSource = items;
                repItems.DataBind();
            }

            // visible elements
            docItemsTable.Visible = Doc.DocumentType != 3 && Doc.DocumentType != 6 && (Doc.DocumentType < 9 || Doc.DocumentType == 11);
            paySubTitle.Visible = Doc.DocumentType == 2;
            docPayTable.Visible = Doc.DocumentType == 2 || Doc.DocumentType == 3 || Doc.DocumentType == 6;
            // changed by ortal&nofar
            docHCItemsTable.Visible = Doc.DocumentType == 12;

            // address
            CustAddress = (Doc.CustomerAddress == "" || Doc.CustomerAddress.Trim()==", ," ? "" : Doc.CustomerAddress + ",") +
                (Doc.CustomerPhone == "" ? "" : Doc.CustomerPhone + ",") + Doc.CustomerMail;
                
                //<%=Doc.CustomerAddress %>, <%=Doc.CustomerPhone %>, <%=Doc.CustomerMail %>

            // payments
            var pays = db.tbDocumentPayments.Where(i => i.DocID == Doc.Id)
                 .Select(i => new PayObject
                 {
                     TypeID = (int)i.TypeID,
                     Type = (string)i.Type,
                     Date = (DateTime)i.Date,
                     Total = (double)i.Total,
                     BankID = (int)i.BankCode,
                     BranchID = (int)i.BranchCode,
                     Check = (string)i.Check,
                     Account = (string)i.Account,
                     Comments = (string)i.Comments
                 })
               .ToList();
            foreach (var p in pays)
            {
                p.Update();
            }
            if (pays.Count > 0)
            {
                Total2 = (double)db.tbDocumentPayments.Where(i => i.DocID == Doc.Id).Sum(i => i.Total);
                repPays.DataSource = pays;
                repPays.DataBind();
            }

            masBamakor.Visible = Doc.MasBaMakor > 0;
            masBamakorSeperator.Visible = masBamakor.Visible;
            payTotal.Visible = Doc.MasBaMakor > 0;
        }

    }

    public class PayObject
    {
        public int TypeID { get; set; }
        public string Type { get; set; }
        public int? BankID { get; set; }
        public int? BranchID { get; set; }
        public string Bank { get; set; }
        public string Branch { get; set; }
        public string Description { get; set; }
        public string Comments { get; set; }
        public string Check { get; set; }
        public string Account { get; set; }
        public DateTime Date { get; set; }
        public double Total { get; set; }
        //public PayObject()
        //{

        //}

        internal void Update()
        {
            this.Description = "test 11";
            var bn = db.tbBanks.Where(i => i.Id == BankID).FirstOrDefault();
            if (bn != null) Bank = bn.Name;
            var br = db.tbBranches.Where(i => i.Id == BranchID).FirstOrDefault();
            if (br != null) Branch = br.Name;

            switch (TypeID)
            {
                case 1:
                    //Description = "צ'ק מס:" + Check + ", " + Bank + " (" + BankID.ToString() + "), סניף:" + Branch + " (" + BranchID.ToString() + "), ח-ן:" + Account;
                    Description = "צ'ק מס: " + Check + ", " + Bank + ", סניף: " + BranchID.ToString() + ", ח-ן: " + Account;
                    break;
                case 3:
                    //Description = Bank + " (" + BankID.ToString() + "), סניף:" + Branch + " (" + BranchID.ToString() + "), ח-ן:" + Account;
                    Description = Bank + ", סניף: " + BranchID.ToString() + ", ח-ן: " + Account;
                    break;
                case 4:
                    Description = Comments;
                    break;
                default:
                    Description = "";
                    break;
            }
        }
    }
}
