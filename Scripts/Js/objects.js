
var compTemplate = {
    Account: "",
    Street: "",
    City: "",
    Country: "",
    BankName: "",
    Branch: "",
    EAddress: "",
    EBankAddress: "",
    EBankName: "",
    EName: "",
    EPayName: "",
    ESubTitle: "",
    Email: "",
    Fax: "",
    IBAN: "",
    Id: 0, //null - unselected, 0 - new
    Identificator: "",
    Index: "",
    IsArchive: false,
    Mobile: "",
    Name: "",
    PayName: "",
    Phone: "",
    SWIFT: "",
    SubTitle: "",
    Logo: ""
};

var compTabs = [
    ['Name','EName','SubTitle','ESubTitle','Identificator'],
    ['Street','City','Country', 'EAddress', 'Index', 'Email', 'Phone', 'Fax', 'Mobile', 'InvName','InvMail'],
    ['Account','BankName','Branch','EBankAddress','EBankName','EPayName','IBAN','IsArchive','PayName','SWIFT']
]

var custTemplate = {
    Account: "",
    PayName: "",
    AStreet: "",
    ACity: "",
    ACountry: "",
    AIndex: "",
    BankName: "",
    Branch: "",
    CName: "",
    CEmail: "",
    CPhone: "",
    CMobile: "",
    Id: 0, //null - unselected, 0 - new
    Identificator: "",
    IsArchive: false,
    IsActive: true
};

var custTabs = [
    ['Name', 'AStreet', 'ACity', 'ACountry', 'AIndex', 'Identificator', 'IsActive'],
    ['CName', 'CEmail', 'CPhone', 'CMobile'],
    ['Account', 'BankName', 'Branch', 'PayName', 'Account']
]

var itemTemplate = {
    CompanyID: 0,
    Description: "",
    Id: 0,
    IsArchive: false,
    Makat: "",
    Name: "",
    Info: "",
    Price: 1
}

var itemTabs = ["CompanyID", "Description", "Name", "Makat", "Price"];



