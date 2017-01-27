<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PreviewB.aspx.cs" Inherits="PreviewB" %>

<!DOCTYPE html>

<html lang="he" dir="rtl">
<head runat="server">
    <meta http-equiv="content-type" charset="utf-8" />
    <title>תצוגת המסמך</title>
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <link href="Content/bootstrap-rtl.css" rel="stylesheet" />
    <%--<link href="Content/metro-icons.css" rel="stylesheet" />--%>

    <link href="Content/custom.min.css" rel="stylesheet" />
   <%-- <link href="Content/filepicker.default.css" rel="stylesheet" />--%>
    <link href="Content/site.css" rel="stylesheet" />

    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <script src="Scripts/packages/modernizr-2.6.2.js"></script>
    <script src="Scripts/packages/jquery-2.0.0.min.js"></script>
    <script src="Scripts/packages/angular.min.js"></script>
    <script src="Scripts/packages/angular-sanitize.min.js"></script>
    <script src="Scripts/packages/bootstrap.min.js"></script>
    <%--<script src="Scripts/packages/metro.js"></script>--%>

    <style>
        body {
            color: black;
        }

        .docItemsTable td {
            padding-right: 5px;
        }

        .preview label, .preview span, .preview td, .preview th, .p-text {
            font-size: 20px !important;
        }

        .preview th,.preview td{
            padding: 5px !important;
        }
    </style>
