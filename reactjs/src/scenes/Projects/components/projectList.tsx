import { FundProjectionScreenOutlined, LockOutlined, PlusOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import AppComponentBase from '../../../components/AppComponentBase';
import { L } from '../../../lib/abpUtility'; 
import { ProjectWithRolesDto } from '../../../services/project/dto/projectWithRolesDto';
import ProjectStore from '../../../stores/projectStore';
import Stores from '../../../stores/storeIdentifier';  
import { appRouters } from '../../../components/Router/router.config';

import './projectList.less';

export enum ProjectCategory { PUBLIC, ASSIGNED }

export interface IProjectListProps {
    projectStore?: ProjectStore; 

    category: ProjectCategory;
    showNewProjectButton?: boolean;
}
export interface IProjectListState { 
}
 
@inject(Stores.ProjectStore)
@observer
export default class ProjectList extends AppComponentBase<IProjectListProps, IProjectListState> {
    componentDidMount(){
        this.props.projectStore?.getAll(); 
    }
    render() {
        const newProjectPath = appRouters.find((x : any) => x.name === 'newproject')?.path;
        const projectPath : string = appRouters.find((x : any) => x.name === 'project')?.path.replace('/:id', '/'); 

        const store = this.props.projectStore;

        const projects = this.props.category === ProjectCategory.ASSIGNED
            ? this.props.projectStore?.assignedProjects 
            : this.props.projectStore?.publicProjects;
        
        return <Card className="project-list ui-card"
            title={
                <Row>
                    <Col flex="auto">   
                        {this.props.category === ProjectCategory.ASSIGNED 
                            ? <><Space><FundProjectionScreenOutlined />{L('AssignedProjects')}</Space></>
                            : <><Space><FundProjectionScreenOutlined />{L('PublicProjects')}</Space></> 
                        } 
                    </Col>
                    {this.props.showNewProjectButton ?
                        <Col flex="none">
                            <Link to={newProjectPath}>
                                <Button type="primary" icon={<PlusOutlined />}>{L('NewProject')}</Button>
                            </Link>
                        </Col> : <></>
                    }
                </Row>  
            }
        >   
            <Row>
                {store?.loading ? 
                    <Col flex="1 1 200px" className="project">
                        <Card type="inner" size="small" loading></Card>
                    </Col>
                :
                    projects?.items.map((x : ProjectWithRolesDto, index: number) =>
                        <Col flex="1 1 200px" className="project" key={index}>
                            <Link to={projectPath + x.id}>
                                <Card type="inner" 
                                    size="small" 
                                    title={
                                        <Space>
                                            {x.isPublic 
                                                ? <ProjectOutlined style={{color:"#1da57a"}}/> 
                                                : <LockOutlined style={{color:"orange"}}/> }  
                                            {x.name} 
                                        </Space>
                                    } 
                                    extra={"#" + x.id}
                                    style={{ height: "100%"}}> 

                                    <Row className="description">{x.description}</Row>
                                    <br />

                                    {x.isAssigned ? 
                                        <Space>
                                            <UserOutlined /> 
                                            {L("You") + ": " + (x.roles.length > 0 
                                                ? x.roles?.map(r => L(r.name)).join(", ")
                                                : L("NoRole")
                                            )}
                                        </Space> : <></>
                                    }
                                    <Row>
                                        <Col flex="auto"> </Col>
                                        <Col flex="none">
                                            {new Date(x.creationTime!).toLocaleDateString("ro-RO")} 
                                        </Col>
                                    </Row>
                                </Card>
                            </Link>
                        </Col>
                    )
                }
            </Row>
        </Card>;
    }
}