
import * as React from 'react';

import { Button, Card, Checkbox, Col, Form, Input, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import ReCAPTCHA from "react-google-recaptcha";

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormInstance } from 'antd/lib/form';
import { getCultureName, L } from '../../lib/abpUtility';
import { Link, Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState';
import rules from './index.validation';
import AppComponentBase from '../../components/AppComponentBase';

const FormItem = Form.Item;
declare var abp: any;

const MultiTenancyEnabled: boolean = abp.multiTenancy.isEnabled; 

export interface ILoginProps {
    authenticationStore?: AuthenticationStore;
    sessionStore?: SessionStore;
    accountStore?: AccountStore;
    history: any;
    location: any;
}
export interface ILoginState {  
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends AppComponentBase<ILoginProps, ILoginState> {
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
        const { loginModel } = this.props.authenticationStore!;
 
        await this.props.authenticationStore!.login(values);
        sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
        
        const { state } = this.props.location;
        window.location = state ? state.from.pathname : '/'; 

    };

    public render() {
        let { from } = this.props.location.state || { from: { pathname: '/' } };
        if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

        const { loginModel } = this.props.authenticationStore!;
        return (
            <Form onFinish={this.handleSubmit} ref={this.formRef}> 
                {MultiTenancyEnabled ?
                    <Card className="login-card">
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
  
                    <Card className="login-card" title={
                        <Row>
                            <Col flex="auto">{L('WelcomeMessage')}</Col> 
                            <Col flex="none">{L('LogIn')}</Col>
                        </Row>
                    }> 
                        <FormItem name={'userNameOrEmailAddress'} rules={rules.userNameOrEmailAddress}>
                            <Input placeholder={L('UserNameOrEmail')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                        </FormItem>

                        <FormItem name={'password'} rules={rules.password}>
                            <Input placeholder={L('Password')} prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" size="large" />
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

                        <FormItem>
                            <Checkbox checked={loginModel.rememberMe} onChange={loginModel.toggleRememberMe} style={{ paddingRight: 8 }} />
                            {L('RememberMe')}  
                        </FormItem>
    
                        <Row>  
                            <Col flex="auto" style={{marginBottom: "20px"}}>
                                <Link to="/user/register">
                                    <Button type="dashed" danger icon={<UserAddOutlined />}>{L('Register')}</Button>
                                </Link>
                            </Col>
                            <Col flex="none">
                                <Button type="primary" htmlType={'submit'} icon={<UserOutlined />}>
                                    {L('LogIn')}
                                </Button>
                            </Col> 
                        </Row>

                    </Card>   
            </Form>
        );
    }
}

export default Login;
