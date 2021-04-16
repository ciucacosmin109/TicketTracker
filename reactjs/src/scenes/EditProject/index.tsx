import * as React from 'react';
import './index.less'

import { Button, Card, Col, Form, Input, Row, Space, Switch } from 'antd';
//import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
//import Stores from '../../stores/storeIdentifier';
//import AccountStore from '../../stores/accountStore'; 
import { FileTextOutlined, FundProjectionScreenOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'; 

import rules from './index.validation'
//import { FormInstance, Rule } from 'antd/lib/form'; 
import { CreateProjectInput } from '../../services/project/dto/createProjectInput';
import Avatar from 'antd/lib/avatar/avatar'; 

export interface IEditProjectProps{

}
export interface IEditProjectState{
    project: CreateProjectInput;
}
 
export default class EditProject extends AppComponentBase<IEditProjectProps, IEditProjectState> {
    state={
        project: {name: "proj 234", description:"hmm", isPublic: true}
    }

    onProjectUpdate = async (values: any) => {
        console.log(values);
    }
    
    render(){
        const proj = {
            name: "proj 234", description:"hmm", isPublic: true
        };
        return ( 
            <Card className="edit-project">
                <Form initialValues={proj} onFinish={this.onProjectUpdate} layout="vertical"> 
                    <Row>
                        <Col flex="auto"> 
                            <h2><Space><FundProjectionScreenOutlined />{L('ProjectDetails')}</Space></h2> 
                        </Col>
                        <Col flex="none">
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>{L('Save')}</Button>
                        </Col>
                    </Row>  
        
                    <Form.Item label={L('Name')} name={'name'} rules={rules.name}>
                        <Input placeholder={L('Name')} prefix={<FileTextOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    </Form.Item> 
    
                    <Form.Item label={L('Description')} name={'description'}>
                        <Input.TextArea placeholder={L('Description')} />
                    </Form.Item> 
                        
                    <Form.Item label={L('IsPublic')} name={'isPublic'} valuePropName='checked'> 
                        <Switch /> 
                    </Form.Item>
 
                    <Form.Item label={L('Users')} name={'users'}>
                        <ul> 
                            <li key={1} className="user">
                                <Avatar icon={<UserOutlined />} />
                                Demo user 1 - Project manager
                            </li> 
                            <li key={2} className="user">
                                <Avatar icon={<UserOutlined />} />
                                Demo user 2 - Developer
                            </li> 
                        </ul>
                    </Form.Item>
         
                </Form>  
            </Card> 
        );
    }
}
 