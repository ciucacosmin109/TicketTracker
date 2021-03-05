import './index.less';

import * as React from 'react';

import { Button, Card, Col, Form, Input, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined, UserAddOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormInstance, Rule } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';
import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState';
import rules from './index.validation';

const FormItem = Form.Item;
declare var abp: any;

const MultiTenancyEnabled : boolean = abp.multiTenancy.isEnabled;
const TopMargin : number = 50;

export interface ILoginProps {
  authenticationStore?: AuthenticationStore; 
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Register extends React.Component<ILoginProps> {
  formRef = React.createRef<FormInstance>();
  changeTenant = async () => {
    let tenancyName = this.formRef.current?.getFieldValue('tenancyName');
    const { loginModel } = this.props.authenticationStore!;

    if (!tenancyName) {
      abp.multiTenancy.setTenantIdCookie(undefined);
      window.location.href = '/';
      return;
    } else {
      await this.props.accountStore!.isTenantAvailable(tenancyName);
      const { tenant } = this.props.accountStore!;
      switch (tenant.state) {
        case TenantAvailabilityState.Available:
          abp.multiTenancy.setTenantIdCookie(tenant.tenantId);
          loginModel.tenancyName = tenancyName;
          loginModel.toggleShowModal();
          window.location.href = '/';
          return;
        case TenantAvailabilityState.InActive:
          Modal.error({ title: L('Error'), content: L('TenantIsNotActive') });
          break;
        case TenantAvailabilityState.NotFound:
          Modal.error({ title: L('Error'), content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName) });
          break;
      }
    }
  };

  handleSubmit = async (values: any) => {
    await this.props.accountStore!.register(values);

    window.location.href = '/';
  };

  public render() {
    let from  = { pathname: '/' };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    const { loginModel } = this.props.authenticationStore!;
    return (
      <Form onFinish={this.handleSubmit} ref={this.formRef}>
        {MultiTenancyEnabled ? (
          <Row style={{ marginTop: TopMargin }}>
            <Col span={10} offset={7}> 
              <Card>
                <Row>
                  {!!this.props.sessionStore!.currentLogin.tenant ? (
                    <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                      <Button type="link" onClick={loginModel.toggleShowModal}>
                        {L('CurrentTenant')} : {this.props.sessionStore!.currentLogin.tenant.tenancyName}
                      </Button>
                    </Col>
                  ) : (
                    <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                      <Button type="link" onClick={loginModel.toggleShowModal}>
                        {L('NotSelected')}
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          </Row>
        ) : ''}
           
        <Row>
          <Modal
            visible={loginModel.showModal}
            onCancel={loginModel.toggleShowModal}
            onOk={this.changeTenant}
            title={L('ChangeTenant')}
            okText={L('OK')}
            cancelText={L('Cancel')}
          >
            <Row> 
              <Col span={24}>
                <FormItem name={'tenancyName'}>
                  <Input placeholder={L('TenancyName')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                </FormItem>
                {!this.formRef.current?.getFieldValue('tenancyName') ? <div>{L('LeaveEmptyToSwitchToHost')}</div> : ''}
              </Col>
            </Row>
          </Modal>
        </Row>
        <Row style={{ marginTop: (MultiTenancyEnabled ? 10 : TopMargin) }}>
          <Col span={10} offset={7}> 
            <Card>
              <div style={{ textAlign: 'center' }}>
                <h3>{L('WelcomeMessage')}</h3>
              </div>
              <br />

              <Row>
                <Col span={12}>
                  <FormItem name={'name'} rules={rules.name}>
                    <Input placeholder={L('Name')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem name={'surname'} rules={rules.surname}>
                    <Input placeholder={L('Surname')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  </FormItem>
                </Col>
              </Row>

              <FormItem name={'userName'} rules={rules.userName}>
                <Input placeholder={L('UserName')} prefix={<SmileOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
              </FormItem>

              <FormItem name={'emailAddress'} rules={rules.emailAddress as Rule[]}>
                <Input placeholder={L('EmailAddress')} prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
              </FormItem> 
 
              <FormItem name={'password'} rules={rules.password}>
                <Input placeholder={L('Password')} prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
              </FormItem>

              <FormItem name={'password2'} rules={rules.password2} dependencies={['password']} >
                <Input placeholder={L('ConfirmPassword')} prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
              </FormItem>

              <Row style={{ margin: '0px 0px 10px 0px' }}>
                <Col span={12}> 
                  <a href="/user/login">
                    <Button type="dashed" danger icon={<UserOutlined />}>{L('LogIn')}</Button>
                  </a>
                </Col>
                 
                <Col span={12}>
                  <Button type="primary" style={{ float: 'right' }} htmlType={'submit'} icon={<UserAddOutlined />}>
                    {L('Register')}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Register;
