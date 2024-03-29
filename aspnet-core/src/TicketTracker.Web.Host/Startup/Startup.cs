﻿using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Castle.Facilities.Logging;
using Abp.AspNetCore;
using Abp.AspNetCore.Mvc.Antiforgery;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using TicketTracker.Configuration;
using TicketTracker.Identity;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Json;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Filters;
using TicketTracker.Web.Host.Custom;
using Microsoft.AspNetCore.Mvc;
using Abp.AspNetCore.Mvc.ExceptionHandling;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using Abp.Timing;

namespace TicketTracker.Web.Host.Startup
{
    public class Startup
    {
        private const string _defaultCorsPolicyName = "localhost";

        private const string _apiVersion = "v1";

        private readonly IConfigurationRoot _appConfiguration;

        public Startup(IWebHostEnvironment env)
        {
            _appConfiguration = env.GetAppConfiguration();
        }

        public IServiceProvider ConfigureServices(IServiceCollection services) {
            Clock.Provider = ClockProviders.Utc;

            //MVC
            services.AddControllersWithViews(
                options =>
                {
                    options.Filters.Add(new AbpAutoValidateAntiforgeryTokenAttribute());
                }
            ).AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new AbpMvcContractResolver(IocManager.Instance)
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                };
            });



            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);

            services.AddSignalR();

            // Configure CORS for angular2 UI
            services.AddCors(
                options => options.AddPolicy(
                    _defaultCorsPolicyName,
                    builder => builder
                        .WithOrigins(
                            // App:CorsOrigins in appsettings.json can contain more than one address separated by comma.
                            _appConfiguration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                )
            );

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(_apiVersion, new OpenApiInfo
                {
                    Version = _apiVersion,
                    Title = "TicketTracker API",
                    Description = "TicketTracker",
                    
                    // TermsOfService = new Uri("https://example.com/terms"),
                    // Contact = new OpenApiContact
                    // {
                    //     Name = "TicketTracker",
                    //     Email = string.Empty,
                    //     Url = new Uri("https://twitter.com/aspboilerplate"),
                    // },
                    // License = new OpenApiLicense
                    // {
                    //     Name = "MIT License",
                    //     Url = new Uri("https://github.com/aspnetboilerplate/aspnetboilerplate/blob/dev/LICENSE"),
                    // }
                });
                options.DocInclusionPredicate((docName, description) => true);

                // Define the BearerAuth scheme that's in use
                options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme()
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });
            });

            // Add a custom exception filter :D
            /*services.AddMvc(options => { 
                options.Filters.AddService(typeof(CustomExceptionFilter), order: 1);
            });*/

            // Configure Abp and Dependency Injection
            return services.AddAbp<TicketTrackerWebHostModule>(
                // Configure Log4Net logging
                options => options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig("log4net.config")
                )
            );  
        }


        public void Configure(IApplicationBuilder app,  ILoggerFactory loggerFactory)
        {
            app.UseAbp(options => { options.UseAbpRequestLocalization = false; }); // Initializes ABP framework.

            app.UseCors(_defaultCorsPolicyName); // Enable CORS!

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAbpRequestLocalization();
             

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<AbpCommonHub>("/signalr");
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute("defaultWithArea", "{area}/{controller=Home}/{action=Index}/{id?}");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwagger(c => { c.RouteTemplate = "swagger/{documentName}/swagger.json"; });

            // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
            var basePath = _appConfiguration.GetValue<string>("App:ServerRootAddress", "");
            basePath = basePath.EndsWith("/") ? basePath.RemovePostFix("/") : basePath;
            app.UseSwaggerUI(options =>
            {
                // specifying the Swagger JSON endpoint.
                options.SwaggerEndpoint($"{basePath}/swagger/{_apiVersion}/swagger.json", $"TicketTracker API {_apiVersion}");
                options.IndexStream = () => Assembly.GetExecutingAssembly()
                    .GetManifestResourceStream("TicketTracker.Web.Host.wwwroot.swagger.ui.index.html");
                options.DisplayRequestDuration(); // Controls the display of the request duration (in milliseconds) for "Try it out" requests.  
            }); // URL: /swagger 

            // Remove AbpExceptionFilter :D 
            /*var ops = app.ApplicationServices.GetRequiredService<IOptions<MvcOptions>>().Value;
            var abpExceptionFilter = ops.Filters.FirstOrDefault(f => 
                (f as ServiceFilterAttribute)?.ServiceType == typeof(AbpExceptionFilter)
            );
            ops.Filters.Remove(abpExceptionFilter);*/

        }
    }
}
