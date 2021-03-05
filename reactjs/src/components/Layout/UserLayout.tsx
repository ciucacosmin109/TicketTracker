import './UserLayout.less';

import * as React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import Footer from '../Footer'; 
import { userRouter } from '../Router/router.config';
import utils from '../../utils/utils';
import Header from '../Header';

class UserLayout extends React.Component<any> {
  render() {
    const {
      location: { pathname },
    } = this.props;

    const layout = (
      <Layout style={{ minHeight: '100vh' }} >
        <Header noUser={true}/> 

        <Layout className="header-margin container-w-bg">  
          <Switch>
            {/* {pathname === '/user' && <Redirect from="/user" to="/user/login" />} */}
            {userRouter
              .filter((item: any) => !item.isLayout)
              .map((item: any, index: number) => (
                <Route key={index} path={item.path} component={item.component} exact={item.exact} />
              ))}

            <Redirect from="/user" to="/user/login" />
          </Switch>
        </Layout>
        
        <Footer />
      </Layout>
    );

    return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
  }
}

export default UserLayout;
