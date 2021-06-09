import React from 'react';
import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col, Row, Space, Spin, Switch } from 'antd';
import { AppstoreOutlined, BugFilled,  BulbFilled,  
    CalendarOutlined, CloseOutlined, CommentOutlined, EditOutlined, FileTextOutlined, 
    FundOutlined, LoadingOutlined, MailOutlined, } from '@ant-design/icons'; 
import { Editor as TinyMce } from '@tinymce/tinymce-react';
   
import { RouteComponentProps, withRouter } from 'react-router';  
import TicketStore from '../../stores/ticketStore';  
import TicketInfo from './components/ticketInfo';
import TicketWork from './components/ticketWork';
import WorkTable from './components/workTable';
import CommentList from './components/commentList';
import CommentStore from '../../stores/commentStore'; 
import AccountStore from '../../stores/accountStore'; 
import ProjectUserStore from '../../stores/projectUserStore';
import { StaticProjectPermissionNames } from '../../models/ProjectUser/StaticProjectPermissionNames';
import SubscriptionStore from '../../stores/subscriptionStore';

export interface ITicketParams{
    id: string | undefined; 
}
export interface ITicketProps extends RouteComponentProps<ITicketParams> { 
    accountStore?: AccountStore;
    ticketStore?: TicketStore; 
    commentStore?: CommentStore;
    projectUserStore?: ProjectUserStore;
    subscriptionStore?: SubscriptionStore;
}
export interface ITicketState { 
    editWork: boolean;
    workTabKey: string; 
}
 
@inject(
    Stores.AccountStore, 
    Stores.TicketStore,  
    Stores.CommentStore,
    Stores.ProjectUserStore,
    Stores.SubscriptionStore)
@observer
class Ticket extends AppComponentBase<ITicketProps, ITicketState> {
    state = { 
        editWork: false,
        workTabKey: "active", 
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
    
    addNewComment = async (event: any) => {  
        const id = this.props.match.params.id;
        if(id != null) {
            let str = prompt(this.L("AddAComment"));
            if (str != null && str !== "") {   
                this.props.commentStore?.create({
                    ticketId: parseInt(id),
                    content: str
                });
            }
        }
    }

    setSubscribed = async (val: boolean) => { 
        const userId = this.props.accountStore?.account?.id;
        const ticketId = this.props.ticketStore?.ticket?.id;
            
        if(val){
            this.props.subscriptionStore?.subscribe(userId, ticketId);
        }else{
            this.props.subscriptionStore?.unsubscribe(userId, ticketId);
        } 
    }

    // Load data
    async componentDidMount() { 
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const intId = parseInt(id); 
            this.props.ticketStore?.get(intId).then(() => {
                const myUserId = this.props.accountStore?.account?.id;

                const projId = this.props.ticketStore?.ticket?.project?.id;
                if(projId != null && projId !== this.props.projectUserStore?.projectId){
                    this.props.projectUserStore?.get(myUserId, projId);
                }  

                this.props.subscriptionStore?.check(myUserId, intId);
            });
 
        } else {
            this.props.history.replace('/exception?type=404');
        }
    }

