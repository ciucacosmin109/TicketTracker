import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import ProjectStore from './projectStore';
import ProjectUserStore from './projectUserStore';
import ProjectRoleStore from './projectRoleStore';
import ComponentStore from './componentStore';
import TicketStore from './ticketStore';
import WorkStore from './workStore';
import CommentStore from './commentStore';

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),

    projectStore: new ProjectStore(), 
    projectUserStore: new ProjectUserStore(), 
    projectRoleStore: new ProjectRoleStore(), 
    componentStore: new ComponentStore(), 
    ticketStore: new TicketStore(), 
    workStore: new WorkStore(), 
    commentStore: new CommentStore(), 
  };
}
