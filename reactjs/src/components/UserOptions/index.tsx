import './index.less'; 

import * as React from 'react';

import { Badge, Button, Dropdown, Menu } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { L } from '../../lib/abpUtility'; 
import { Link } from 'react-router-dom';
 
//import profilePicture from '../../images/user.png';

const nrNotif : number = 0;

export interface IUserOptionsProps {  
}
 
class UserOptions extends React.Component<IUserOptionsProps> { 

  render() {
    const userDropdownMenu = (
      <Menu>
        <Menu.Item key="1">
          <Link to="/account">
            <UserOutlined />
            <span> {L('AccountDetails')}</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/logout">
            <LogoutOutlined />
            <span> {L('Logout')}</span>
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={userDropdownMenu} placement="bottomRight" trigger={['click']}> 
          <Button type="dashed" size="large" style={{border: 0, height:"100%", marginLeft: '5px'}} icon={
            <Badge count={nrNotif} size="small">
              <UserOutlined />
              {/* <Avatar style={{height: 28, width:28, margin: '0 auto' }} shape="circle" alt={'profile'} src={profilePicture} /> */}
            </Badge> 
          } />  
      </Dropdown> 
    );
  }
}

export default UserOptions;
