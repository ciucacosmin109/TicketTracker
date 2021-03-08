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

namespace TicketTracker.Files {
    public class FilesAppService : IApplicationService {
        private readonly IRepository<File> _repoFiles;
        private readonly IRepository<Ticket> _repoTickets;
        private readonly IObjectMapper _mapper;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IAbpSession _abpSession;
        private readonly UserManager _userManager;

        public FilesAppService( 
            IObjectMapper mapper,
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<File> repoFiles,
            IRepository<Ticket> repoTickets,
            IAbpSession abpSession,
            UserManager userManager) {
             
            _mapper = mapper;
            _unitOfWorkManager = unitOfWorkManager;
            _repoFiles = repoFiles;
            _repoTickets = repoTickets;
            _abpSession = abpSession;
            _userManager = userManager;
        }


        [UnitOfWork(IsDisabled = true)]
        public FileDto PostFile([FromForm] PostFileInput input) {
            // FromForm are Content-Type: multipart/form-data sau application/x-www-form-urlencoded
            if (input.File.Length == 0) 
                throw new UserFriendlyException("Invalid file"); 

            Ticket t;
            using (var unitOfWork = _unitOfWorkManager.Begin()) {
                try {
                    t = _repoTickets.Get(input.TicketId);
                }
                catch (Exception ex) {
                    throw new UserFriendlyException(ex.ToString());
                }
                if (t == null)
                    throw new UserFriendlyException("The ticket was not found");

                unitOfWork.Complete();
            }

            using (var ms = new MemoryStream()) {
                input.File.CopyTo(ms);

                try {
                    int id;
                    FileDto result = null;
                    using (var unitOfWork = _unitOfWorkManager.Begin()) {
                        if (_repoFiles.GetAll().Where(x => x.TicketId == input.TicketId && x.Name == input.File.FileName).Count() > 0)
                            throw new UserFriendlyException("There is already a file with that name");

                        id = _repoFiles.InsertAndGetId(new File {
                            FileBytes = ms.ToArray(),
                            Name = input.File.FileName,
                            TicketId = input.TicketId
                        });

                        result = _mapper.Map<FileDto>(_repoFiles.GetAllIncluding(x => x.CreatorUser).FirstOrDefault(x => x.Id == id));

                        unitOfWork.Complete();
                    }

                    return result;
                }
                catch (Exception ex) {
                    throw new UserFriendlyException(ex.ToString());
                }
            }
        }
        public void DeleteFile(EntityDto<int> input) { 
            try {
                _repoFiles.Delete(input.Id); 
            } catch (Exception e) {
                throw new UserFriendlyException(e.ToString());
            }
        }

        [DontWrapResult]
        public IActionResult DownloadFile(DownloadFileInput input) {
            try {
                if (_repoTickets.Get(input.TicketId) == null || _repoFiles.Count(x => x.TicketId == input.TicketId) == 0)
                    return new NotFoundResult();
            } catch { return new NotFoundResult(); }

            try {
                if (input.FileId == null) {
                    List<File> fisiere;
                    fisiere = _repoFiles.GetAll().Where(x => x.TicketId == input.TicketId).ToList();

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

                    return new FileStreamResult(
                        new MemoryStream(archiveFile),
                        "application/octet-stream") {
                        FileDownloadName = "Ticket_" + input.TicketId + "_files.zip"
                    };
                }else {
                    File fisier;
                    try {
                        fisier = _repoFiles.Get(input.FileId.Value);
                    }
                    catch { return new NotFoundResult(); }

                    if (fisier == null || fisier.TicketId != input.TicketId)
                        return new NotFoundResult();

                    MemoryStream ms = new MemoryStream(fisier.FileBytes);
                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

                    response.Content = new ByteArrayContent(ms.ToArray());
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    response.Content.Headers.Add("x-filename", fisier.Name);

                    return new FileStreamResult(
                        new MemoryStream(fisier.FileBytes),
                        "application/octet-stream") {
                        FileDownloadName = fisier.Name
                    };
                }
            } catch (Exception e) {
                return new BadRequestResult();
            }

        }
        public GetFilesInfoOutput GetDocumentFilesInfo(GetFilesInfoInput input) {
            try {
                List<File> fisiere = _repoFiles.GetAllIncluding(x => x.CreatorUser).Where(x => x.TicketId == input.TicketId).ToList();
                List<FileDto> res = _mapper.Map<List<FileDto>>(fisiere);

                return new GetFilesInfoOutput {
                    TicketId = input.TicketId, 
                    Files = res
                };
            }
            catch (Exception e) {
                throw new UserFriendlyException(e.ToString());
            }
        }

    }
}
