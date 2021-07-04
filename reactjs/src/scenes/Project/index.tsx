import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Col, Row, Space } from 'antd';
import { AppstoreAddOutlined, AppstoreOutlined, AreaChartOutlined, 
    CalendarOutlined, EditOutlined, LockFilled, ProjectFilled, 
    UserOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router'; 
import ProjectStore from '../../stores/projectStore';
import ProjectUserStore from '../../stores/projectUserStore'; 
import UserList from './components/userList';
import ComponentTable from './components/componentTable';
import EditComponent from './components/editComponent'; 
import TicketStore from '../../stores/ticketStore';
import TicketTypeChart from './chartComponents/ticketTypeChart';
import TicketPriorityChart from './chartComponents/ticketPriorityChart';
import TicketStatusChart from './chartComponents/ticketStatusChart';
import {StaticProjectPermissionNames} from '../../models/ProjectUser/StaticProjectPermissionNames';
import InfoCard from '../../components/InfoCard';
import UiCard from '../../components/UiCard';

export interface IProjectParams{
    id: string | undefined; 
}
export interface IProjectProps extends RouteComponentProps<IProjectParams> {
    accountStore?: AccountStore;
    projectStore?: ProjectStore;
    projectUserStore?: ProjectUserStore;
    ticketStore?: TicketStore;
}
export interface IProjectState {
    modal: boolean;
}
 
@inject(
    Stores.AccountStore, 
    Stores.ProjectStore, 
    Stores.ProjectUserStore,
    Stores.TicketStore)
@observer
class Project extends AppComponentBase<IProjectProps, IProjectState> {
    state = {
        modal: false,
    }
    setModal = (visible : boolean) => {
        this.setState({modal: visible});
    }

    editProject = (id: number) => {
        const projectPath : string = this.getPath('editproject').replace('/:id', `/${id}`); 
        this.props.history.push(projectPath);
    } 

    // Load the project details
    async componentDidMount() {
        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 

            this.props.projectStore?.getProject(intId);
            this.props.projectUserStore?.getAll(intId);
            this.props.ticketStore?.getAllByProjectId(intId); 

        } else { 
            this.props.history.replace('/exception?type=404');
        }
    }
    render(){
        const projectLoading = this.props.projectStore?.loading; 
        const myRolesLoading = this.props.projectUserStore?.loading; 
        

        const project = this.props.projectStore?.project;
        const isOk = this.props.projectStore?.project?.id === parseInt(this.props.match.params.id!);

        const myProfile = this.props.accountStore?.account; 
        const myRoles = this.props.projectUserStore?.getMyRoles(myProfile?.id);  
        const tickets = this.props.ticketStore?.projectTickets; 

        const canEdit = this.props.projectUserStore?.hasPermission(myProfile?.id, project?.id, StaticProjectPermissionNames.Project_Edit)
                        || myProfile?.id === project?.creatorUserId;
        const canAddComp = this.props.projectUserStore?.hasPermission(myProfile?.id, project?.id, StaticProjectPermissionNames.Project_AddComponents);
        const canManageComp = this.props.projectUserStore?.hasPermission(myProfile?.id, project?.id, StaticProjectPermissionNames.Project_ManageComponents);

        if(isOk){
            this.setCustomTitle(project?.name);
        }

        // Component content
        return ( 
            <div> 
                <InfoCard text={this.L("InfoProject")} />
                
                <UiCard
                    loadingTitle={projectLoading || myRolesLoading || !isOk} 
                    loadingBody={projectLoading || myRolesLoading || !isOk} 
                    icon={project?.isPublic
                        ? <ProjectFilled style={{color:"#1da57a"}}/> 
                        : <LockFilled style={{color:"orange"}}/>
                    }
                    title={`${project?.name} (#${project?.id})`}
                    extra={canEdit ? 
                        <Button 
                            type="primary" 
                            onClick={() => this.editProject(project?.id ?? 0)} 
                            icon={<EditOutlined />}
                        >
                            {L('Edit')}
                        </Button> : <></>
                    }
                >
                    {project?.description != null && project?.description?.trim() !== "" ? 
                        <Row style={{marginBottom: '15px'}}> 
                            {project?.description}  
                        </Row> : <></>
                    }
                    <Row>
                        <Col flex="auto">
                            <Row> 
                                <Space>
                                    <CalendarOutlined />
                                    {`${L('Created')}: ${this.getDateTimeString(project?.creationTime!)}`}  
                                </Space>
                            </Row>
                            {project?.lastModificationTime ? 
                                <Row> 
                                    <Space>
                                        <EditOutlined />
                                        {`${L('Modified')}: ${this.getDateTimeString(project?.lastModificationTime!)}`}  
                                    </Space>
                                </Row> : <></>
                            }
                            {project?.isAssigned ?
                                <Row>  
                                    <Space>
                                        <UserOutlined />
                                        {myRoles == null || myRoles.length === 0
                                            ? `${L('You')}: ${L("NoRole")}`
                                            : `${L('You')}: ${myRoles?.map(x => L(x)).join(", ")}`
                                        }
                                    </Space> 
                                </Row> : <></>
                            }
                        </Col>
                        <Col flex="none"> 
                            <UserList projectId={project?.id ?? 0} />
                        </Col>
                    </Row>
                </UiCard> 
                
                <UiCard zeroPadding
                    loadingBody={!isOk}
                    icon={<AppstoreOutlined style={{color: 'purple'}} />}
                    title={this.L('Components')}
                    extra={canAddComp ?
                        <Button type="primary" onClick={() => this.setModal(true)} icon={<AppstoreAddOutlined />}>
                            {L('AddComponent')}
                        </Button> : <></>
                    } 
                > 
                    {isOk ? <>
                        <ComponentTable 
                            key={project!.id} 
                            projectId={project!.id} 
                            editEnabled={canManageComp} 
                        /> 
                        <EditComponent
                            visible={this.state.modal}
                            projectId={project!.id}
                            onOk={() => this.setModal(false)}
                            onCancel={() => this.setModal(false)}
                        /> </> : <></>
                    }
                </UiCard>

                <UiCard
                    icon={<AreaChartOutlined style={{color: 'royalblue'}}/>}
                    title={L("Statistics")}
                > 
                    <Row>
                        {/* Baaa, nu stiu de ce, dar fara width: 0, toate cardurile se vad pe cate o linie ... */}
                        {/* Nvm :)) ... */}
                        <Col flex="1 1 300px" style={{width: 0, margin: 5}}>
                            <TicketTypeChart tickets={tickets?.items ?? []} /> 
                        </Col>
                        <Col flex="1 1 500px" style={{width: 0, margin: 5}}>
                            <TicketPriorityChart tickets={tickets?.items ?? []} /> 
                        </Col>
                        <Col flex="1 1 500px" style={{width: 0, margin: 5}}>
                            <TicketStatusChart tickets={tickets?.items ?? []} /> 
                        </Col> 
                    </Row>
                </UiCard>  
            </div>  
        ); 
    }
}
 
export default withRouter(Project);