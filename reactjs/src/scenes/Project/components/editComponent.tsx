import React from 'react'; 
import { AppstoreAddOutlined, LoadingOutlined, } from '@ant-design/icons';
import { Form, Input, Modal, Spin } from 'antd';
import { FormInstance } from 'antd/lib/form'; 
import { inject, observer } from 'mobx-react';  
import AppComponentBase from '../../../components/AppComponentBase';
import { L } from '../../../lib/abpUtility'; 
import ComponentStore from '../../../stores/componentStore';
import Stores from '../../../stores/storeIdentifier';
import rules from './editComponent.validation';
//import componentService from '../../../services/component/componentService';
import { CreateComponentInput } from '../../../services/component/dto/createComponentInput';
import { UpdateComponentInput } from '../../../services/component/dto/updateComponentInput';

export interface IEditComponentProps {
    componentStore?: ComponentStore;

    projectId: number;
    componentId?: number;

    visible: boolean; 
    onOk: () => void;
    onCancel: () => void;
}
export interface IEditComponentState { 
}

@inject(Stores.ComponentStore)
@observer 
class EditComponent extends AppComponentBase<IEditComponentProps, IEditComponentState> {
    form = React.createRef<FormInstance>(); 

    resetModal = () => {
        this.form.current?.resetFields();
    }
    onOk = async () => { 
        await this.form.current?.validateFields();  
        const values = this.form.current?.getFieldsValue(); 

        if(this.props.componentId){ // edit
            this.props.componentStore?.update({id: this.props.componentId, ...values} as UpdateComponentInput);
        }else{ 
            this.props.componentStore?.create({projectId: this.props.projectId, ...values} as CreateComponentInput);
        } 

        this.props.onOk(); 
        this.resetModal(); 
    }
    onCancel = () => {  
        this.props.onCancel();
        this.resetModal();
    }

    async componentDidMount(){  
        if(this.props.componentId){ // edit 
            if(this.props.componentStore?.component?.id !== this.props.componentId){
                this.props.componentStore?.get(this.props.componentId);
            } 
        }
    }

    render() { 
        const loading = this.props.componentStore?.loading;
        const component = this.props.componentStore?.component;  
        const isComponentOk = component && component?.id === this.props.componentId;

        const modalForm = (
            <Form ref={this.form} layout="vertical" 
                initialValues={isComponentOk ? component : undefined}>

                <Form.Item label={L('Name')} name={'name'} rules={rules.name}> 
                    <Input placeholder={L('Name')} prefix={<AppstoreAddOutlined style={{ color: 'lightgray' }}/>} />
                </Form.Item>
                <Form.Item label={L('Description')} name={'description'} rules={rules.name}> 
                    <Input.TextArea placeholder={L('Description')} rows={4} />
                </Form.Item>  
            </Form>
        );

        return (
            <Modal 
                className="edit-component" 
                title={this.props.componentId ? L('EditComponent') : L('AddComponent')} 
                visible={this.props.visible} 
                confirmLoading={loading}
                onOk={this.onOk} 
                onCancel={this.onCancel} 
                cancelText={L('Cancel')}>
                
                <Spin spinning={loading} size='large' indicator={<LoadingOutlined />}> 
                    {isComponentOk || !this.props.componentId ? modalForm : <></>}
                </Spin>
            </Modal>
        );
    }
}
export default EditComponent;