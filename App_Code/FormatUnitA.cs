using Newtonsoft.Json;//
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for FormatUnitA
/// </summary>
public class FormatUnitA : FormatUnit
{
    //private DBInvoiceEntities DB;
    //private tbUserDocument Document;
    //private tbCustomer Customer;
    //private tbCompany Company;
    //private List<tbDocumentPayment> Payments;
    private List<FormatUnitItem> Items;
    public FormatUnitA(DBInvoiceEntities db, tbUserDocument doc):base(db,doc)
	{  
        var path= string.Format("{0}\\config.json",HttpContext.Current.Server.MapPath("."));
        using (StreamReader r = new StreamReader(path))
        {
            var config = r.ReadToEnd();
            Items = JsonConvert.DeserializeObject<List<FormatUnitItem>>(config);
            
        }
	}

    public List<string> GetDataA()
    {
     //Document =  base.Document;

       
        var list = new List<string>();
        if (Document.DocumentType == 1 || Document.DocumentType == 2 || Document.DocumentType == 4)
        {
            
                list.Add(CreateLineA(1, 0));
        }
        if (Document.DocumentType == 2 || Document.DocumentType == 3)
        {
            for (var i = 0; i < Payments.Count; i++)
                list.Add(CreateLineA(2, i));
        }

        //
        return list;
    }

    private string CreateLineA(int i, int n)
    {
       
       
        string s = new string(' ',333);

        if(i==1)//חשבונית מס 
        foreach (var item in Items)
        {
            switch (item.Key){
                case "Code":
                    string tm="   ";
                    if(Document.NdsInc==true)
                    {
                        tm = Company.CodeA2;
                    }
                    else {
                        tm = Company.CodeA1;
                    }

                   s = s.Remove(item.Start, item.End - item.Start + 1);
                   s = s.Insert(item.Start, PrepareItemA(tm, (item.End - item.Start + 1)));
                    break;
                case "Reference1":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(Document.DocumentNumber.ToString(), (item.End - item.Start + 1)));
                    break;

                case "ReferenceDate":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    string d=String.Format("{0:dd/MM/yyyy}", Document.Date);
                    s = s.Insert(item.Start, PrepareItemA(d, (item.End - item.Start + 1)));
                    break;

                case "TargetDate":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                     string t = String.Format("{0:dd/MM/yyyy}", Document.DueDate);
                     s = s.Insert(item.Start, PrepareItemA(t, (item.End - item.Start + 1)));
                    break;

                //case "CurrencyCode":
                //    break;

                case "Comments":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(Document.Comments, (item.End - item.Start + 1)));
                    break;

                case "DebitAccountKey1":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(Customer.CardID, (item.End - item.Start + 1)));
                    break;
                case "CreditAccountKey1":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(Company.CardExp, (item.End - item.Start + 1)));
                    break;
                case "CreditAccountKey2":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(Company.CardNds, (item.End - item.Start + 1)));
                    break;
                case "DebitSum1":
                    //String.Format("{0:.##}", pi.Total)
                    var tot=Document.Total;
                    if (Document.DocumentType == 4) {
                        tot = Document.Total * -1;
                    }

                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(String.Format("{0:0.00}",tot), (item.End - item.Start + 1)));
                    break;
                case "CreditSum1":
                    var sum = Document.Total - Document.NdsV;
                    if (Document.DocumentType == 4)
                    {
                        sum = (Document.Total - Document.NdsV) * -1;
                    }
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(String.Format("{0:0.00}",sum), (item.End - item.Start + 1)));
                    break;
                case "CreditSum2":
                    var nds=Document.NdsV;
                    if (Document.DocumentType == 4)
                    {
                        nds = Document.NdsV * -1;
                    }
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(String.Format("{0:0.00}", nds), (item.End - item.Start + 1)));
                    break;


                case "AutorizationCompanyId":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(Customer.Identificator, (item.End - item.Start + 1)));
                  break;

                default:
                  break;
            } 
            
        }

        else if(i==2)//קבלה
        {
            var pi = Payments[n];
            foreach (var item in Items)
            {
                switch (item.Key)
                {
                    case "Code":
                        string tm;
                        if (Document.NdsInc == true)
                        {
                            tm = Company.CodeA2;
                        }
                        else
                        {
                            tm = Company.CodeA1;
                        }
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        s = s.Insert(item.Start, PrepareItemA("   ", (item.End - item.Start + 1)));
                        break;
                    case "Reference1":
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        
                        s = s.Insert(item.Start, PrepareItemA(Document.DocumentNumber.ToString(), (item.End - item.Start + 1)));
                       

                        
                        break;
                    case "Reference2":
                       
                        if (pi.TypeID == 1)
                        {
                            s = s.Remove(item.Start, item.End - item.Start + 1);
                            s = s.Insert(item.Start, PrepareItemA(pi.Check, (item.End - item.Start + 1)));
                        }

                       


                        break;

                    case "ReferenceDate":
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        string d = String.Format("{0:dd/MM/yyyy}", Document.Date);
                        s = s.Insert(item.Start, PrepareItemA(d, (item.End - item.Start + 1)));
                        break;

                    case "TargetDate":
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        string t = String.Format("{0:dd/MM/yyyy}", pi.Date);
                        s = s.Insert(item.Start, PrepareItemA(t, (item.End - item.Start + 1)));
                        break;

                    //case "CurrencyCode":
                    //    break;

                    case "Comments":
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        s = s.Insert(item.Start, PrepareItemA(Document.Comments, (item.End - item.Start + 1)));
                        break;
                         case "DebitAccountKey1":
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        if (pi.TypeID == 1)
                        {
                            s = s.Insert(item.Start, PrepareItemA(Company.KupatChecks, (item.End - item.Start + 1)));
                        }
                        
                        else
                        {
                            s = s.Insert(item.Start, PrepareItemA(Company.KupatCash, (item.End - item.Start + 1)));
                        }
                   
                    break;

                         case "CreditAccountKey1":
                    s = s.Remove(item.Start, item.End - item.Start + 1);

                    s = s.Insert(item.Start, PrepareItemA(Customer.CardID,(item.End - item.Start + 1)));
                    break;
                         case "DebitSum1":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(String.Format("{0:0.00}", pi.Total), (item.End - item.Start + 1))); 
                    break;
                         case "CreditSum1":
                    s = s.Remove(item.Start, item.End - item.Start + 1);
                    s = s.Insert(item.Start, PrepareItemA(String.Format("{0:0.00}", pi.Total), (item.End - item.Start + 1)));
                    break;
                    case "AutorizationCompanyId":
                        s = s.Remove(item.Start, item.End - item.Start + 1);
                        s = s.Insert(item.Start, PrepareItemA(Customer.Identificator, (item.End - item.Start + 1)));
                        break;

                    default:
                        break;
                }

            }
        }
        //Console.WriteLine(s.Length);
        System.Diagnostics.Debug.WriteLine(s.Length);
        return s;
    }



     private string PrepareItemA(object o, int n)
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
