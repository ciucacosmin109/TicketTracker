using Abp.AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketTracker.Configuration.Ui;

namespace TicketTracker.Configuration.Dto { 
    [AutoMap(typeof(UiThemeInfo))]
    public class UiThemeInfoDto {
        public string Name { get; }
        public string CssClass { get; }
    }
}
