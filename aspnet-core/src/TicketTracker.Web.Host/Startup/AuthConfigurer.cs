﻿using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Abp.Runtime.Security;
using TicketTracker.Web.Host.Custom;

namespace TicketTracker.Web.Host.Startup
{
    public static class AuthConfigurer
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            if (bool.Parse(configuration["Authentication:JwtBearer:IsEnabled"]))
            {
                services.AddAuthentication(options => {
                    options.DefaultAuthenticateScheme = "JwtBearer";
                    options.DefaultChallengeScheme = "JwtBearer";
                }).AddJwtBearer("JwtBearer", options => {

                    options.Audience = configuration["Authentication:JwtBearer:Audience"];

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // The signing key must match!
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:JwtBearer:SecurityKey"])),

                        // Validate the JWT Issuer (iss) claim
                        ValidateIssuer = true,
                        ValidIssuer = configuration["Authentication:JwtBearer:Issuer"],

                        // Validate the JWT Audience (aud) claim
                        ValidateAudience = true,
                        ValidAudience = configuration["Authentication:JwtBearer:Audience"],

                        // Validate the token expiry
                        ValidateLifetime = true,

                        // If you want to allow a certain amount of clock drift, set that here
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = CookieOrQueryStringTokenResolver,
                    };
                });
            }
        }  

        /* This method is needed to authorize SignalR javascript client and download requests.
         * SignalR can not send authorization header. So, we are getting it from query string as an encrypted text. */
        private static Task CookieOrQueryStringTokenResolver(MessageReceivedContext context) {
            /*if (!context.HttpContext.Request.Path.HasValue ||
                !context.HttpContext.Request.Path.Value.StartsWith("/signalr") &&
                !context.HttpContext.Request.Path.Value.Contains("/Files/Download") ) {

                // We are just looking for signalr clients or download requests
                return Task.CompletedTask;
            }*/

            // If the request contains the token in headers
            if (context.Token != null) {
                return Task.CompletedTask;
            }
            
            // Get the token from request query
            var qsAuthToken = context.HttpContext.Request.Query["enc_auth_token"].FirstOrDefault();
            if (qsAuthToken != null) { 
                context.Token = SimpleStringCipher.Instance.Decrypt(qsAuthToken, AppConsts.DefaultPassPhrase);
                return Task.CompletedTask;
            }

            // Get the token from cookies
            var tOk = context.HttpContext.Request.Cookies.TryGetValue("Abp.AuthToken", out string token);
            var etOk = context.HttpContext.Request.Cookies.TryGetValue("enc_auth_token", out string encToken);
            if (tOk) {
                context.Token = token;
                return Task.CompletedTask;
            }else if (etOk) {
                context.Token = SimpleStringCipher.Instance.Decrypt(encToken, AppConsts.DefaultPassPhrase);
                return Task.CompletedTask;
            }

            return Task.CompletedTask;
        }
    }
}
