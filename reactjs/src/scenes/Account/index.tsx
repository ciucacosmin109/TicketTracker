import * as React from 'react'; 

import { Button, Col, Form, Input, message, Row } from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore'; 
import { KeyOutlined, LockOutlined, MailOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'; 

import rules from './index.validation'
import { FormInstance, Rule } from 'antd/lib/form';
import { UpdateAccountInput } from '../../services/account/dto/updateAccountInput'; 
import UiCard from '../../components/UiCard';

export interface IAccountProps {
  accountStore?: AccountStore;
}
 
@inject(Stores.AccountStore) 
@observer
class Account extends AppComponentBase<IAccountProps> {  
  updateForm = React.createRef<FormInstance>();
  changePassForm = React.createRef<FormInstance>();

  componentDidMount() {
    this.props.accountStore!.getAccount();
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
    const { loading, saving, account } = this.props.accountStore!; 
    this.updateForm.current?.setFieldsValue(account);

    return (
      <Row> 
        <Col flex="1 1 400px">
            <Form ref={this.updateForm} initialValues={account ?? undefined} onFinish={this.onAccountUpdate} layout="vertical"> 
                <UiCard
                    loadingBody={loading}
                    icon={<UserOutlined />}
                    title={L('AccountDetails')}
                    extra={
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={saving || loading}
                        >{L('Save')}</Button>
                    } 
                > 
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
                    
                </UiCard>
            </Form>  
        </Col>

        <Col flex="1 1 400px">
          <Form ref={this.changePassForm} onFinish={this.onPasswordUpdate} layout="vertical">  
            <UiCard 
                loadingBody={loading}
                icon={<KeyOutlined />}
                title={L('ChangePassword')}
                extra={
                    <Button 
                        type="primary" 
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={saving || loading}
                    >{L('Save')}</Button>
                }
            >  
                <Form.Item label={L('CurrentPassword')} name={'currentPassword'} rules={rules.required}>
                    <Input placeholder={L('CurrentPassword')} prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
                </Form.Item> 
                <Form.Item label={L('NewPassword')} name={'newPassword'} rules={rules.password} >
                    <Input placeholder={L('NewPassword')} autoComplete="new-password" prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
                </Form.Item>  
            </UiCard>
          </Form> 
        </Col>
        
      </Row>
    );
  }
}

export default Account;
