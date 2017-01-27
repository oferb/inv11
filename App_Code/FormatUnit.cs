using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

/// <summary>
/// Summary description for FormatUnit
/// </summary>
public class FormatUnit
{
    protected DBInvoiceEntities DB;
    protected tbUserDocument Document;
    protected tbCustomer Customer;
    protected tbCompany Company;
    protected List<tbDocumentPayment> Payments;

	public FormatUnit(DBInvoiceEntities db,tbUserDocument doc)
	{
        DB = db;
        Document = doc;
        Customer = db.tbCustomers.Where(i => i.Id == doc.CustomerID).FirstOrDefault();
        Company = db.tbCompanies.Where(i => i.Id == doc.CompanyID).FirstOrDefault();
        Payments = db.tbDocumentPayments.Where(i => i.DocID == doc.Id).ToList();
	}

    public List<string> GetData()
    {
        var list = new List<string>();
        if (Document.DocumentType == 1 || Document.DocumentType == 2)
        {
            for (var i = 0; i < 3; i++)
                list.Add(CreateLine(i, 0));
        }
        if (Document.DocumentType == 2 || Document.DocumentType == 3)
        {
            for (var i = 0; i < Payments.Count; i++)
                list.Add(CreateLine(3, i));
        }
        return list;
    }

    private string CreateLine(int i,int n)
    {
        var s = "";
        var ls = new int[] { 8, 8, 5, 6, 5, 6, 12, 3, 22 };
        
        switch (i)
        {
            case 0:
                s = string.Format("{0}{1}{2}{3}{4}{5}{6}",
                    PrepareItem(Customer.CardID,ls[0]),
                    PrepareItem("",ls[1]),
                    PrepareItem(Document.DocumentNumber,ls[2]),
                    PrepareItem(String.Format("{0:MMddyy}",Document.Date),ls[3]),
                    PrepareItem("",ls[4]),
                    PrepareItem("",ls[5]),
                    PrepareItem(String.Format("{0:.##}", Document.Total), ls[6]));
                break;
            case 1:
                s = string.Format("{0}{1}{2}{3}{4}{5}{6}",
                    PrepareItem("", ls[0]),
                    PrepareItem(Company.CardExp, ls[1]),
                    PrepareItem(Document.DocumentNumber, ls[2]),
                    PrepareItem(String.Format("{0:MMddyy}", Document.Date), ls[3]),
                    PrepareItem("", ls[4]),
                    PrepareItem("", ls[5]),
                    PrepareItem(String.Format("{0:.##}", Document.Total - Document.NdsV), ls[6]));
                break;
            case 2:
                s = string.Format("{0}{1}{2}{3}{4}{5}{6}",
                    PrepareItem("", ls[0]),
                    PrepareItem(Company.CardNds, ls[1]),
                    PrepareItem(Document.DocumentNumber, ls[2]),
                    PrepareItem(String.Format("{0:MMddyy}", Document.Date), ls[3]),
                    PrepareItem("", ls[4]),
                    PrepareItem("", ls[5]),
                    PrepareItem(String.Format("{0:.##}", Document.NdsV), ls[6]));
                break;
            case 3: // payment item
                var pi = Payments[n];
                s = string.Format("{0}{1}{2}{3}{4}{5}{6}{7}{8}",
                    PrepareItem(pi.TypeID==1 ? Company.KupatChecks : Company.KupatCash, ls[0]),
                    PrepareItem(Customer.CardID, ls[1]),
                    PrepareItem(pi.TypeID==1 ? pi.Check : "", ls[2]),
                    PrepareItem(String.Format("{0:MMddyy}", Document.Date), ls[3]),
                    PrepareItem("", ls[4]),
                    PrepareItem(pi.TypeID == 1 ? String.Format("{0:MMddyy}", Document.Date) : String.Format("{0:MMddyy}", pi.Date), ls[5]),
                    PrepareItem(String.Format("{0:.##}", pi.Total), ls[6]),
                    PrepareItem("", ls[7]),
                    PrepareItem(pi.TypeID==1
                        ? string.Format("{0}, {1}, {2}", pi.BankCode.ToString(), pi.BranchCode.ToString(), pi.Account.ToString()) 
                        : "", ls[0]));
                break;
            default:
                break;
        }
        return s;
    }

    private string PrepareItem(object o, int n)
    {
        var s = Convert.ToString(o);
        var res = "";
        var emp = " ";
        if (s.Length > n) 
            res = s.Substring(0, n);
        else
            res = s;
        if (res.Length < n)
        {
            res = string.Format("{0}{1}", res, emp.Repeat(n - res.Length));
        }
        return res;
    }
}

public static class StringExtensions
{
    public static string Repeat(this char chatToRepeat, int repeat)
    {

        return new string(chatToRepeat, repeat);
    }
    public static string Repeat(this string stringToRepeat, int repeat)
    {
        var builder = new StringBuilder(repeat * stringToRepeat.Length);
        for (int i = 0; i < repeat; i++)
        {
            builder.Append(stringToRepeat);
        }
        return builder.ToString();
    }
}

public class FormatUnitItem
{
    public int Start { get; set; }
    public int End { get; set; }
    public string Key { get; set; }
}