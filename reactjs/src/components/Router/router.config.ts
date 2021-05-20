import LoadableComponent from './../Loadable/index';
import { 
  //HomeOutlined, UserOutlined, TagsOutlined, AppstoreOutlined, 
  FundProjectionScreenOutlined, 
} from '@ant-design/icons';

export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../../components/Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../scenes/Login')),
    showInMenu: false,
  },
  {
    path: '/user/register',
    name: 'register',
    title: 'Register',
    component: LoadableComponent(() => import('../../scenes/Register')),
    showInMenu: false,
  },
];

export const appRouters: any = [
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
    permission: '',
    title: 'Logout',
    name: 'logout',
    showInMenu: false,
    component: LoadableComponent(() => import('../../components/Logout')),
  }, 
  {
    path: '/exception', // ?type
    permission: '',
    title: 'Exception',
    name: 'exception',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Exception')),
  }, 
  {
    path: '/account',
    permission: '',
    title: 'Account', 
    name: 'account',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Account')),
  },
  /*{
    path: '/dashboard',
    permission: '',
    title: 'Dashboard',
    name: 'dashboard',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
  }, */
  {
    path: '/myprojects',
    permission: '',
    title: 'AssignedProjects',
    name: 'myprojects',
    icon: FundProjectionScreenOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/MyProjects')),
  }, 
  {
    path: '/projects',
    permission: '',
    title: 'PublicProjects',
    name: 'projects',
    icon: FundProjectionScreenOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Projects')),
  },  
  /*{
    path: '/tenants',
    permission: 'Pages.Tenants',
    title: 'Tenants',
    name: 'tenant',
    icon: AppstoreOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Tenants')),
  },
  {
    path: '/users',
    permission: 'Pages.Users',
    title: 'Users',
    name: 'user',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Users')),
  },
  {
    path: '/roles',
    permission: 'Pages.Roles',
    title: 'Roles',
    name: 'role',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Roles')),
  },*/
  {
    path: '/myprojects/new',
    permission: '',
    title: 'NewProject',
    name: 'newproject', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditProject')),
  },
  {
    path: '/myprojects/edit/:id',
    permission: '',
    title: 'EditProject',
    name: 'editproject', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditProject')),
  }, 
  {
    path: '/project/:id',
    permission: '',
    title: 'Project',
    name: 'project', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Project')),
  }, 
  {
    path: '/component/:id',
    permission: '',
    title: 'Component',
    name: 'component', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Component')),
  },
  ///////////////////////// 
  {
    path: '/ticket/:id',
    permission: '',
    title: 'Ticket',
    name: 'ticket', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Ticket')),
  },
  {
    path: '/tickets/edit/:id',
    permission: '',
    title: 'EditTicket',
    name: 'editticket', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditTicket')),
  }, 
  {
    path: '/tickets/new', // ?componentId
    permission: '',
    title: 'NewTicket',
    name: 'newticket', 
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/EditTicket')),
  },
];

export const routers = [...userRouter, ...appRouters];
