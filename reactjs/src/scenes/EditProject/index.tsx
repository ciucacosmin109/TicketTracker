import React from 'react';
import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Empty, Form, Input, message, Modal, Select, Space, Switch, Table, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, FileTextOutlined, 
    FundProjectionScreenOutlined, SaveOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'; 

import rules from './index.validation'
import { FormInstance } from 'antd/lib/form'; 
import { CreateProjectInput } from '../../services/project/dto/createProjectInput';
import Avatar from 'antd/lib/avatar/avatar'; 
import { MinimalUserWithPRolesDto } from '../../services/project/dto/roleDto/minimalUserWithPRolesDto';
import SearchAccount from './components/searchUsers';
import { SearchAccountOutput } from '../../services/account/dto/searchAccountOutput';
import ProjectRoleStore from '../../stores/projectRoleStore';
import projectService from '../../services/project/projectService';
import { RouteComponentProps, withRouter } from 'react-router';
import { appRouters } from '../../components/Router/router.config';
import { ProjectDto } from '../../services/project/dto/projectDto';
import projectUserService from '../../services/projectUser/projectUserService';
import { GetAllProjectUsersInput } from '../../services/projectUser/dto/getAllProjectUsersInput'; 
import { UpdateProjectInput } from '../../services/project/dto/updateProjectInput';
import { EntityDto } from '../../services/dto/entityDto'; 
import UiCard from '../../components/UiCard';
import InfoCard from '../../components/InfoCard';

export interface IEditProjectParams{
    id: string | undefined; 
}
export interface IEditProjectProps extends RouteComponentProps<IEditProjectParams>{
    accountStore?: AccountStore;
    projectRoleStore?: ProjectRoleStore;
}
export interface IEditProjectState{ 
    selectedUsers: SearchAccountOutput[]; // used for details (name, username)
    userRoles: MinimalUserWithPRolesDto[]; // used for id and roles
    creatorId: number; // used to display a warning about the creator of the project

    searchVisible: boolean;
    loading: boolean;
    saving: boolean;
}
 
@inject(Stores.AccountStore, Stores.ProjectRoleStore)
@observer
class EditProject extends AppComponentBase<IEditProjectProps, IEditProjectState> {
    form = React.createRef<FormInstance>();
    state = { 
        selectedUsers: [] as SearchAccountOutput[], 
        userRoles: [] as MinimalUserWithPRolesDto[], 
        creatorId: 0,

        searchVisible: false,
        loading: true,
        saving: false,
    }

    // User management
    onUsersAdded = (users: SearchAccountOutput[]) => {
        const newUsers = users.filter(x => !this.state.selectedUsers.some(y => y.id === x.id));
        const selectedUsers = [...this.state.selectedUsers, ...newUsers];
        const projectUsers = [
            ...this.state.userRoles, 
            ...newUsers.map(x => ({id: x.id} as MinimalUserWithPRolesDto))
        ]

        this.setState({
            searchVisible: false,
            selectedUsers: selectedUsers, 
            userRoles: projectUsers 
        });
    }
    onUserRemoved = (index: number) => {
        this.setState({  
            userRoles: this.state.userRoles?.filter((x, i) => i !== index), 
            selectedUsers: this.state.selectedUsers.filter((x, i) => i !== index),
        }); 
    }

    // Component logic
    setModal = (visible: boolean) => {
        this.setState({searchVisible: visible});
    }
    clearFields = () => {
        this.form.current?.resetFields();
        const currentUser = this.props.accountStore?.account;
        this.setState({
            selectedUsers: [currentUser] as SearchAccountOutput[],
            userRoles: [{...currentUser, roleNames:["ProjectManager"]}] as MinimalUserWithPRolesDto[],
        }); 
    }
    onProjectUpdate = async (formValues: any) => {
        this.setState({saving: true});

        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id  
            await this.update(intId, formValues);
        }else{
            await this.create(formValues);
        }

