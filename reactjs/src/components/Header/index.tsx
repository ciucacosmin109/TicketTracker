import './index.less';

import * as React from 'react';

import { Avatar, Button, /*Badge,*/ Col, Layout, Row, Space } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import Logo from '../../images/logo.png'; 
import LanguageSelect from '../LanguageSelect';
import UserOptions from '../UserOptions'; 
import { L } from '../../lib/abpUtility';


export interface IHeaderProps {
  collapsed?: any;
  toggle?: any;
  noUser?: boolean;
}
 
export class Header extends React.Component<IHeaderProps> {
  render() {
    return ( 
      <Layout.Header style={{ position: 'fixed', zIndex: 11, width: '100%', background: '#fff', minHeight: 52, padding: 0 }}>
        <Row className='header-container'> 
          <Col style={{ textAlign: 'left' }} span={12}>
            {this.props.collapsed != null && this.props.toggle != null ? 
              this.props.collapsed ? (
                <Button type="dashed" className="trigger" icon={<MenuUnfoldOutlined />} onClick={this.props.toggle} /> 
              ) : (
                <Button type="dashed" className="trigger" icon={<MenuFoldOutlined />} onClick={this.props.toggle} /> 
              )
            :
              <></>
            }
            <Space >
              <Avatar className="logo" shape="square" src={Logo} />
              <div className="logo-name">{L("AppName")}</div>
            </Space>
          </Col>
          
          <Col style={{ padding: '0px 5px 0px 5px', textAlign: 'right' }} span={12}>  
            <LanguageSelect noUser={this.props.noUser}/> 

            {!this.props.noUser ?  
              <UserOptions /> : <></>
            }
          </Col>
        </Row>  
      </Layout.Header>
    );
  }
}

export default Header;
