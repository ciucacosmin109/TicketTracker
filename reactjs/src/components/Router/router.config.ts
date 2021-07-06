import LoadableComponent from './../Loadable/index';
import { 
  //HomeOutlined, 
  UserOutlined, TagsOutlined, AppstoreOutlined, 
  FundProjectionScreenOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  FileOutlined, 
} from '@ant-design/icons';

export interface IRoute {
  path: string;
  name: string;
  title: string;
  
  exact?: boolean;
  permission?: string;

  icon?: any;
  component: any;

  isLayout?: boolean;
  showInMenu?: boolean;
}

export const userRouter: IRoute[] = [
  {
    path: '/user',
    exact: true,
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../../components/Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    exact: true,
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../scenes/Login')),
    showInMenu: false,
  },
  {
    path: '/user/register',
    exact: true,
    name: 'register',
    title: 'Register',
    component: LoadableComponent(() => import('../../scenes/Register')),
    showInMenu: false,
  },
];

export const appRouters: IRoute[] = [
  {
    path: '/',
    exact: true,
    name: 'home',
    permission: '',
    title: 'Home',
    component: LoadableComponent(() => import('../../components/Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
  }, 
  {
    path: '/logout',
    exact: true,
    permission: '',
    title: 'Logout',
    name: 'logout',
    showInMenu: false,
    component: LoadableComponent(() => import('../../components/Logout')),
  }, 
  {
    path: '/exception', // ?type
    exact: true,
    permission: '',
    title: 'Exception',
    name: 'exception',
    icon: ExclamationCircleOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Exception')),
  }, 
  {
    path: '/account',
    exact: true,
    permission: '',
    title: 'Account', 
    name: 'account',
    icon: UserOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Account')),
  }, 
  /*{
    path: '/dashboard',
    exact: true,
    permission: '',
    title: 'Dashboard',
    name: 'dashboard',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
  }, */
  {
    path: '/myprojects',
    exact: true,
    permission: '',
    title: 'AssignedProjects',
    name: 'myprojects',
    icon: FundProjectionScreenOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/MyProjects')),
  }, 
  {
    path: '/publicprojects',
    exact: true,
    permission: '',
    title: 'PublicProjects',
    name: 'publicprojects',
    icon: FundProjectionScreenOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Projects')),
  },
  {
    path: '/mytickets',
    exact: true,
    permission: '',
    title: 'AssignedTickets',
    name: 'mytickets',
    icon: FileTextOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/MyTickets')),
  },
  {
    path: '/tenants',
    exact: true,
    permission: 'Pages.Tenants',
    title: 'Tenants',
    name: 'tenant',
    icon: AppstoreOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Tenants')),
  },
  {
    path: '/users',
    exact: true,
    permission: 'Pages.Users',
    title: 'Users',
    name: 'user',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Users')),
  },
  {
    path: '/roles',
    exact: true,
    permission: 'Pages.Roles',
    title: 'Roles',
    name: 'role',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Roles')),
  },
  {
    path: '/myprojects/new',
    exact: true,
    permission: '',
    title: 'NewProject',
    name: 'newproject', 
    icon: FundProjectionScreenOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditProject')),
  },
  {
    path: '/myprojects/edit/:id',
    exact: true,
    permission: '',
    title: 'EditProject',
    name: 'editproject', 
    icon: FundProjectionScreenOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditProject')),
  }, 
  {
    path: '/project/:id',
    exact: true,
    permission: '',
    title: 'Project',
    name: 'project', 
    icon: FundProjectionScreenOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Project')),
  }, 
  {
    path: '/component/:id',
    exact: true,
    permission: '',
    title: 'Component',
    name: 'component', 
    icon: AppstoreOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Component')),
  },
  ///////////////////////// 
  {
    path: '/ticket/:id',
    exact: true,
    permission: '',
    title: 'Ticket',
    name: 'ticket', 
    icon: FileOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Ticket')),
  },
  {
    path: '/tickets/edit/:id',
    exact: true,
    permission: '',
    title: 'EditTicket',
    name: 'editticket', 
    icon: FileOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditTicket')),
  }, 
  {
    path: '/tickets/new', // ?componentId
    exact: true,
    permission: '',
    title: 'NewTicket',
    name: 'newticket', 
    icon: FileOutlined,
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditTicket')),
  },
];

export const routers = [...userRouter, ...appRouters];
