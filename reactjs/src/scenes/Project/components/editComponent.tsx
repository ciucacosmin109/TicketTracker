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
import componentService from '../../../services/component/componentService';
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
    loading: boolean;
}

@inject(Stores.ComponentStore)
@observer 
class EditComponent extends AppComponentBase<IEditComponentProps, IEditComponentState> {
    form = React.createRef<FormInstance>();
    state = {
        loading: false, 
    }

    resetModal = () => {
        this.form.current?.resetFields();
        this.setState({
            loading: false, 
        });
    }
    onOk = async () => { 
        this.setState({loading: true});
        const values = this.form.current?.getFieldsValue();
        console.log(values);

        if(this.props.componentId){ // edit
            await this.props.componentStore?.update({id: this.props.componentId, ...values} as UpdateComponentInput);
        }else{ 
            await this.props.componentStore?.create({projectId: this.props.projectId, ...values} as CreateComponentInput);
        }

        this.resetModal();
        this.setState({loading: false});
        this.props.onOk();
    }
    onCancel = () => {
        this.resetModal();
        this.props.onCancel();
    }

    async componentDidMount(){
        if(this.props.componentId){ // edit
            this.setState({loading: true});
            let component = await componentService.get({id: this.props.componentId});

            this.form.current?.setFieldsValue(component);
            this.setState({loading: false});
        }
    }

    render() {   
        return (
            <Modal 
                className="edit-component" 
                title={this.props.componentId ? L('EditComponent') : L('AddComponent')} 
                visible={this.props.visible} 
                confirmLoading={this.state.loading}
                onOk={this.onOk} 
                onCancel={this.onCancel} 
                cancelText={L('Cancel')}>
                
                <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}> 
                    <Form ref={this.form} layout="vertical">
                        <Form.Item label={L('Name')} name={'name'} rules={rules.name}> 
                            <Input placeholder={L('Name')} prefix={<AppstoreAddOutlined style={{ color: 'lightgray' }}/>} />
                        </Form.Item>
                        <Form.Item label={L('Description')} name={'description'} rules={rules.name}> 
                            <Input.TextArea placeholder={L('Description')} rows={4} />
                        </Form.Item>  
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
export default EditComponent;