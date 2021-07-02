import './Layout.less';

import * as React from 'react';

import { Redirect, Switch, Route } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Layout } from 'antd';
import ProtectedRoute from '../../components/Router/ProtectedRoute';
import SiderMenu from '../../components/SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';

const { Content } = Layout;

class AppLayout extends React.Component<any> {
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

    const { path } = this.props.match;
    const { collapsed } = this.state;

    const homePath : string = appRouters.find((x : any) => x.name === "myprojects")?.path ?? "/dashboard";
    const notFoundPath : string = (appRouters.find((x : any) => x.name === "exception")?.path + "?type=404") ?? "/";

    const layout = (
      <Layout style={{ minHeight: '100vh' }}>
        <Header collapsed={this.state.collapsed} toggle={this.toggle} /> 
        <SiderMenu path={path} onCollapse={this.onCollapse} history={history} collapsed={collapsed} />
 
        <div className={"blur-filter " + (collapsed ? "" : "blur-filter-on")} onClick={()=>this.onCollapse(true)}></div>

        <Layout className={"header-margin " + (this.state.collapsed ? "sider-margin-m" : "sider-margin")}> 
          <Content className="content-margin">
            <Switch>
              {pathname === '/' && <Redirect from="/" to={homePath} />}
              {appRouters
                .filter((item: any) => !item.isLayout)
                .map((route: any, index: any) => (
                  <Route
                    exact
                    key={index}
                    path={route.path}
                    render={(props) => <ProtectedRoute component={route.component} permission={route.permission} />}
                  />
                ))}
              {pathname !== '/' && <Redirect to={notFoundPath} />}
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
  }
}

export default AppLayout;
