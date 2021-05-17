import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col , Row,   Space, Spin,   } from 'antd';
import { AppstoreFilled,  CalendarOutlined, EditOutlined, FileAddOutlined, FileTextOutlined, FundOutlined, LoadingOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';  
import ComponentStore from '../../stores/componentStore';
import EditComponent from '../Project/components/editComponent';
import ProjectStore from '../../stores/projectStore';
import TicketTable from './components/ticketTable';

export interface IComponentParams{
    id: string | undefined; 
}
export interface IComponentProps extends RouteComponentProps<IComponentParams> { 
    componentStore?: ComponentStore;
    projectStore?: ProjectStore;
}
export interface IComponentState {  
    loading: boolean; 
    editModal: boolean; 
}
 
@inject(Stores.ComponentStore, Stores.ProjectStore)
@observer
class Component extends AppComponentBase<IComponentProps, IComponentState> {
    state = {  
        loading: true, 
        editModal: false,
    }  
    setEditModal = (visible: boolean) => {
        this.setState({editModal: visible});
    }
    addTicket = (e: any) => {
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const path = this.getPath("newticket").replace(":componentId", "componentId=" + id);  
            this.props.history.push(path);
        }
    }

    // Load dada
    async componentDidMount() { 
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const intId = parseInt(id); 
            await this.props.componentStore?.get(intId);

            const compProjId = this.props.componentStore?.component?.projectId;
            if(compProjId != null && compProjId !== this.props.projectStore?.project?.id){
               await this.props.projectStore?.getProject(compProjId);
            }
 
            this.setState({loading: false});
        } else {
            this.props.history.replace('/exception?type=404');
        }
    }

    render(){
        const component = this.props.componentStore?.component;  
        const project = this.props.projectStore?.project; 
        const componentIdOk = component != null && 
                            this.props.match.params.id != null && 
                            (component.id === parseInt(this.props.match.params.id));

        // Component content
        return ( 
            <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}> 
                <Card className="component ui-card"
                    title={
                        <Row>
                            <Col flex="auto">  
                                <Space> 
                                    <AppstoreFilled style={{color: 'purple'}} />
                                    {`${component?.name} (#${component?.id})`} 
                                </Space> 
                            </Col>
                            <Col flex="none">
                                <Button 
                                    type="primary" 
                                    onClick={() => this.setEditModal(true)} 
                                    icon={<EditOutlined />}>
                                        
                                    {L('Edit')}
                                </Button>
                            </Col>
                        </Row> 
                    }
                >   
                    <Row style={{marginBottom: '15px'}}> 
                        {component?.description}  
                    </Row>  
                </Card>    
                <Card className="ui-card">   
                    <Row> 
                        <Space>
                            <CalendarOutlined />
                            {`${L('Created')}: ${new Date(component?.creationTime!).toLocaleString("ro-RO")}`}  
                        </Space>
                    </Row>
                    {component?.lastModificationTime ? 
                        <Row> 
                            <Space>
                                <EditOutlined />
                                {`${L('Modified')}: ${new Date(component?.lastModificationTime!).toLocaleString("ro-RO")}`}  
                            </Space>
                        </Row> : <></>
                    } 
                    <Row> 
                        <Space> 
                            <FundOutlined />  
                            {`${L('Project')}: ${project?.name}`}   
                        </Space>
                    </Row> 
                </Card>    
                <Card className="component-tickets ui-card"
                    title={
                        <Row>
                            <Col flex="auto">
                                <Space>
                                    <FileTextOutlined />
                                    {this.L('Tickets')}
                                </Space> 
                            </Col>
                            <Col flex="none">
                                <Button type="primary" onClick={this.addTicket} icon={<FileAddOutlined />}>
                                    {L('AddTicket')}
                                </Button>
                            </Col>
                        </Row>
                    }
                >
                    <Row>
                        {componentIdOk
                            ? <TicketTable componentId={component!.id} editEnabled />
                            : <></>
                        }  
                    </Row>
                    {component?.id ? 
                        <EditComponent 
                            key={component?.id}
                            visible={this.state.editModal}
                            projectId={component?.projectId}
                            componentId={component?.id}
                            onOk={() => this.setEditModal(false)}
                            onCancel={() => this.setEditModal(false)}
                        /> : <></>
                    }
                </Card>
            </Spin>  
        ); 
    }
}
 
export default withRouter(Component);