    render() {
        const loading = this.props.ticketStore?.loading;
        const subscribed = this.props.subscriptionStore?.subscribed ?? false;
        const ticket = this.props.ticketStore?.ticket; 
  
        const myProfile = this.props.accountStore?.account;

        const canEdit = this.props.projectUserStore?.hasPermission(myProfile?.id, ticket?.project?.id, StaticProjectPermissionNames.Component_ManageTickets)
                        || myProfile?.id === ticket?.creatorUserId;
        const canAssignWork = this.props.projectUserStore?.hasPermission(myProfile?.id, ticket?.project?.id, StaticProjectPermissionNames.Ticket_AssignWork);
        const canSelfAssignWork = this.props.projectUserStore?.hasPermission(myProfile?.id, ticket?.project?.id, StaticProjectPermissionNames.Ticket_SelfAssignWork);
        const canAddComm = this.props.projectUserStore?.hasPermission(myProfile?.id, ticket?.project?.id, StaticProjectPermissionNames.Ticket_AddComments);
        //const canManageComm = this.props.projectUserStore?.hasPermission(myProfile?.id, ticket?.project?.id, StaticProjectPermissionNames.Ticket_ManageComments);
        
        const workTabList = [
            {key: "active", tab: L("ActiveWork")},
            {key: "history", tab: L("History")},
        ];
        
        // Ticket content
        return ( 
            <Spin spinning={loading} size='large' indicator={<LoadingOutlined />}> 
                <Card className="ticket ui-card readonly-editor-card"
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
                                <Space>
                                    <Switch 
                                        size="default"
                                        checked={subscribed}
                                        onChange={this.setSubscribed}
                                        checkedChildren={<Space><MailOutlined />{L("Subscribed")}</Space>}
                                        unCheckedChildren={<Space><CloseOutlined />{L("NotSubscribed")}</Space>} 
                                    />
                                    {canEdit ? 
                                        <Button 
                                            type="primary" 
                                            onClick={this.editTicket} 
                                            icon={<EditOutlined />}>
                                                
                                            {L('Edit')}
                                        </Button> : <></>
                                    }
                                </Space>
                            </Col>
                        </Row> 
                    }
                >   
                    <Row> 
                        {/* {ticket?.description}
                        <div dangerouslySetInnerHTML={{
                            __html: ticket?.description ?? ""
                        }}></div> */}
                        {ticket?.description != null && ticket?.description !== "" ?
                            <TinyMce
                                apiKey="7atcogyb8kct4rdja6x79f3i8cks6o2uxuggklo3pynla4la"
                                disabled={true}
                                init={{ 
                                    width:"100%",
                                    menubar: false,
                                    statusbar: true,
                                    resize: true,
                                    branding: false,
                                    plugins: [ 'wordcount' ],
                                    toolbar: false
                                }}
                                value={ticket?.description}
                            /> : <></>
                        }
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
                            {`${L('Project')}: ${ticket?.project.name}`}   
                        </Space>
                    </Row> 
                    <Row> 
                        <Space> 
                            <AppstoreOutlined />  
                            {`${L('Component')}: ${ticket?.component.name}`}   
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
                                {canAssignWork || canSelfAssignWork ? 
                                    <Space>
                                        {L('Edit')}
                                        <Switch checked={this.state.editWork} onChange={this.changeEditWork} />
                                    </Space> : <></>
                                }
                            </Col>
                        </Row> 
                    } 
                >
                    {ticket && this.state.workTabKey === "active"
                        ? <TicketWork 
                            key={ticket?.id} 
                            ticketId={ticket?.id} 
                            editUserEnabled={this.state.editWork} 
                            editEstimationEnabled={this.state.editWork} />
                        : <></>
                    } 
                    {ticket && this.state.workTabKey === "history"
                        ? <WorkTable
                            key={ticket?.id} 
                            ticketId={ticket?.id} 
                            editEnabled={this.state.editWork && (canAssignWork??false)} />
                        : <></>
                    }
                </Card>

                <Card className="ui-card"
                    title={
                        <Row>
                            <Col flex="auto">  
                                <Space>
                                    <CommentOutlined />
                                    {L("Comments")}
                                </Space>
                            </Col>
                            <Col flex="none">
                                {canAddComm 
                                    ? <Button onClick={this.addNewComment}>{L('AddAComment')}</Button> 
                                    : <></>
                                }
                                
                            </Col>
                        </Row> 
                    } 
                >
                    {ticket
                        ? <CommentList key={ticket?.id} ticketId={ticket?.id} canReply={canAddComm} />
                        : <></>
                    }  
                </Card>
            </Spin>  
        ); 
    }
}
 
export default withRouter(Ticket);