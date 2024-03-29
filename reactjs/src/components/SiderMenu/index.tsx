import './index.less';

import * as React from 'react';
import H from 'history';

import { /*Avatar, Col,*/ Layout, Menu } from 'antd';
import { L, isGranted } from '../../lib/abpUtility';

// import AbpLogo from '../../images/abp-logo-long.png';
import { appRouters } from '../../components/Router/router.config';
import utils from '../../utils/utils';

import SideUserInfo from './components/SideUserInfo';

export interface ISiderMenuProps {
  collapsed: boolean;
  onCollapse: any;
  history: H.History;
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse } = props;
  const currentRoute = utils.getRoute(history.location.pathname);

  return ( 
    <Layout.Sider  
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        zIndex: 10,
        paddingTop: 70
      }}
      trigger={null} className={'sidebar ' + (collapsed ? 'sidebar-collapsed' : '')} width={256} 
      collapsible collapsed={collapsed} onCollapse={onCollapse}>
      
      <SideUserInfo collapsed={collapsed} /> 
      <Menu mode="inline" selectedKeys={[currentRoute ? currentRoute.path : '']}>
        <Menu.Divider />

        {appRouters
          .filter((item: any) => !item.isLayout && item.showInMenu)
          .map((route: any, index: number) => {
            if (route.permission && !isGranted(route.permission)) return null;

            return (
              <Menu.Item key={route.path} onClick={() => history.push(route.path)}>
                {route.icon != null ? <route.icon /> : <></>}
                <span>{L(route.title)}</span>
              </Menu.Item>
            );
          })}
      </Menu>
    </Layout.Sider>
  );
};

export default SiderMenu;
