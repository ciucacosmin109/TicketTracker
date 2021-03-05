using System;
using System.Net;
using Abp.AspNetCore.Configuration;
using Abp.AspNetCore.Mvc.ExceptionHandling;
using Abp.AspNetCore.Mvc.Extensions;
using Abp.AspNetCore.Mvc.Results;
using Abp.Authorization;
using Abp.Dependency;
using Abp.Domain.Entities;
using Abp.Events.Bus;
using Abp.Events.Bus.Exceptions;
using Abp.Logging;
using Abp.Reflection;
using Abp.Runtime.Validation;
using Abp.UI;
using Abp.Web.Models;
using Castle.Core.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TicketTracker.Web.Host.Custom {
    public class CustomExceptionFilter : AbpExceptionFilter {
        public CustomExceptionFilter(
            IErrorInfoBuilder errorInfoBuilder, 
            IAbpAspNetCoreConfiguration configuration)
            : base(errorInfoBuilder, configuration) {
            
        }

        protected override int GetStatusCode(ExceptionContext context, bool wrapOnError) {  
            /*if (context.Exception is UserFriendlyException) {
                return (int)HttpStatusCode.OK; // :( trebuie sa intoarca o eroare in frontend
            } */
             
            return base.GetStatusCode(context, wrapOnError); 
        }
    }
}
