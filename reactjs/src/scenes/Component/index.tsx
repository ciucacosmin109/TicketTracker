import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Row, Space } from 'antd';
import { AppstoreFilled,  CalendarOutlined, EditOutlined, FileAddOutlined, FileTextOutlined, LockOutlined, ProjectOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';  
import ComponentStore from '../../stores/componentStore';
import EditComponent from '../Project/components/editComponent'; 
import TicketTable from './components/ticketTable';
import ProjectUserStore from '../../stores/projectUserStore';
import AccountStore from '../../stores/accountStore';
import { StaticProjectPermissionNames } from '../../models/ProjectUser/StaticProjectPermissionNames';
import InfoCard from '../../components/InfoCard'; 
import UiCard from '../../components/UiCard';

export interface IComponentParams{
    id: string | undefined; 
}
export interface IComponentProps extends RouteComponentProps<IComponentParams> { 
    componentStore?: ComponentStore; 
    projectUserStore?: ProjectUserStore;
    accountStore?: AccountStore;
}
export interface IComponentState {
    editModal: boolean; 
}
 
@inject(
    Stores.ComponentStore,
    Stores.ProjectUserStore, 
    Stores.AccountStore)
@observer
class Component extends AppComponentBase<IComponentProps, IComponentState> {
    state = {
        editModal: false,
    }  
    setEditModal = (visible: boolean) => {
        this.setState({editModal: visible});
    }
    addTicket = (e: any) => {
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const path = this.getPath("newticket") + `?componentId=${id}`;  
            this.props.history.push(path);
        }
    }

    // Load dada
    async componentDidMount() { 
        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 

            this.props.componentStore?.get(intId).then(() => {
                const compProjId = this.props.componentStore?.component?.project.id; 
                if(compProjId != null && compProjId !== this.props.projectUserStore?.projectId){
                    const myUserId = this.props.accountStore?.account?.id;
                    this.props.projectUserStore?.get(myUserId, compProjId);
                } 
            });

        } else {
            this.props.history.replace('/exception?type=404');
        }
    }

    render(){
        const loading = this.props.componentStore?.loading; 
        const component = this.props.componentStore?.component;  
        const isOk = this.props.componentStore?.component?.id === parseInt(this.props.match.params.id!);

        const project = component?.project;   
        const myProfile = this.props.accountStore?.account;

        const canEdit = this.props.projectUserStore?.hasPermission(myProfile?.id, project?.id, StaticProjectPermissionNames.Project_ManageComponents)
                        || myProfile?.id === component?.creatorUserId;
        const canAddTickets = this.props.projectUserStore?.hasPermission(myProfile?.id, project?.id, StaticProjectPermissionNames.Component_AddTickets);
        const canManageTickets = this.props.projectUserStore?.hasPermission(myProfile?.id, project?.id, StaticProjectPermissionNames.Component_ManageTickets);
        
        if(isOk){
            this.setCustomTitle(component?.name);
        }

        // Component content
        return ( 
            <div>
                <InfoCard text={this.L("InfoComponent")} />

                <UiCard
                    loadingTitle={loading || !isOk}
                    loadingBody={loading || !isOk}
                    icon={<AppstoreFilled style={{color: 'purple'}} />}
                    title={`${component?.name} (#${component?.id})`}
                    extra={canEdit ?
                        <Button 
                            type="primary" 
                            onClick={() => this.setEditModal(true)} 
                            icon={<EditOutlined />}
                        > 
                            {L('Edit')}
                        </Button> : <></>
                    } 
                >{component?.description}</UiCard>

                <UiCard loadingBody={loading || !isOk}>   
                    <Row> 
                        <Space>
                            <CalendarOutlined />
                            {`${L('Created')}: ${this.getDateTimeString(component?.creationTime!)}`}  
                        </Space>
                    </Row>
                    {isOk && component?.lastModificationTime ? 
                        <Row> 
                            <Space>
                                <EditOutlined />
                                {`${L('Modified')}: ${this.getDateTimeString(component?.lastModificationTime!)}`}  
                            </Space>
                        </Row> : <></>
                    } 
                    {isOk ?
                        <Row> 
                            <Space> 
                                {project?.isPublic 
                                    ? <ProjectOutlined style={{color:"#1da57a"}}/> 
                                    : <LockOutlined style={{color:"orange"}}/> } 
                                {`${L('Project')}: ${project?.name}`}   
                            </Space>
                        </Row> : <></>
                    }
                </UiCard>    
                <UiCard zeroPadding
                    loadingBody={loading || !isOk}
                    icon={<FileTextOutlined />}
                    title={this.L('Tickets')}
                    extra={canAddTickets ?
                        <Button type="primary" onClick={this.addTicket} icon={<FileAddOutlined />}>
                            {L('AddTicket')}
                        </Button> : <></>
                    } 
                > 
                    {isOk && component ?
                        <TicketTable 
                            key={component!.id} 
                            componentId={component!.id} 
                            editEnabled={canManageTickets} 
                        /> : <></>
                    } 
                </UiCard>
                
                {isOk && component ?
                    <EditComponent 
                        key={component?.id}
                        visible={this.state.editModal}
                        projectId={component?.project?.id}
                        componentId={component?.id}
                        onOk={() => this.setEditModal(false)}
                        onCancel={() => this.setEditModal(false)}
                    /> : <></>
                } 
            </div>  
        ); 
    }
}
 
export default withRouter(Component);