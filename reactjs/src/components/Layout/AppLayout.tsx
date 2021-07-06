import './Layout.less';

import * as React from 'react';

import { Redirect, Switch, Route, RouteComponentProps } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Layout } from 'antd';
import ProtectedRoute from '../../components/Router/ProtectedRoute';
import SiderMenu from '../../components/SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
import Breadcrumb from '../Breadcrumb'; 
import AppComponentBase from '../AppComponentBase';

export interface IAppLayoutProps extends RouteComponentProps { 
}
export interface IAppLayoutState {
  collapsed: boolean;
}
 
class AppLayout extends AppComponentBase<IAppLayoutProps> { 
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }; 
  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };
 
  render() {
    const {
      history,
      location: { pathname },
    } = this.props;
  
    const homePath : string = appRouters.find((x : any) => x.name === "myprojects")?.path ?? "/dashboard";
    const notFoundPath : string = (appRouters.find((x : any) => x.name === "exception")?.path + "?type=404") ?? "/";
  
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <DocumentTitle title={utils.getPageTitle(pathname)} />

        <Header collapsed={this.state.collapsed} toggle={this.toggle} /> 
        <SiderMenu onCollapse={this.onCollapse} history={history} collapsed={this.state.collapsed} />

        <div className={"blur-filter " + (this.state.collapsed ? "" : "blur-filter-on")} onClick={()=>this.onCollapse(true)}></div>

        <Layout className={"header-margin " + (this.state.collapsed ? "sider-margin-m" : "sider-margin")}>
          <Layout.Content className="content-margin">
            <Breadcrumb history={{...history}}/> 
            
            <Switch>
              {pathname === '/' && <Redirect from="/" to={homePath} />}
              {appRouters
                .filter((item: any) => !item.isLayout)
                .map((route: any, index: any) => (
                  <Route
                    exact
                    key={index}
                    path={route.path}
                    render={(props) => {  
                      return <ProtectedRoute component={route.component} permission={route.permission} />
                    }}
                  />
                ))}
              {pathname !== '/' && <Redirect to={notFoundPath} />}
            </Switch>
          </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;
