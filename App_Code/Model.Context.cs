﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Core.Objects;
using System.Linq;

public partial class DBInvoiceEntities : DbContext
{
    public DBInvoiceEntities()
        : base("name=DBInvoiceEntities")
    {
    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        throw new UnintentionalCodeFirstException();
    }

    public virtual DbSet<tbUserCompany> tbUserCompanies { get; set; }
    public virtual DbSet<tbCustomer> tbCustomers { get; set; }
    public virtual DbSet<tbUserCustomer> tbUserCustomers { get; set; }
    public virtual DbSet<tbCompanyCustomer> tbCompanyCustomers { get; set; }
    public virtual DbSet<tbProduct> tbProducts { get; set; }
    public virtual DbSet<tbCompany> tbCompanies { get; set; }
    public virtual DbSet<tbDocumentType> tbDocumentTypes { get; set; }
    public virtual DbSet<tbDocumentNumber> tbDocumentNumbers { get; set; }
    public virtual DbSet<tbUser> tbUsers { get; set; }
    public virtual DbSet<tbCommon> tbCommons { get; set; }
    public virtual DbSet<tbDocumentProduct> tbDocumentProducts { get; set; }
    public virtual DbSet<tbDocumentPayment> tbDocumentPayments { get; set; }
    public virtual DbSet<tbBranch> tbBranches { get; set; }
    public virtual DbSet<tbBank> tbBanks { get; set; }
    public virtual DbSet<vDocCompAndType> vDocCompAndTypes { get; set; }
    public virtual DbSet<tbUserDocument> tbUserDocuments { get; set; }
    public virtual DbSet<tbDocumentsDoc> tbDocumentsDocs { get; set; }

    public virtual ObjectResult<spGetUserData_Result> spGetUserData(Nullable<int> uid)
    {
        var uidParameter = uid.HasValue ?
            new ObjectParameter("uid", uid) :
            new ObjectParameter("uid", typeof(int));

        return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<spGetUserData_Result>("spGetUserData", uidParameter);
    }

    public virtual ObjectResult<spGetDocNumeration_Result> spGetDocNumeration(Nullable<int> cid)
    {
        var cidParameter = cid.HasValue ?
            new ObjectParameter("cid", cid) :
            new ObjectParameter("cid", typeof(int));

        return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<spGetDocNumeration_Result>("spGetDocNumeration", cidParameter);
    }
}
