import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col , Row,   Space, Spin,   } from 'antd';
import { AppstoreAddOutlined, AppstoreOutlined, CalendarOutlined, EditOutlined, LoadingOutlined, LockFilled, ProjectFilled, UserOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router'; 
import ProjectStore from '../../stores/projectStore';
import ProjectUserStore from '../../stores/projectUserStore';
import ComponentStore from '../../stores/componentStore';
import UserList from './components/userList';
import ComponentTable from './components/componentTable';
import EditComponent from './components/editComponent';
import ProfileAvatar from '../../components/SiderMenu/components/profileAvatar';

export interface IProjectParams{
    id: string | undefined; 
}
export interface IProjectProps extends RouteComponentProps<IProjectParams> {
    accountStore?: AccountStore;
    projectStore?: ProjectStore;
    projectUserStore?: ProjectUserStore;
    componentStore?: ComponentStore;
}
export interface IProjectState {  
    loading: boolean;
    modal: boolean;
}
 
@inject(
    Stores.AccountStore, 
    Stores.ProjectStore, 
    Stores.ProjectUserStore, 
    Stores.ComponentStore)
@observer
class Project extends AppComponentBase<IProjectProps, IProjectState> {
    state = {  
        loading: true,
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
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const intId = parseInt(id);
 
            await this.props.projectStore?.getProject(intId);
            await this.props.projectUserStore?.getAll(intId);
            await this.props.componentStore?.getAll(intId);
 
            this.setState({loading: false});
        } else { // hmmm
            this.props.history.replace('/exception?type=404');
        }
    }
    render(){   
        const project = this.props.projectStore?.project; 
        const myProfile = this.props.accountStore?.account; 
        const myRoles = this.props.projectUserStore?.projectUsers
                        ?.find(x => x.id === myProfile?.id)
                        ?.roleNames; 
        const projectIdOk = project != null && 
                            this.props.match.params.id != null && 
                            (project.id === parseInt(this.props.match.params.id));
                

        // Component content
        return ( 
            <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}> 
                <Card className="project ui-card"
                    title={
                        <Row>
                            <Col flex="auto">  
                                <Space> 
                                    {project?.isPublic
                                        ? <ProjectFilled style={{color:"#1da57a"}}/> 
                                        : <LockFilled style={{color:"orange"}}/> }
                                    {`${project?.name} (#${project?.id})`}
                                </Space> 
                            </Col>
                            <Col flex="none">
                                <Button type="primary" onClick={() => this.editProject(project?.id ?? 0)} icon={<EditOutlined />}>{L('Edit')}</Button>
                            </Col>
                        </Row> 
                    }
                >   
                    <Row style={{marginBottom: '15px'}}> 
                        {project?.description}  
                    </Row> 
                    <Row> 
                        <Space>
                            <CalendarOutlined />
                            {`${L('Created')}: ${new Date(project?.creationTime!).toLocaleString("ro-RO")}`}  
                        </Space>
                    </Row>
                    {project?.lastModificationTime ? 
                        <Row> 
                            <Space>
                                <EditOutlined />
                                {`${L('Modified')}: ${new Date(project?.lastModificationTime!).toLocaleString("ro-RO")}`}  
                            </Space>
                        </Row> : <></>
                    }    
                </Card>
                <Card className="project-extras ui-card"
                    title={<Space> 
                        <UserOutlined />
                        {L("Users")}
                    </Space>}
                >
                    <Space direction="vertical" size="middle">  
                        <Space> 
                            <ProfileAvatar showToolTip firstName={myProfile?.name ?? L("You")} lastName={myProfile?.surname} userId={myProfile?.id} />
                             
                            {myRoles?.map(x => L(x)).join(", ")}
                        </Space>  

                        {projectIdOk 
                            ? <UserList projectId={project!.id ?? 0} />
                            : <></>
                        } 
                    </Space>
                </Card>     
                <Card className="project-components ui-card"
                    title={
                        <Row>
                            <Col flex="auto">  
                                <Space> 
                                    <AppstoreOutlined style={{color: 'purple'}} />    
                                    {this.L('Components')}
                                </Space> 
                            </Col>
                            <Col flex="none">
                                <Button type="primary" onClick={() => this.setModal(true)} icon={<AppstoreAddOutlined />}>
                                    {L('AddComponent')}
                                </Button>
                            </Col>
                        </Row> 
                    }
                >    
                    <Row>  
                        {projectIdOk 
                            ? <ComponentTable key={project?.id} projectId={project!.id} editEnabled />
                            : <></>
                        }  
                    </Row>
                        {projectIdOk 
                            ? <EditComponent
                                visible={this.state.modal}
                                projectId={project!.id}
                                onOk={() => this.setModal(false)}
                                onCancel={() => this.setModal(false)}
                            />
                            : <></>
                        }  
                </Card>
            </Spin>  
        ); 
    }
}
 
export default withRouter(Project);