        this.setState({saving: false});
    }
    onProjectDelete = async () => {
        this.setState({saving: true});

        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 

            Modal.confirm({
                title: L("AreYouSureDeleteProject"),
                icon: <ExclamationCircleOutlined />,
                content: L('ActionCantBeUndone'),
                onOk: async () => {  
                    await projectService.delete({id: intId} as EntityDto); 
                    
                    const myProjectsPath = appRouters.find((x : any) => x.name === 'myprojects')?.path;
                    if(myProjectsPath){
                        this.props.history.replace(myProjectsPath); 
                    }
                    
                    message.success(L("SuccessfullyDeleted")); 
                    this.setState({saving: false});
                },
                onCancel: async () => {  
                    this.setState({saving: false});
                },
            }); 
        } 
        
    }
    create = async (formValues: any) => {
        const project : CreateProjectInput = {
            name: formValues.name,
            description: formValues.description,
            isPublic: formValues.isPublic,
            users: this.state.userRoles
        };

        const res = await projectService.create(project);
        this.clearFields();
        this.goToProject(res.id);
    }
    update = async (id: number, formValues: any) => {
        const project : UpdateProjectInput = {
            id: id,
            name: formValues.name,
            description: formValues.description,
            isPublic: formValues.isPublic, 
            users: this.state.userRoles
        };

        await projectService.update(project);  
        this.goToProject(id);
    }
    goToProject = (id: number) => {
        const projectPath = appRouters.find((x : any) => x.name === 'project')?.path.replace('/:id', `/${id}`); 
        if(projectPath){
            this.props.history.replace(projectPath); 
        }
        
        message.success(L("SavedSuccessfully")); 
    }

    // Role select handlers
    getUserRoles(index: number) : string[] | undefined{ 
        if(this.state.userRoles == null){
            return undefined;
        }

        const user = this.state.userRoles[index];
        return user?.roleNames;
    }
    setUserRoles(index: number, roles: string[]){ 
        if(this.state.userRoles == null){
            return;
        }
        
        const user = this.state.userRoles[index];
        user.roleNames = roles;
        this.forceUpdate();
    }
    isTooltipVisible = (userId: number) : boolean => {
        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id  
            return userId === this.state.creatorId;
        }else{ // create
            const currentUserId = this.props.accountStore?.account.id;
            return userId === currentUserId;
        }
    }
    
    // Load the project details in case of an update
    async componentDidMount() {
        await this.props.projectRoleStore?.getAllWithPermissions();

        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 

            // Get project details
            const project : ProjectDto = await projectService.get({id: intId});
            this.form.current?.setFieldsValue(project);

            // Get project users
            const users = (await projectUserService.getAll({projectId: intId} as GetAllProjectUsersInput)).items;  
            
            const hasPermissions = users.find(x => x.user.id === this.props.accountStore?.account.id)?.roles?.map(x=>x.name)?.includes("ProjectManager");
            this.setState({
                selectedUsers: users.map(x=>x.user) as SearchAccountOutput[],
                userRoles: users.map(x => ({id: x.user.id, roleNames: x.roles?.map(y=>y.name) }) as MinimalUserWithPRolesDto) as MinimalUserWithPRolesDto[],
                creatorId: project.creatorUserId ?? 0,
                loading: hasPermissions ? false : true,
            }); 
            if(!hasPermissions){
                message.error(L("YouDontHaveRequiredPermission")); 
            }
  
        }else{ // create
            
            const currentUser = this.props.accountStore?.account;
            this.setState({
                selectedUsers: [currentUser] as SearchAccountOutput[],
                userRoles: [{...currentUser, roleNames:["ProjectManager"]}] as MinimalUserWithPRolesDto[],
                loading: false,
            });
        }
    }
    render(){  
        const roles = this.props.projectRoleStore?.rolesWithPermissions?.items
                        .map(x => ({value: x.name, label: L(x.name)}));
        
        // Table config
        const noDataLocale = { 
            emptyText: (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={L('NoOtherUsersAdded')}/>
            )
        }; 
        const columns = [ 
            { title: 'User', key:'user', render: (text: any, record: SearchAccountOutput, index: number) =>
                <Space key={index}>
                    <Avatar icon={<UserOutlined />}/>
                    {`
                        ${record.name} ${record.surname}
                        ${record.id === this.props.accountStore?.account.id ? `(${L('You')})` : ""} 
                        ${this.isTooltipVisible(record.id) ? `(${L('Creator')})` : ""} 
                    `}  
                </Space>
            },
            { title: 'Roles', key:'roles', width:'40%', render: (text: any, record: SearchAccountOutput, index: number) =>
                <Tooltip mouseEnterDelay={this.isTooltipVisible(record.id) ? 0.1 : 9000} placement="top" title={L('TheCreatorWillAlwaysHaveProjectManager')}>
                    <Select key={index}
                        mode='multiple'
                        style={{float:'right'}}
                        placeholder={L('SelectRoles')}
                        options={roles}
                        value={this.getUserRoles(index)}
                        onChange={roles => this.setUserRoles(index, roles)}
                    />
                </Tooltip>
            },
            { title: 'Actions', key:'actions', width:'1%', render: (text: any, record: SearchAccountOutput, index: number) =>
                <Button key={index} 
                    disabled={false && this.isTooltipVisible(record.id)}
                    onClick={() => this.onUserRemoved(index)} 
                    icon={<DeleteOutlined style={{
                        color: this.isTooltipVisible(record.id) ? 'orange' : 'red'
                    }} />}
                />
            },
        ];
         
        if(this.props.match.params.id != null){
            this.setCustomTitle(L("EditProject"));
        } 

        // Component content
        return (  
            <Form ref={this.form} onFinish={this.onProjectUpdate} layout="vertical"> 
                <InfoCard text={this.L("InfoEditProject")} />

                <UiCard 
                    loadingBody={this.state.loading}
                    className="edit-project"
                    icon={<FundProjectionScreenOutlined />}
                    title={L('ProjectDetails')}
                    extra={ 
                        <Space>
                            {this.props.match.params.id != null && this.props.accountStore?.account.id === this.state.creatorId
                                ? <Button 
                                    loading={this.state.loading || this.state.saving}
                                    type="primary" 
                                    danger 
                                    onClick={this.onProjectDelete} 
                                    icon={<DeleteOutlined />}>{L('Delete')}</Button> 
                                : <></>
                            }
                            <Button 
                                loading={this.state.loading || this.state.saving}
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />}>{L('Save')}</Button>
                        </Space>
                    } 
                > 
                    <Form.Item label={L('Name')} name={'name'} rules={rules.name}>
                        <Input placeholder={L('Name')} prefix={<FileTextOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                    </Form.Item> 
    
                    <Form.Item label={L('Description')} name={'description'}>
                        <Input.TextArea placeholder={L('Description')} />
                    </Form.Item> 
                        
                    <Form.Item label={L('IsPublic')} name={'isPublic'} valuePropName='checked'> 
                        <Switch /> 
                    </Form.Item> 

                    <Form.Item label={L('Users')}> 
                        <Table size='small' 
                            showHeader={false} 
                            rowKey={x=>x.id} 
                            pagination={{
                                hideOnSinglePage: true
                            }}
                            scroll={{x: true}}
                            locale={noDataLocale} 
                            dataSource={this.state.selectedUsers} 
                            columns={columns} 
                            footer={() =>
                                <Button 
                                    type='dashed'
                                    style={{width: '100%'}}
                                    onClick={()=>this.setModal(true)} 
                                    icon={<UserAddOutlined />}>
                                    
                                    {L('AddUsers')}
                                </Button> 
                            }
                        /> 
                    </Form.Item> 
                </UiCard> 
                <SearchAccount visible={this.state.searchVisible} onOk={this.onUsersAdded} onCancel={()=>this.setModal(false)}/>  
            </Form> 
        );
    }
}
 
export default withRouter(EditProject);