// for company editor 
var compEditConfig = {
    data: [
        {
            tab: "compGeneral",
            label: "שם העסק",
            type: "text",
            param: "Name",
            dir: 'rtl',
            rule: "required",
            message: "שם העסק הינו שדה חובה"
        },
        {
            tab: "compGeneral",
            label: "שם העסק באנגלית",
            type: "text",
            param: "EName",
            dir: 'ltr'//,
            //rule: "required",
            //message: "שם באנגלית הינו שדה חובה"
        },
        {
            tab: "compGeneral",
            label: "כותרת משנה",
            type: "text",
            param: "SubTitle",
            dir: 'rtl'
        },
        {
            tab: "compGeneral",
            label: "כותרת משנה באנגלית",
            type: "text",
            param: "ESubTitle",
            dir: 'ltr'
        },
        {
            tab: "compGeneral",
            label: "מספר עוסק מורשה/ חפ / ת.ז",
            type: "text",
            param: "Identificator",
            dir: 'rtl',
            rule: "required",
            message: "עוסק מורשה/ חפ / ת.ז הינו שדה חובה"
        },
        {
            tab: "compGeneral",
            label: "מס' כרטיס הכנסות",
            type: "text",
            param: "CardExp",
            dir: 'ltr'
        },
         {
             tab: "compGeneral",
             label: "קופת מזומן",
             type: "text",
             param: "KupatCash",
             dir: 'ltr'
         },
          {
              tab: "compGeneral",
              label: "קופת צ'קים",
              type: "text",
              param: "KupatChecks",
              dir: 'ltr'
          },
        {
            tab: "compGeneral",
            label: "מס' כרטיס מע'מ עסקאות",
            type: "text",
            param: "CardNds",
            dir: 'ltr'
        },
        {
            tab: "compGeneral",
            label: "סוג תנועה - ללא מע''מ",
            type: "text",
            param: "CodeA1",
            dir: 'ltr'
        },
          {
              tab: "compGeneral",
              label: "סוג תנועה - מע''מ",
              type: "text",
              param: "CodeA2",
              dir: 'ltr'
          },
        {
            tab: "compCommuniction",
            label: "רחוב ומס' בית",
            type: "text",
            param: "Street",
            dir: 'rtl',
            rule: "required",
            message: "רחוב הינו שדה חובה"
        },
         {
             tab: "compCommuniction",
             label: "עיר",
             type: "text",
             param: "City",
             dir: 'rtl',
             rule: "required",
             message: "עיר הינו שדה חובה"
         },
          {
              tab: "compCommuniction",
              label: "מדינה",
              type: "text",
              param: "Country",
              dir: 'rtl',
              rule: "required",
              message: "מדינה הינו שדה חובה"
          },
         {
             tab: "compCommuniction",
             label: "כתובת באנגלית",
             type: "text",
             param: "EAddress",
             dir: 'ltr'//,
             //rule: "required",
             //message: "כתובת באנגלית הינו שדה חובה"
         },
          {
              tab: "compCommuniction",
              label: "מיקוד",
              type: "text",
              param: "Index",
              dir: 'ltr'//,
              //rule: "required",
              //message: "מיקוד הינו שדה חובה"
          },
           {
               tab: "compCommuniction",
               label: "אימייל",
               type: "email",
               param: "Email",
               dir: 'ltr',
               rule: {
                   required: true,
                   email: true
               },
               message: "אימייל בפורמט תקין הינו שדה חובה"
           },
            {
                tab: "compCommuniction",
                label: "טלפון",
                type: "text",
                param: "Phone",
                dir: 'ltr',
                rule: "required",
                message: "טלפון הינו שדה חובה"
            },
             {
                 tab: "compCommuniction",
                 label: "פקס",
                 type: "text",
                 param: "Fax",
                 dir: 'ltr'
             },
              {
                  tab: "compCommuniction",
                  label: "טלפון נייד",
                  type: "text",
                  param: "Mobile",
                  dir: 'ltr'
              },
              {
                  tab: "compCommuniction",
                  label: "שם השולח",
                  type: "text",
                  param: "InvName",
                  dir: 'rtl'
              },
              {
                  tab: "compCommuniction",
                  label: "כתובת השולח",
                  type: "text",
                  param: "InvMail",
                  dir: 'ltr'//,
                  //rule: {
                  //    email: true
                  //},
                  //message: "פורמט של האימייל אינו תקין"
              },
             {
                tab: "compBank",
                label: "שם המוטב",
                type: "text",
                param: "PayName",
                dir: 'rtl'//,
                //rule: "required",
                //message: "שם המוטב הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "שם בנק",
                 type: "text",
                 param: "BankName",
                 dir: 'rtl'//,
                 //rule: "required",
                 //message: "שם הבנק הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "סניף",
                 type: "text",
                 param: "Branch",
                 dir: 'rtl'//,
                 //rule: "required",
                 //message: "סניף הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "מספר חשבון",
                 type: "text",
                 param: "Account",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "מספר חשבון הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "SWIFT",
                 type: "text",
                 param: "SWIFT",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "SWIFT הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "IBAN",
                 type: "text",
                 param: "IBAN",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "IBAN הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "שם מוטב באנגלית",
                 type: "text",
                 param: "EPayName",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "שם המוטב באנגלית הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "שם בנק באנגלית",
                 type: "text",
                 param: "EBankName",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "שם הבנק באנגלית הינו שדה חובה"
             },
             {
                 tab: "compBank",
                 label: "כתובת בנק באנגלית",
                 type: "text",
                 param: "EBankAddress",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "כתובת הבנק באנגלית הינו שדה חובה"
             }
    ],
    toValidation: function(){
        var v = { rules: {}, messages: {} };
        $.each(this.data, function (i,o) {
            if (o.hasOwnProperty("rule")) {
                v.rules[o["param"]] = o["rule"];
                if (o.hasOwnProperty("message")) {
                    v.messages[o["param"]] = o["message"];
                } else {
                    v.messages[o["param"]] = "שגיאה";
                }
            }
        })
        return v;
    }
};

