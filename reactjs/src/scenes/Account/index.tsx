import * as React from 'react'; 

import { Button, Card,  Col,  Form,  Input, message, Row, Space } from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore'; 
import { KeyOutlined, LockOutlined, MailOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'; 

import rules from './index.validation'
import { FormInstance, Rule } from 'antd/lib/form';
import { UpdateAccountInput } from '../../services/account/dto/updateAccountInput'; 
import { GetAccountOutput } from '../../services/account/dto/getAccountOutput';

export interface IAccountProps {
  accountStore: AccountStore;
}
export interface IAccountState {
  account: GetAccountOutput;
}
 
@inject(Stores.AccountStore) 
@observer
class Account extends AppComponentBase<IAccountProps, IAccountState> {  
  changePassForm = React.createRef<FormInstance>();

  async componentDidMount() {
    await this.props.accountStore.getAccount(); 
    this.setState({account: this.props.accountStore.account})
  }  

  onAccountUpdate = async (values: any) => {
    await this.props.accountStore!.updateAccount(values as UpdateAccountInput);
    message.success(L("AccountUpdated"));
  };
  onPasswordUpdate = async (values: any) => { 
    await this.props.accountStore!.changePassword(values.currentPassword, values.newPassword);
    message.success(L("AccountUpdated"));
    this.changePassForm.current?.resetFields();
  };
 
  public render() {
    const { account } = this.props.accountStore || this.state.account; 

    return (
      <Row> 
        <Col flex="1 1 400px">
            <Form initialValues={account} onFinish={this.onAccountUpdate} layout="vertical"> 
                <Card className="ui-card" title={
                    <Row>
                        <Col flex="auto"> 
                        <Space><UserOutlined />{L('AccountDetails')}</Space>  
                        </Col>
                        <Col flex="none">
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>{L('Save')}</Button>
                        </Col>
                    </Row>  
                }> 
                    <Form.Item label={L('UserName')} name={'userName'} rules={rules.required}>
                        <Input disabled placeholder={L('UserName')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    </Form.Item> 

                    <Form.Item label={L('Name')} name={'name'} rules={rules.required}>
                        <Input placeholder={L('Name')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    </Form.Item> 
                    <Form.Item label={L('Surname')} name={'surname'} rules={rules.required}>
                        <Input placeholder={L('Surname')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    </Form.Item> 

                    <Form.Item label={L('EmailAddress')} name={'emailAddress'} rules={rules.emailAddress as Rule[]}>
                        <Input placeholder={L('EmailAddress')} prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    </Form.Item> 
                    
                </Card>
            </Form>  
        </Col>

        <Col flex="1 1 400px">
          <Form ref={this.changePassForm} onFinish={this.onPasswordUpdate} layout="vertical">  
            <Card className="ui-card" title={
                <Row>
                    <Col flex="auto"> 
                        <Space><KeyOutlined />{L('ChangePassword')}</Space>
                    </Col>
                    <Col flex="none">
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>{L('Save')}</Button>
                    </Col>
                </Row> 
            }>  
                <Form.Item label={L('CurrentPassword')} name={'currentPassword'} rules={rules.required}>
                    <Input placeholder={L('CurrentPassword')} prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
                </Form.Item> 
                <Form.Item label={L('NewPassword')} name={'newPassword'} rules={rules.password} >
                    <Input placeholder={L('NewPassword')} autoComplete="new-password" prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
                </Form.Item>  
            </Card>
          </Form> 
        </Col>
        
      </Row>
    );
  }
}

export default Account;
