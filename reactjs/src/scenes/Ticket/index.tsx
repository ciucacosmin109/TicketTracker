import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col, Row, Space, Spin, Switch } from 'antd';
import { AppstoreOutlined, BugFilled,  BulbFilled,  
    CalendarOutlined, EditOutlined, FileTextOutlined, 
    FundOutlined, LoadingOutlined, } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';  
import TicketStore from '../../stores/ticketStore'; 
import ProjectStore from '../../stores/projectStore'; 
import ComponentStore from '../../stores/componentStore'; 
import ProjectUserStore from '../../stores/projectUserStore';
import TicketInfo from './components/ticketInfo';
import TicketWork from './components/ticketWork';
import WorkTable from './components/workTable';

export interface ITicketParams{
    id: string | undefined; 
}
export interface ITicketProps extends RouteComponentProps<ITicketParams> { 
    ticketStore?: TicketStore;
    projectStore?: ProjectStore;
    componentStore?: ComponentStore;
    projectUserStore?: ProjectUserStore;
}
export interface ITicketState {  
    loading: boolean; 
    editWork: boolean;
    workTabKey: string;
    assignedUserId: number; 
}
 
@inject(
    Stores.TicketStore, 
    Stores.ProjectStore,
    Stores.ProjectUserStore, 
    Stores.ComponentStore)
@observer
class Ticket extends AppComponentBase<ITicketProps, ITicketState> {
    state = {  
        loading: true,
        editWork: false,
        workTabKey: "active",
        assignedUserId: 0,
    }

    editTicket = () => {
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const path = this.getPath("editticket").replace(':id', id);
            this.props.history.push(path);
        }
    }

    changeEditWork = (value: boolean) => {
        this.setState({editWork: value})
    }

    // Load data
    async componentDidMount() { 
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const intId = parseInt(id); 
            await this.props.ticketStore?.get(intId);

            const compId = this.props.ticketStore?.ticket?.componentId;
            if(compId != null && compId !== this.props.componentStore?.component?.id){
               await this.props.componentStore?.get(compId);
            }

            const projId = this.props.componentStore?.component?.projectId;
            if(projId != null && projId !== this.props.projectStore?.project?.id){
               await this.props.projectStore?.getProject(projId);
            } 
            if(projId != null && projId !== this.props.projectUserStore?.projectId){
               await this.props.projectUserStore?.getAll(projId);
            }

            const assignedUserId = this.props.ticketStore?.ticket?.works?.find(x => x.isWorking)?.user?.id; 

            this.setState({loading: false, assignedUserId: assignedUserId ?? 0});
        } else {
            this.props.history.replace('/exception?type=404');
        }
    }

    render() {
        const ticket = this.props.ticketStore?.ticket;
        const project = this.props.projectStore?.project;
        const component = this.props.componentStore?.component; 
 
        /*const ticketIdOk = ticket != null && 
                            this.props.match.params.id != null && 
                            (ticket.id === parseInt(this.props.match.params.id));*/
 
        const workTabList = [
            {key: "active", tab: L("ActiveWork")},
            {key: "history", tab: L("History")},
        ];
        
        // Ticket content
        return ( 
            <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}> 
                <Card className="ticket ui-card"
                    title={
                        <Row>
                            <Col flex="auto">  
                                <Space> 
                                    {   
                                        ticket?.type === 1 ?
                                            <BugFilled style={{color: 'red'}} /> :
                                        ticket?.type === 2 ?
                                            <BulbFilled style={{color: 'green'}} /> :
                                        <FileTextOutlined />
                                    }  
                                    {`${ticket?.title} (#${ticket?.id})`} 
                                </Space> 
                            </Col>
                            <Col flex="none">
                                <Button 
                                    type="primary" 
                                    onClick={this.editTicket} 
                                    icon={<EditOutlined />}>
                                        
                                    {L('Edit')}
                                </Button>
                            </Col>
                        </Row> 
                    }
                >   
                    <Row> 
                        {ticket?.description}  
                    </Row>
                </Card>  
                <Card className="ui-card">  
                    {ticket 
                        ? <TicketInfo ticketDto={ticket} /> 
                        : <></>
                    } 
                </Card> 
                <Card className="ui-card">   
                    <Row> 
                        <Space>
                            <CalendarOutlined />
                            {`${L('Created')}: ${new Date(ticket?.creationTime!).toLocaleString("ro-RO")}`}  
                        </Space>
                    </Row>
                    {ticket?.lastModificationTime ? 
                        <Row> 
                            <Space>
                                <EditOutlined />
                                {`${L('Modified')}: ${new Date(ticket?.lastModificationTime!).toLocaleString("ro-RO")}`}  
                            </Space>
                        </Row> : <></>
                    } 
                    <Row> 
                        <Space> 
                            <FundOutlined />  
                            {`${L('Project')}: ${project?.name}`}   
                        </Space>
                    </Row> 
                    <Row> 
                        <Space> 
                            <AppstoreOutlined />  
                            {`${L('Component')}: ${component?.name}`}   
                        </Space>
                    </Row> 
                </Card> 
  
                <Card className="ticket-work-details ui-card" 
                    tabList={workTabList}
                    activeTabKey={this.state.workTabKey}
                    onTabChange={k => this.setState({workTabKey: k})}
                    title={
                        <Row>
                            <Col flex="auto">  
                                <Space>
                                    <CalendarOutlined style={{color: 'green'}} />
                                    {L("TicketWork")}
                                </Space>
                            </Col>
                            <Col flex="none">
                                <Space>
                                    {L('Edit')}
                                    <Switch checked={this.state.editWork} onChange={this.changeEditWork} />
                                </Space>
                            </Col>
                        </Row> 
                    } 
                >
                    {ticket && this.state.workTabKey === "active"
                        ? <TicketWork editEnabled={this.state.editWork} ticketId={ticket?.id} />
                        : <></>
                    } 
                    {ticket && this.state.workTabKey === "history"
                        ? <WorkTable editEnabled={this.state.editWork} ticketId={ticket?.id} />
                        : <></>
                    }
                </Card>
            </Spin>  
        ); 
    }
}
 
export default withRouter(Ticket);