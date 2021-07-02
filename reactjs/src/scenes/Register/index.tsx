import './index.less';

import * as React from 'react';

import { Button, Card, Col, Form, Input, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined, UserAddOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormInstance, Rule } from 'antd/lib/form';
import { getCultureName, L } from '../../lib/abpUtility';
import { Link, Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState';
import rules from './index.validation';
import ReCAPTCHA from 'react-google-recaptcha';
import AppComponentBase from '../../components/AppComponentBase';

const FormItem = Form.Item;
declare var abp: any;

const MultiTenancyEnabled: boolean = abp.multiTenancy.isEnabled; 

export interface IRegisterProps {
    authenticationStore?: AuthenticationStore;
    sessionStore?: SessionStore;
    accountStore?: AccountStore;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Register extends AppComponentBase<IRegisterProps> {
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
        let from = { pathname: '/' };
        if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

        const { loginModel } = this.props.authenticationStore!;
        return (
            <Form onFinish={this.handleSubmit} ref={this.formRef}> 
                {MultiTenancyEnabled ?
                    <Card className="register-card" style={{ maxWidth: 400, margin: '0 auto' }}>
                        <Row> 
                            <Col span={24} offset={0} style={{ textAlign: 'center' }}>
                                <Button type="link" onClick={loginModel.toggleShowModal}>
                                {!!this.props.sessionStore!.currentLogin.tenant 
                                    ? `${L('CurrentTenant')} : ${this.props.sessionStore!.currentLogin.tenant.tenancyName}`
                                    : L('NotSelected')
                                } 
                                </Button>
                            </Col> 
                        </Row>
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
                    </Card> : <></>
                }
                 
                <Card className="register-card" title={
                    <Row>
                        <Col flex="auto">{L('WelcomeMessage')}</Col> 
                        <Col flex="none">{L('Register')}</Col>
                    </Row>
                }> 
                    <Row>
                        <Col flex="auto">
                            <FormItem name={'name'} rules={rules.name}>
                                <Input placeholder={L('Name')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                            </FormItem>
                        </Col>
                        <Col flex="auto">
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

                    <Row>
                        <div style={{margin: '0 auto'}}>
                            <FormItem style={{display: 'inline-block'}} name={'captcha'} rules={rules.captcha}>
                                <ReCAPTCHA
                                    hl={getCultureName()}
                                    sitekey="6LeqHjkbAAAAAETsWDjhN6aLYcWF7I0dsHf3_p7T"
                                />
                            </FormItem>
                        </div>
                    </Row>
 
                    <Row>
                        <Col flex="auto" style={{marginBottom: "20px"}}>
                            <Link to="/user/login">
                                <Button type="dashed" danger icon={<UserOutlined />}>{L('LogIn')}</Button>
                            </Link>
                        </Col>

                        <Col flex="none">
                            <Button type="primary" style={{ float: 'right' }} htmlType={'submit'} icon={<UserAddOutlined />}>
                                {L('Register')}
                            </Button>
                        </Col>
                    </Row>
                </Card> 
            </Form>
        );
    }
}

export default Register;
