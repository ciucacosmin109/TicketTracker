import './SideUserInfo.less'
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';

import * as React from 'react';

import { Avatar } from 'antd'; 
 
import Stores from '../../../stores/storeIdentifier'; 
import SessionStore from '../../../stores/sessionStore';
import AccountStore from '../../../stores/accountStore';
import { inject, observer } from 'mobx-react';

import profilePicture from '../../../images/user.png';
import { DatabaseOutlined, UserOutlined } from '@ant-design/icons'; 
import { RouteComponentProps, withRouter } from 'react-router-dom';
 
declare var abp: any;
const MultiTenancyEnabled : boolean = abp.multiTenancy.isEnabled;

export interface ISideUserInfoProps extends RouteComponentProps {
  sessionStore?: SessionStore; 
  accountStore?: AccountStore; 
  collapsed?: boolean; 
}
 
@inject(Stores.SessionStore, Stores.AccountStore)
@observer
class SideUserInfo extends React.Component<ISideUserInfoProps> {   

  async componentDidMount(){
    await this.props.accountStore?.getAccount();
    await this.props.sessionStore?.getCurrentLoginInformations();  
  }

  userInfo = () => {
    this.props.history.push("account");
  }

  render() { 
    const {collapsed} = this.props;
    
    const {userName, name} = this.props.accountStore?.account!; 
    const ten = this.props.sessionStore?.currentLogin.tenant; 
 
    const tn = ten ? ten.tenancyName : 'HOST';
 
    return ( 
      <div className={"side-user " + (collapsed ? "side-user-collapsed" : "")} onClick={this.userInfo}>
        <Avatar className={"side-avatar"} shape="circle" src={profilePicture} /> 

        <div className="side-info-2"> 
          <div>{name}</div> 
          {MultiTenancyEnabled ? 
            <div>
              <DatabaseOutlined style={{marginRight: '6px'}}/>
              <span>{tn}</span>
            </div> 
          :
            <div>
              <UserOutlined style={{marginRight: '6px'}}/>
              <span>{userName}</span>
            </div> 
          }
        </div>
      </div>
    );
  }
}

export default withRouter(SideUserInfo);
