using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Entities;
using TicketTracker.Entities.Static;

namespace TicketTracker.EntityFrameworkCore.Seed.Demo {
    public class DemoTicketCreator {
        private readonly TicketTrackerDbContext _context;
        private readonly int _tenantId;

        public DemoTicketCreator(TicketTrackerDbContext context, int tenantId) {
            _context = context;
            _tenantId = tenantId;
        }

        // Project 1
        public List<Ticket> GetTickets11(long creatorUserId) {
            var fileCreator = new DemoAttachmentCreator(_context, _tenantId);
            return new List<Ticket> {
                new Ticket {
                    Title = "Butonul de iesire din cont dispare cand schimb parola",
                    Description = "Atunci când este schimbata parola contului curent, butonul de ieșire din cont nu mai este vizibil. Ca sa poti iesi din cont, trebuie sa dai intai refresh la pagina in care esti si va aparea butonul.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),

                    Comments = new List<Comment> {
                        new Comment {
                            Content = "Eu nu am folosit butonul ala niciodata 😂",
                            CreatorUserId =  creatorUserId
                        }
                    },
                    Attachments = fileCreator.GetAttachments1(creatorUserId),
                },
                new Ticket {
                    Title = "Posibilitatea schimbarii limbii",
                    Description = "Ca utilizator as vrea sa pot schimba limba interfeței printr-un buton pentru a avea o experienta cat mai buna. 😇",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.FEATURE,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.VERY_LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Closed),

                    Comments = new List<Comment> {
                        new Comment {
                            Content = "E inutila ...",
                            CreatorUserId =  creatorUserId
                        }
                    },
                },
                new Ticket {
                    Title = "Instalarea unei componente de editare de text",
                    Description = "Se dorește integrarea componentei deja dezvoltate, TinyMce, care sa editeze notițele studenților și sa le salveze in format html.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.OTHER,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Deployment),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.InDevelopment),
                },
                new Ticket {
                    Title = "Testarea componentei de editare de text",
                    Description = "Sa se testeze componenta de editare de text din cadrul unei notite prin teste unitare.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.OTHER,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Testing),
                    Priority = TicketPriority.HIGH,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.New),
                },
                new Ticket {
                    Title = "Adaugari multiple de notite pe conexiuni slabe de internet",
                    Description = "Cand apas pe butonul de adăugare notite ar trebui ca acesta sa se dezactiveze deoarece cererea la Backend poate dura mai mult și utilizatorul poate sa mai apese odata pe buton.<br/><br/>Aceasta acțiune va duce la inserarea aceleiași notite de 2 ori..",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.New),