</head>
<body <% if (!IsForPrint)
         { %>style="background-color:#eeeeee;padding:10px" <% } %>>
    <% if (!IsForPrint)
       { %><div style="width: 1000px; margin: 10px auto; border: 1px solid silver; background-color: white;">
        <% } %>
        <div style="width: 880px; margin: 20px auto; padding: 20px;">
            <form id="form1" runat="server">
                <div class="preview" style="width: 100%;">
                    <div>
                        <div class="row docLogo">
                            
                            <div style="float: right; display:inline-block" class="docLogoTitle">
                                <div style="float: right;">
                                    <h2 style="margin: 20px 0px 20px 0px;font-size: 32px"><%=Company.Name %></h2>
                                    <div class="p-text"><%=Doc.CompanyAddress %>, <%=Doc.CompanyPhone %>, <%=Doc.CompanyMail %></div>
                                </div>
                                <div>
                                    <label  style="width: 120px;">עוסק מורשה: </label>
                                    <span><%=Doc.CompanyIdentificator %></span>
                                </div>
                            </div>
                            <div style="float: left; display:inline-block; position: relative; top: 20px;">
                                <div>
                                <asp:Literal runat="server" ID="uImg"></asp:Literal>
                                </div>
                            </div>
                            <div style="clear: both"></div>
                        </div>
                        <div>
                            <div style="float: right;">
                                <h1 style="margin: 30px 0px 0px 0px;"><asp:Literal runat="server" ID="docTitle"></asp:Literal></h1>
                            </div>
                            <div style="float: left;">
                                <div>
                                    <label>תאריך: </label>
                                    <span><%= Convert.ToDateTime(Doc.Date).ToString("dd/MM/yyyy") %></span>
                                </div>
                                <div>
                                <h1 style="margin: 30px 0px 0px 0px;">
                                    <label style="font-size: 18px;color:#000000">מספר רשום:</label>
                                    <span style="font-size: 18px"><%= Doc.DocumentNumber %></span>
                                    <label style="font-size: 18px;color:#000000;margin-right:10px">סוג:</label>
                                    <span style="font-size: 18px"><%= DocOrigin %></span></h1>
                                </div>
                            </div>
                            <div style="clear: both"></div>
                        </div>

                        <div class="row docToCompany">
                            <div class="divLihvod" style="margin-top: 10px;">
                                <div style="float: right; width: 80px;">
                                    <h2 style="margin: 0px; color: #000000;font-size: 28px;font-weight:normal">לכבוד:</h2>
                                </div>
                                <div style="float: right">
                                    <h2 style="margin: 0px;font-size: 28px;"><%=Doc.CustomerName %></h2>
                                    <div class="p-text"><%=CustAddress %></div>
                                </div>
                                <div style="clear: both"></div>
                            </div>
                        </div>
                        <div class="row docItems" style="min-height: 800px;">
                            <div class="docItemsTable" runat="server" id="docItemsTable">
                                <!-- חשבונית -->
                                <table style="margin-bottom: 20px; width: 100%">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">מס</th>
                                            <th>פירוט</th>
                                            <th style="width: 15%">מחיר</th>
                                            <th style="width: 10%">כמות</th>
                                            <th style="width: 15%">סה"כ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <asp:Repeater runat="server" ID="repItems">
                                            <ItemTemplate>
                                                <tr>
                                                    <td><%# Container.ItemIndex + 1 %></td>
                                                    <td><%#Eval("Name")%><%# Eval("Info").ToString().Trim()=="" || Eval("Info").ToString()=="null" ? "" : (" ," + Eval("Info").ToString().Trim() )%></td>
                                                    <td><%# string.Format("{0:n2}",Eval("Price"))%></td>
                                                    <td><%# string.Format("{0:n2}",Eval("Amount"))%></td>
                                                    <td><%# string.Format("{0:n2}",Eval("Total"))%></td>
                                                </tr>
                                            </ItemTemplate>
                                        </asp:Repeater>
                                        <!-- to pay - temp calculations -->
                                        <tr>
                                            <td colspan="5" style="height:15px; border-right:none; border-left:none;"></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell" colspan="3">סה"כ:</td>
                                            <td><span><%= string.Format("{0:n2}",Total1)%></span></td>
                                        </tr>
                                        <% if (Doc.DiscV > 0)
                                           { %>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell" colspan="3">הנחה <% if ((bool)Doc.DiscPer)
                                                                                     { %><span>(<%= string.Format("{0:n2}",Doc.Discount)%>%):</span><% } %></td>
                                            <td><span><%= string.Format("{0:n2}",Doc.DiscV)%></span></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell" colspan="3">סה"כ אחרי הנחה:</td>
                                            <td><span><%= string.Format("{0:n2}",Total1-(double)Doc.DiscV)%></span></td>
                                        </tr>
                                        <% } %>
                                        <% if ((bool)Doc.NdsInc)
                                           { %>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell" colspan="3">מע"מ <span>(<%= string.Format("{0:n2}",100*Doc.Nds)%>%)</span>:
                                            </td>
                                            <td><span><%= string.Format("{0:n2}",Doc.NdsV) %></span></td>
                                        </tr>
                                        <% } %>
                                        <tr>
                                            <td colspan="5" style="height:15px; border-right:none; border-left:none; border-bottom:none;"></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td colspan="3" style="font-weight: bold">סה"כ לתשלום עד <span><%= Convert.ToDateTime(Doc.DueDate).ToString("dd/MM/yyyy") %></span> (ש"ח):</td>
                                            <td><span><%= string.Format("{0:n2}",Doc.Total) %></span></td>
                                        </tr>
                                    </tfoot>
                                </table>

                            </div>
                            <!-- קבלה -->
                            <div class="docItemsTable" runat="server" id="docPayTable">
                                <div runat="server" id="paySubTitle">
                                    <h2>מאפיני תשלום</h2>
                                </div>
                                <table style="margin-bottom: 10px; width: 100%;">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%">סוג</th>
                                            <th>פרטים</th>
                                            <th style="width: 15%">זמן פרעון</th>
                                            <th style="width: 15%">סכום</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <asp:Repeater runat="server" ID="repPays">
                                            <ItemTemplate>
                                                <tr>
                                                    <td><%#Eval("Type")%></td>
                                                    <td><%#Eval("Description")%></td>
                                                    <td><%# Convert.ToDateTime(Eval("Date")).ToString("dd/MM/yyyy")%></td>
                                                    <td><%# string.Format("{0:n2}",Eval("Total"))%></td>
                                                </tr>
                                            </ItemTemplate>
                                        </asp:Repeater>
                                        <tr>
                                            <td colspan="4" height="15px" style="border-right:none; border-left:none; border-bottom:none; border-top:none;"></td>
                                        </tr>
                                        <tr runat="server" id="payTotal">
                                            <td></td>
                                            <td colspan="2">סה"כ: 
                                            </td>
                                            <td><%= string.Format("{0:n2}",Total2) %></td>
                                        </tr>
                                        <tr runat="server" id="masBamakor">
                                            <td></td>
                                            <td colspan="2">ניקוי מס במקור (<%= string.Format("{0:n2}",(double)Doc.MasBaMakor) %>%):
                                            </td>
                                            <td><%= string.Format("{0:n2}",(double)Doc.MasBaMakor*Total2/100) %></td>
                                        </tr>
                                        <tr runat="server" id="masBamakorSeperator">
                                            <td colspan="4" height="15px" style="border-right:none; border-left:none; border-bottom:none; border-top:none;"></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell" colspan="2">סה"כ (ש"ח):</td>
                                            <td><span><%= string.Format("{0:n2}",Total2*(1-(double)Doc.MasBaMakor/100)) %></span></td>
                                        </tr>
                                    </tfoot>
                                </table>

                            </div>
                            <%-- חשבונית מס מרוכזת --%>
                           <div class="docItemsTable" runat="server" id="docHCItemsTable">
                                    <h2>מאפיני תשלום</h2>
                                </div>
                                <table style="margin-bottom: 10px; width: 100%;">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%">סוג</th>
                                            <th>פרטים</th>
                                            <th style="width: 15%">זמן פרעון</th>
                                            <th style="width: 15%">סכום</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <asp:Repeater runat="server" ID="Repeater1">
                                            <ItemTemplate>
                                                <tr>
                                                    <td><%#Eval("Type")%></td>
                                                    <td><%#Eval("Description")%></td>
                                                    <td><%# Convert.ToDateTime(Eval("Date")).ToString("dd/MM/yyyy")%></td>
                                                    <td><%# string.Format("{0:n2}",Eval("Total"))%></td>
                                                </tr>
                                            </ItemTemplate>
                                        </asp:Repeater>
                                        <tr>
                                            <td colspan="4" height="15px" style="border-right:none; border-left:none; border-bottom:none; border-top:none;"></td>
                                        </tr>
                                        <tr runat="server" id="Tr1">
                                            <td></td>
                                            <td colspan="2">סה"כ: 
                                            </td>
                                            <td><%= string.Format("{0:n2}",Total2) %></td>
                                        </tr>
                                        <tr runat="server" id="Tr2">
                                            <td></td>
                                            <td colspan="2">ניקוי מס במקור (<%= string.Format("{0:n2}",(double)Doc.MasBaMakor) %>%):
                                            </td>
                                            <td><%= string.Format("{0:n2}",(double)Doc.MasBaMakor*Total2/100) %></td>
                                        </tr>
                                        <tr runat="server" id="Tr3">
                                            <td colspan="4" height="15px" style="border-right:none; border-left:none; border-bottom:none; border-top:none;"></td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell" colspan="2">סה"כ (ש"ח):</td>
                                            <td><span><%= string.Format("{0:n2}",Total2*(1-(double)Doc.MasBaMakor/100)) %></span></td>
                                        </tr>
                                    </tfoot>
                                </table>

                            </div>

                            <!-- cancel -->
                            <%--<% if (Doc.DocumentType >= 9 && Doc.DocumentType != 11) // changed by ortal&nofar--%>
                            <% if (Doc.DocumentType >= 9 && Doc.DocumentType != 11  && Doc.DocumentType != 12)
                                { %>
                            <div class="docItemsTable" data-ng-show="newDoc.Type>=9">
                                <table style="margin-bottom: 10px; width: 100%">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">מס</th>
                                            <th>פירוט</th>
                                            <th>סכום</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td><%= Doc.CancelMsg %></td>
                                            <td>0.01</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td class="tot-cell">סה"כ (ש"ח):</td>
                                            <td><span>0.01</span></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <% } %>
                                                            
                            <% if (Doc.Comments.Trim() != "")
                               { %>
                            <div style="margin-bottom: 10px;">
                                <div class="p-text" style="float: right; width: 60px; margin-top: 5px; margin-left:10px">היערות: </div>
                                <div class="p-text" style="float: right">
                                    <span class="help-block"><%= Doc.Comments %></span>
                                </div>
                                <div style="clear: both"></div>
                            </div>
                            <% } %>
                        </div>
                        <%--<div class="row docFooter" style="text-align: center; border-top: 1px solid silver;">
                            מסמך זה הופק ונחתם דיגיטלית ע"י מערכת
        <b>חשבונית-פלוס</b>
                        </div>--%>
                    </div>
                </div>
            </form>
        </div>
        <% if (!IsForPrint)
           { %>
    </div>
    <% } %>
</body>
</html>
