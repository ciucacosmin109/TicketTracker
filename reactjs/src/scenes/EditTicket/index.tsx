import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 
import rules from './index.validation'

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Spin } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, FileOutlined, 
    FileTextOutlined, LoadingOutlined, SaveOutlined } from '@ant-design/icons'; 

import { RouteComponentProps, withRouter } from 'react-router';  
import { EntityDto } from '../../services/dto/entityDto'; 
import TicketStore from '../../stores/ticketStore'; 
import { TicketPriority } from '../../services/ticket/dto/ticketPriority';
import { TicketType } from '../../services/ticket/dto/ticketType';  
import ActivityStore from '../../stores/activityStore';
import StatusStore from '../../stores/statusStore'; 
import AccountStore from '../../stores/accountStore';
import TicketInfo from '../Ticket/components/ticketInfo';
import { CreateTicketInput } from '../../services/ticket/dto/createTicketInput';
import { UpdateTicketInput } from '../../services/ticket/dto/updateTicketInput';

export interface IEditTicketParams{
    id: string | undefined;
}
export interface IEditTicketProps extends RouteComponentProps<IEditTicketParams>{
    ticketStore?: TicketStore; 
    activityStore?: ActivityStore; 
    statusStore?: StatusStore; 
    accountStore?: AccountStore; 
}
export interface IEditTicketState{  
    loading: boolean;
    creatorId: number;
    ticket: UpdateTicketInput;
}
 
@inject(
    Stores.TicketStore,
    Stores.ActivityStore,
    Stores.StatusStore,
    Stores.AccountStore)
@observer
class EditTicket extends AppComponentBase<IEditTicketProps, IEditTicketState> {  
    state = {  
        loading: true,
        creatorId: 0,
        ticket: {
            id: 0, 
            title: "", 
            description: "",
            priority: TicketPriority.NONE,
            type: TicketType.OTHER,

            componentId: 0,  
            statusId: 0,
            activityId: 0,
        } as UpdateTicketInput
    }

    onTicketDelete = async () => {
        Modal.confirm({
            title: L("AreYouSureDeleteTicket"),
            icon: <ExclamationCircleOutlined />,
            content: L('ActionCantBeUndone'),
            onOk: async () => {  
                await this.props.ticketStore?.delete({id: this.state.ticket.id} as EntityDto); 
                
                this.goToComponent(this.state.ticket.componentId); 
                message.success(L("SuccessfullyDeleted")); 
            },
            onCancel() {},
        });  
    }

    save = async () => {
        const id = this.props.match.params.id;
        const compId = this.getQueryParam("componentId");

        if(id != null){ // update
            this.update();
        }else if(compId != null){ // create
            this.create();
        }
    }
    create = async () => {
        const ticket = this.state.ticket;  
        let res = await this.props.ticketStore?.create({
            ...ticket,
            activityId: ticket.activityId === 0 ? undefined : ticket.activityId,
        } as CreateTicketInput);
 
        if(res != null)
            this.goToTicket(res?.id);
        message.success(L("SavedSuccessfully")); 
    }
    update = async () => {
        const ticket = this.state.ticket;
        await this.props.ticketStore?.update({
            ...ticket,
            activityId: ticket.activityId === 0 ? undefined : ticket.activityId,
        } as UpdateTicketInput);
 
        this.goToTicket(this.state.ticket.id);
        message.success(L("SavedSuccessfully")); 
    }

    onInputChange = (property: string, value: any) => { 
        this.setState({
            ticket: {
                ...this.state.ticket,
                [property]: value
            }
        });
    }

    goToTicket = (id: number) => {
        const path : string = this.getPath("ticket").replace('/:id', `/${id}`); 
        this.props.history.replace(path);  
    }
    goToComponent = (id: number) => {
        const path : string = this.getPath("component").replace('/:id', `/${id}`); 
        this.props.history.replace(path); 
    } 
 
    // Load the ticket details when updating
    async componentDidMount() { 
        const id = this.props.match.params.id;
        const compId = this.getQueryParam("componentId");
         
        // Get all possible activities and statuses
        if(this.props.activityStore?.activities == null){
            await this.props.activityStore?.getAll();
        }
        if(this.props.statusStore?.statuses == null){
            await this.props.statusStore?.getAll();
        }

        // Create or update ?
        if(id != null){ // update
            const intId = parseInt(id); 
            await this.props.ticketStore?.get(intId); 

            if(this.props.ticketStore?.ticket != null){
                this.setState({
                    loading: false,
                    creatorId: this.props.ticketStore?.ticket?.creatorUserId ?? 0,
                    ticket: {
                        ...this.props.ticketStore?.ticket,
                        componentId: this.props.ticketStore?.ticket?.component.id,
                        statusId: this.props.ticketStore?.ticket?.status?.id ?? 0,
                        activityId: this.props.ticketStore?.ticket?.activity?.id ?? 0,
                    }
                }); 
            }
        }else if(compId != null){ // create
            this.setState({
                loading: false,
                ticket: {
                    ...this.state.ticket,
                    componentId: parseInt(compId),
                    statusId: this.props.statusStore?.statuses?.items.find(x=>x.name === "New")?.id ?? 0,
                    activityId: 0,
                }
            });
        }else {
            const path = this.getPath("exception") + "?type=404";
            this.props.history.replace(path); 
        }
    }

