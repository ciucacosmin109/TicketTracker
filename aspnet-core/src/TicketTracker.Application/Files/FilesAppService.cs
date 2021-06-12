using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.ObjectMapping;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Web.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Files.Dto;
using TicketTracker.Authorization.Users;
using TicketTracker.Entities;
using File = TicketTracker.Entities.File;
using TicketTracker.Managers;
using Abp.Authorization;
using TicketTracker.Entities.ProjectAuthorization;
using Abp.Localization;
using Abp.Localization.Sources;
using Microsoft.AspNetCore.Http;

namespace TicketTracker.Files {
    [AbpAuthorize]
    public class FilesAppService : IApplicationService {
        private readonly IRepository<File> repoFiles;
        private readonly IRepository<Ticket> repoTickets;
        private readonly IObjectMapper mapper;
        private readonly IUnitOfWorkManager unitOfWorkManager; 
        private readonly UserManager userManager;
        private readonly TicketManager ticketManager;
        private readonly IAbpSession session;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ILocalizationSource l;

        public FilesAppService( 
            IObjectMapper mapper,
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<File> repoFiles,
            IRepository<Ticket> repoTickets, 
            UserManager userManager,
            TicketManager ticketManager,
            IAbpSession session,
            ILocalizationManager loc,
            IHttpContextAccessor httpContextAccessor) {
             
            this.mapper = mapper;
            this.unitOfWorkManager = unitOfWorkManager;
            this.repoFiles = repoFiles;
            this.repoTickets = repoTickets; 
            this.userManager = userManager;
            this.ticketManager = ticketManager;
            this.session = session;
            this.httpContextAccessor = httpContextAccessor;
            this.l = loc.GetSource(TicketTrackerConsts.LocalizationSourceName);
        }

        public GetFileListOutput GetFileList(GetFileListInput input) {
            List<File> fisiere = repoFiles.GetAllIncluding(x => x.CreatorUser).Where(x => x.TicketId == input.TicketId).ToList();
            List<FileDto> res = mapper.Map<List<FileDto>>(fisiere);

            return new GetFileListOutput {
                TicketId = input.TicketId,
                Files = res
            };
        }
        public async Task<FileDto> Post([FromForm] PostFileInput input) {
            // FromForm are Content-Type: multipart/form-data sau application/x-www-form-urlencoded
            ticketManager.CheckTicketPermission(session.UserId, input.TicketId, StaticProjectPermissionNames.Ticket_AddAttachments);

            if (input.File.Length == 0 || input.File.Length > 10485760) // Maxim 10MB 
                throw new UserFriendlyException(l.GetString("InvalidFile"));

            int fileId = 0;

            using (var ms = new MemoryStream()) {
                input.File.CopyTo(ms);
                
                if (repoFiles.GetAll().Where(x => x.TicketId == input.TicketId && x.Name == input.File.FileName).Count() > 0)
                    throw new UserFriendlyException(l.GetString("ThereIsAlreadyAFileWithThisName"));

                fileId = await repoFiles.InsertAndGetIdAsync(new File {
                    FileBytes = ms.ToArray(),
                    Name = input.File.FileName,
                    TicketId = input.TicketId
                });
                await unitOfWorkManager.Current.SaveChangesAsync();
            }

            return mapper.Map<FileDto>(repoFiles.GetAllIncluding(x => x.CreatorUser).FirstOrDefault(x => x.Id == fileId));
        }
        public async Task Delete(EntityDto<int> input) { 
            long? creatorId = (await repoFiles.GetAsync(input.Id)).CreatorUserId;
            if (session.UserId != creatorId) { 
                ticketManager.CheckTicketPermission(session.UserId, input.Id, StaticProjectPermissionNames.Ticket_ManageAttachments);
            }

            repoFiles.Delete(input.Id);
        }

        [HttpGet, DontWrapResult]
        public IActionResult Download(DownloadFileInput input) { 
            if (repoFiles.Count(x => x.TicketId == input.TicketId) == 0)
                return new NotFoundResult();

            try {
                ticketManager.CheckVisibility(session.UserId, input.TicketId);
            } catch { 
                return new UnauthorizedResult(); 
            }

            try {
                if (input.FileId == null) {
                    List<File> fisiere = repoFiles.GetAll().Where(x => x.TicketId == input.TicketId).ToList();

                    byte[] archiveFile;
                    using (var archiveStream = new MemoryStream()) {
                        using (var archive = new ZipArchive(archiveStream, ZipArchiveMode.Create, true)) {
                            foreach (var file in fisiere) {
                                var zipArchiveEntry = archive.CreateEntry(file.Name, CompressionLevel.Fastest);
                                using (var zipStream = zipArchiveEntry.Open())
                                    zipStream.Write(file.FileBytes, 0, file.FileBytes.Length);
                            }
                        }

                        archiveFile = archiveStream.ToArray();
                    }

                    return new FileStreamResult( new MemoryStream(archiveFile), "application/octet-stream" ) {
                        FileDownloadName = "Ticket" + input.TicketId + "_files.zip"
                    };
                }else {
                    File fisier;
                    try {
                        fisier = repoFiles.Get(input.FileId.Value);
                    }
                    catch { 
                        return new NotFoundResult(); 
                    }

                    if (fisier == null || fisier.TicketId != input.TicketId)
                        return new NotFoundResult();

                    MemoryStream ms = new MemoryStream(fisier.FileBytes);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                    response.Content = new ByteArrayContent(ms.ToArray());
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.Add("x-filename", fisier.Name);

                    return new FileStreamResult( new MemoryStream(fisier.FileBytes), "application/octet-stream" ) {
                        FileDownloadName = fisier.Name
                    };
                }
            } catch {
                return new BadRequestResult();
            }

        }

    }
}