// for customer editor 
var custEditConfig = {
    data: [
        {
            tab: "custGeneral",
            label: "שם הלקוח",
            type: "text",
            param: "Name",
            short: true,
            dir: 'rtl',
            rule: "required",
            message: "שם העסק הינו שדה חובה"
        },
        {
            tab: "custGeneral",
            label: "מספר עוסק מורשה/ חפ / ת.ז ",
            type: "text",
            param: "Identificator",
            short: true,
            dir: 'rtl',
            rule: "required",
            message: "עוסק מורשה/ חפ / ת.ז הינו שדה חובה"
        },
        {
            tab: "custGeneral",
            label: "רחוב ומס' בית",
            type: "text",
            param: "AStreet",
            short: true,
            dir: 'rtl',
            //rule: "required",
            message: "רחוב הינו שדה חובה"
        },
         {
             tab: "custGeneral",
             label: "עיר",
             type: "text",
             param: "ACity",
             short: true,
             dir: 'rtl',
             //rule: "required",
             message: "עיר הינו שדה חובה"
         },
          {
              tab: "custGeneral",
              label: "מדינה",
              type: "text",
              param: "ACountry",
              short: true,
              dir: 'rtl',
              //rule: "required",
              message: "מדינה הינו שדה חובה"
          },
          {
              tab: "custGeneral",
              label: "מיקוד",
              type: "text",
              param: "AIndex",
              short: true,
              dir: 'ltr'//,
              //rule: "required",
              //message: "מיקוד הינו שדה חובה"
          },
          {
              tab: "custGeneral",
              label: "מס' כרטיס בהנה'ש",
              type: "text",
              param: "CardID",
              dir: 'ltr'//,
              //rule: "required",
              //message: "מיקוד הינו שדה חובה"
          },
           {
               tab: "custGeneral",
               label: "הערות",
               type: "textarea",
               param: "Comments",
               dir: 'rtl'
           },
           {
               tab: "custGeneral",
               label: "פעיל",
               type: "checkbox",
               param: "IsActive"
           },
          {
              tab: "custCommunication",
              label: "איש קשר",
              type: "text",
              param: "CName",
              dir: 'rtl',
              //rule: "required",
              message: "איש קשר הינו שדה חובה"
          },
           {
               tab: "custCommunication",
               label: "אימייל",
               type: "email",
               param: "CEmail",
               dir: 'ltr',
               rule: {
                   //required: true,
                   email: true
               },
               message: "אימייל בפורמט תקין הינו שדה חובה"
           },
            {
                tab: "custCommunication",
                label: "טלפון",
                type: "text",
                param: "CPhone",
                dir: 'ltr',
                //rule: "required",
                message: "טלפון הינו שדה חובה"
            },
              {
                  tab: "custCommunication",
                  label: "טלפון נייד",
                  type: "text",
                  param: "CMobile",
                  dir: 'ltr'
              },
             {
                 tab: "custBank",
                 label: "שם המוטב",
                 type: "text",
                 param: "PayName",
                 dir: 'rtl'//,
                 //rule: "required",
                 //message: "שם המוטב הינו שדה חובה"
             },
             {
                 tab: "custBank",
                 label: "שם בנק",
                 type: "text",
                 param: "BankName",
                 dir: 'rtl'//,
                 //rule: "required",
                 //message: "שם הבנק הינו שדה חובה"
             },
             {
                 tab: "custBank",
                 label: "סניף",
                 type: "text",
                 param: "Branch",
                 dir: 'rtl'//,
                 //rule: "required",
                 //message: "סניף הינו שדה חובה"
             },
             {
                 tab: "custBank",
                 label: "מספר חשבון",
                 type: "text",
                 param: "Account",
                 dir: 'ltr'//,
                 //rule: "required",
                 //message: "מספר חשבון הינו שדה חובה"
             }
    ],
    toValidation: function () {
        var v = { rules: {}, messages: {} };
        $.each(this.data, function (i, o) {
            if (o.hasOwnProperty("rule")) {
                v.rules[o["param"]] = o["rule"];
                if (o.hasOwnProperty("message")) {
                    v.messages[o["param"]] = o["message"];
                } else {
                    v.messages[o["param"]] = "שגיאה";
                }
            }
        })
        return v;
    }
};

// product item edit config
var itemEditConfig = {
    data: [
        {
            label: "שם הפריט",
            type: "text",
            param: "Name",
            dir: 'rtl',
            rule: "required",
            message: "שם הפריט הינו שדה חובה"
        },
        {
            label: "מחיר",
            type: "number",
            param: "Price",
            dir: 'ltr',
            rule: "required",
            message: "מחיר הינו שדה חובה"
        },
        {
            label: "מק'ט",
            type: "text",
            param: "Makat",
            dir: 'ltr'//,
            //rule: "required",
            //message: "מק'ט הינו שדה חובה"
        },
         //{
         //    label: "בית עסק",
         //    type: "listOfCompanies", // custom element
         //    param: "CompanyID",
         //    dir: 'ltr'
         //},
        {
            label: "תיאור",
            type: "textarea",
            param: "Description",
            dir: 'rtl'
        }
    ],
    toValidation: function () {
        var v = { rules: {}, messages: {} };
        $.each(this.data, function (i, o) {
            if (o.hasOwnProperty("rule")) {
                v.rules[o["param"]] = o["rule"];
                if (o.hasOwnProperty("message")) {
                    v.messages[o["param"]] = o["message"];
                } else {
                    v.messages[o["param"]] = "שגיאה";
                }
            }
        })
        return v;
    }
};


var payEditConfig = {
    data: [
        {
            tab: "compGeneral",
            label: "",
            type: "number",
            param: "Total",
            dir: 'rtl',
            rule: "required",
            message: "סכום הינו שדה חובה"
        }
    ],
    toValidation: function () {
        var v = { rules: {}, messages: {} };
        $.each(this.data, function (i, o) {
            if (o.hasOwnProperty("rule")) {
                v.rules[o["param"]] = o["rule"];
                if (o.hasOwnProperty("message")) {
                    v.messages[o["param"]] = o["message"];
                } else {
                    v.messages[o["param"]] = "שגיאה";
                }
            }
        })
        return v;
    }
};



// override mail validation
//$.validator.methods.email = function (value, element) {
//    return this.optional(element) || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
//}