    static getOptionsFromEnum = (
        enumType: { [i: number]: string }, 
        getIconFunc: ((n: number) => any) | undefined = undefined) 
        : {value: number, label: any}[] => {
        
        const options = [];
        for(let i = 0; i < Object.keys(enumType).length / 2; i++){
            options.push({
                value: i,
                label: <Space>
                    {getIconFunc ? getIconFunc(i) : <></>}
                    {L(enumType[i])}
                </Space>
            });
        }
        return options;
    }
    static getOptionsFromEntity = (        
        list: { id: number, name: string }[], 
        getIconFunc: ((n: {name: string|undefined}|undefined) => any) | undefined = undefined)
        : {value: number, label: any}[] => {
        
        const options = [];
        for(let i = 0; i < list.length; i++){
            options.push({
                value: list[i].id,
                label: <Space>
                    {getIconFunc ? getIconFunc(list[i]) : <></>}
                    {L(list[i].name)}
                </Space>
            });
        }
        return options.sort((x, y) => x.value - y.value);
    }

    render(){
        const priorityOptions = EditTicket.getOptionsFromEnum(TicketPriority, TicketInfo.getPriorityIcon);
        const typeOptions = EditTicket.getOptionsFromEnum(TicketType, TicketInfo.getTypeIcon);
        const activityOptions = EditTicket.getOptionsFromEntity(this.props.activityStore?.activities?.items ?? [], TicketInfo.getActivityIcon);
        const statusOptions = EditTicket.getOptionsFromEntity(this.props.statusStore?.statuses?.items ?? [], TicketInfo.getStatusIcon);

        activityOptions.push({value: 0, label: L("NoActivity")});

        return (
            <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}>   
                <Card className="edit-ticket"
                    title={
                        <Row>
                            <Col flex="auto"> 
                                <Space><FileOutlined />{L('TicketDetails')}</Space>
                            </Col>
                            <Col flex="none">
                                <Space>
                                    {this.state.ticket.id !== 0 && this.props.accountStore?.account.id === this.state.creatorId
                                        ? <Button type="primary" danger onClick={this.onTicketDelete} icon={<DeleteOutlined />}>{L('Delete')}</Button> 
                                        : <></>
                                    }
                                    <Button type="primary" onClick={this.save} icon={<SaveOutlined />}>{L('Save')}</Button>
                                </Space>
                            </Col>
                        </Row> 
                    }
                > 
                    <Form layout="vertical"> 
                        <Form.Item label={L('Title')} rules={rules.name}>
                            <Input 
                                placeholder={L('Title')} 
                                prefix={<FileTextOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" 
                                value={this.state.ticket.title} 
                                onChange={e => this.onInputChange("title", e.target.value)}/>
                        </Form.Item>
                        <Form.Item label={L('Description')}>
                            <Input.TextArea 
                                placeholder={L('Description')} 
                                value={this.state.ticket.description} 
                                onChange={e => this.onInputChange("description", e.target.value)}/>
                        </Form.Item>
 
                        <Form.Item label={L('Type')}>
                            <Select 
                                options={typeOptions} 
                                value={this.state.ticket.type} 
                                onChange={v => this.onInputChange("type", v)}/>
                        </Form.Item>
                        <Form.Item label={L('Priority')}>
                            <Select 
                                options={priorityOptions} 
                                value={this.state.ticket.priority} 
                                onChange={v => this.onInputChange("priority", v)}/>
                        </Form.Item>

                        <Form.Item label={L('Activity')}>
                            <Select 
                                options={activityOptions} 
                                value={this.state.ticket.activityId}  
                                onChange={v => this.onInputChange("activityId", v ?? 0)}/>
                        </Form.Item>
                        <Form.Item label={L('Status')}>
                            <Select 
                                options={statusOptions} 
                                value={this.state.ticket.statusId} 
                                onChange={v => this.onInputChange("statusId", v)}/>
                        </Form.Item> 
                    </Form> 
                </Card>  
            </Spin>  
        ); 
    }
}
 
export default withRouter(EditTicket);