                    Attachments = fileCreator.GetAttachments2(creatorUserId),
                },
            };
        }
        public List<Ticket> GetTickets12(long creatorUserId) {
            var fileCreator = new DemoAttachmentCreator(_context, _tenantId);
            return new List<Ticket> {
                new Ticket {
                    Title = "Proiectarea stărilor entității Notita",
                    Description = "Se dorește înțelegerea de către ceilalți dezvoltatori a procesului de schimbare a stărilor unei notite printr-o diagrama de stare.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.OTHER,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Design),
                    Priority = TicketPriority.VERY_HIGH,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.InDevelopment),
                },
                new Ticket {
                    Title = "Documentarea rutelor interfețelor de comunicare cu aplicațiile client",
                    Description = "Pentru ca alti dezvoltatori sa poata crea aplicatii pe baza API-ului aplicatiei noastre, trebuie ca acestia sa inteleaga cum se poate folosi. Aceasta documentatie ne va ajuta si pe noi in viitor, cand va trebui sa schimbam interfata cu utilizatorul.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.OTHER,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Documentation),
                    Priority = TicketPriority.HIGH,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.InDevelopment),
                },
                new Ticket {
                    Title = "Serverul nu returneaza data crearii materiilor dintr-un grup",
                    Description = "Serverul nu returneaza data crearii materiilor dintr-un grup.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.InDevelopment),
                },
            };
        }
        public List<Ticket> GetTickets13(long creatorUserId) {
            var fileCreator = new DemoAttachmentCreator(_context, _tenantId);
            return new List<Ticket> {
                new Ticket {
                    Title = "Tabela noua cu abonamentele studenților la notite",
                    Description = "Ca dezvoltator as vrea sa pot stoca abonamentele studenților la notite<br/><br/>Ar trebui sa existe o tabela de legatura între student si notita care sa contine inregistrari care descriu abonamentul unui student la modificările unei notite.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.FEATURE,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.InDevelopment),
                },
                new Ticket {
                    Title = "Cheia straina NoteId impiedica ștergerea unei notite",
                    Description = "Daca se încearcă ștergerea unei notite din cadrul unei materii, baza de date va returna o eroare deoarece se incalca constrângerea <b>Fk_Notes_Shares_NoteId<b>.<br/><br/>La ștergerea unei notite ar trebui sterse si tulpinile din tabela Shares. 😌",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.VERY_HIGH,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.New),
                },
            };
        }

        // Project 2 
        public List<Ticket> GetTickets21(long creatorUserId) {
            var fileCreator = new DemoAttachmentCreator(_context, _tenantId);
            return new List<Ticket> {
                new Ticket {
                    Title = "Daca dau dublu click pe salvarea proiectului, se adauga 2",
                    Description = "Pe conexiunile mai slabe, unde dureaza mai mult crearea unui proiect, daca e in curs de creare si mai apas odata, se adauga de 2 ori. butonul ar trebui blocat cand se face salvarea",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),

                    Attachments = fileCreator.GetAttachments2(creatorUserId),
                },
                new Ticket {
                    Title = "Textul tipului de tichet din cadrul tabelelor ocupa prea mult spatiu",
                    Description = "Tabelele ar trebui sa aiba in loc de text iconita tipului de tichet, deoarece textul tipului e afisat in pagina tichetului",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.VERY_LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),
                },
                new Ticket {
                    Title = "Lista cu proiecte trebuie sa afiseze \"Fara rol\" cand utilizatorul este inscris la proiect dar nu are atribuit un rol",
                    Description = "Lista cu proiecte trebuie sa afiseze \"Fara rol\" cand utilizatorul este inscris la proiect dar nu are atribuit un rol",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.FEATURE,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.HIGH,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),
                },
                new Ticket {
                    Title = "Gruparea tichetelor dupa stare",
                    Description = "In cadrul paginii proiectului ar trebui sa existe o zona care imparte tichetele in functie de stare, pentru o regasire mai usoara.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.FEATURE,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.MEDIUM,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.New),
                },
            };
        }
        public List<Ticket> GetTickets23(long creatorUserId) {
            var fileCreator = new DemoAttachmentCreator(_context, _tenantId);
            return new List<Ticket> {
                new Ticket {
                    Title = "Serviciul pentru tichete nu returneaza corect proiectul din care face parte ?",
                    Description = "Pe conexiunile mai slabe, unde dureaza mai mult crearea unui proiect, daca e in curs de creare si mai apas odata, se adauga de 2 ori. butonul ar trebui blocat cand se face salvarea",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),

                    Attachments = fileCreator.GetAttachments2(creatorUserId),
                },
                new Ticket {
                    Title = "Textul tipului de tichet din cadrul tabelelor ocupa prea mult spatiu",
                    Description = "Tabelele ar trebui sa aiba in loc de text iconita tipului de tichet, deoarece textul tipului e afisat in pagina tichetului",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.BUG,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.VERY_LOW,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),
                },
                new Ticket {
                    Title = "Lista cu proiecte trebuie sa afiseze \"Fara rol\" cand utilizatorul este inscris la proiect dar nu are atribuit un rol",
                    Description = "Lista cu proiecte trebuie sa afiseze \"Fara rol\" cand utilizatorul este inscris la proiect dar nu are atribuit un rol",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.FEATURE,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.HIGH,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.Solved),
                },
                new Ticket {
                    Title = "Gruparea tichetelor dupa stare",
                    Description = "In cadrul paginii proiectului ar trebui sa existe o zona care imparte tichetele in functie de stare, pentru o regasire mai usoara.",
                    CreatorUserId = creatorUserId,

                    Type = TicketType.FEATURE,
                    Activity = _context.Activities.FirstOrDefault(x => x.Name == StaticActivityNames.Development),
                    Priority = TicketPriority.MEDIUM,
                    Status = _context.Statuses.FirstOrDefault(x => x.Name == StaticStatusNames.New),
                },
            };
        }
    }
}
