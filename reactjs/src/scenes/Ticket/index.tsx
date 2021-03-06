import React from 'react';
import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col, Row, Space, Switch } from 'antd';
import { BugFilled,  BulbFilled, CalendarOutlined, CloseOutlined, 
    CommentOutlined, EditOutlined, FileOutlined, FileTextOutlined, 
    MailOutlined, } from '@ant-design/icons'; 
import { Editor as TinyMce } from '@tinymce/tinymce-react';
   
import { RouteComponentProps, withRouter } from 'react-router';  
import TicketStore from '../../stores/ticketStore';  
import TicketInfo from './components/ticketInfo';
import TicketMeta from './components/ticketMeta';
import TicketWork from './components/ticketWork';
import WorkTable from './components/workTable';
import CommentList from './components/commentList';
import CommentStore from '../../stores/commentStore';
import ProjectUserStore from '../../stores/projectUserStore';
import { StaticProjectPermissionNames } from '../../models/ProjectUser/StaticProjectPermissionNames';
import SubscriptionStore from '../../stores/subscriptionStore';
import FileTable from './components/fileTable';
import InfoCard from '../../components/InfoCard';
import UiCard from '../../components/UiCard';

export interface ITicketParams{
    id: string | undefined; 
}
export interface ITicketProps extends RouteComponentProps<ITicketParams> {
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
        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 
            const path = this.getPath("editticket").replace(':id', intId.toString());
            this.props.history.push(path);
        }
    }

    changeEditWork = (value: boolean) => {
        this.setState({editWork: value})
    }
    
    addNewComment = async (event: any) => { 
        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 
            let str = prompt(this.L("AddAComment"));
            if (str != null && str !== "") {   
                this.props.commentStore?.create({
                    ticketId: intId,
                    content: str
                });
            }
        }
    }

    setSubscribed = async (val: boolean) => { 
        const userId = this.getUserId()!;
        const ticketId = this.props.ticketStore?.ticket?.id;
            
        if(val){
            this.props.subscriptionStore?.subscribe(userId, ticketId);
        }else{
            this.props.subscriptionStore?.unsubscribe(userId, ticketId);
        } 
    }

    // Load data
    async componentDidMount() { 
        const intId = parseInt(this.props.match.params.id!); 
        if(!Number.isNaN(intId)){ // i have an id 
            const myUserId = this.getUserId()!;

            this.props.ticketStore?.get(intId);
            this.props.projectUserStore?.getByTicket(myUserId, intId); 
            this.props.subscriptionStore?.check(myUserId, intId);
 
        } else {
            this.props.history.replace('/exception?type=404');
        }
    }

    render() {
        const loadingTicket = this.props.ticketStore?.loading;
        const loadingSubscription = this.props.subscriptionStore?.loading;
        //const loadingComments = this.props.commentStore?.loading;

        const ticket = this.props.ticketStore?.ticket; 
        const isOk = this.props.ticketStore?.ticket?.id === parseInt(this.props.match.params.id!);
  
        const subscribed = this.props.subscriptionStore?.subscribed ?? false;
        const userId = this.getUserId()!;
        const comments = this.props.commentStore?.comments;

        const isAssignedToProject = this.props.projectUserStore?.projectUser != null;
        const canEdit = this.props.projectUserStore?.hasPermission(userId, StaticProjectPermissionNames.Component_ManageTickets)
                        || userId === ticket?.creatorUserId;
        const canAssignWork = this.props.projectUserStore?.hasPermission(userId, StaticProjectPermissionNames.Ticket_AssignWork);
        const canSelfAssignWork = this.props.projectUserStore?.hasPermission(userId, StaticProjectPermissionNames.Ticket_SelfAssignWork);  
        const canAddFiles = this.props.projectUserStore?.hasPermission(userId, StaticProjectPermissionNames.Ticket_AddAttachments);
        const canManageFiles = this.props.projectUserStore?.hasPermission(userId, StaticProjectPermissionNames.Ticket_ManageAttachments);
        
        const workTabList = [
            {key: "active", tab: L("ActiveWork")},
            {key: "history", tab: L("History")},
        ];
        
        if(isOk){
            this.setCustomTitle(ticket?.title);
        }
        
        // Ticket content
        return ( 
            <div> 
                <InfoCard text={this.L("InfoTicket")} />
                
                <UiCard zeroPadding
                    className="readonly-editor-card"
                    loadingTitle={loadingTicket}
                    loadingBody={loadingTicket}
                    icon={   
                        ticket?.type === 1 ?
                            <BugFilled style={{color: 'red'}} /> :
                        ticket?.type === 2 ?
                            <BulbFilled style={{color: 'green'}} /> :
                        <FileTextOutlined />
                    } 
                    title={`${ticket?.title} (#${ticket?.id})`}
                    extra={
                        <Space>
                            <Switch 
                                size="default"
                                loading={loadingSubscription}
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
                    } 
                >    
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
                        value={isOk && ticket?.description != null && ticket?.description !== "" 
                            ? ticket?.description
                            : ""
                        }
                    /> 
                </UiCard>  

                <Row>
                    <Col flex="1 1 300px">
                        <UiCard loadingBody={loadingTicket}>
                            {ticket
                                ? <TicketInfo ticketDto={ticket} /> 
                                : <></>
                            } 
                        </UiCard> 
                    </Col>
                    <Col flex="1 1 300px">
                        <UiCard loadingBody={loadingTicket}> 
                            {ticket
                                ? <TicketMeta ticketDto={ticket} /> 
                                : <></>
                            } 
                        </UiCard> 
                    </Col>
                </Row>
 
                <Card className={this.state.workTabKey === "history" ? "ui-table-card" : "ui-card"}
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
                                {isOk && ( canAssignWork || canSelfAssignWork ) ? 
                                    <Space>
                                        {L('Edit')}
                                        <Switch checked={this.state.editWork} onChange={this.changeEditWork} />
                                    </Space> : <></>
                                }
                            </Col>
                        </Row> 
                    } 
                >
                    {isOk && ticket && this.state.workTabKey === "active"
                        ? <TicketWork 
                            key={ticket?.id} 
                            ticketId={ticket?.id} 
                            editUserEnabled={this.state.editWork} 
                            editEstimationEnabled={this.state.editWork} />
                        : <></>
                    } 
                    {isOk && ticket && this.state.workTabKey === "history"
                        ? <WorkTable
                            key={ticket?.id} 
                            ticketId={ticket?.id} 
                            editEnabled={this.state.editWork && (canAssignWork??false)} />
                        : <></>
                    }
                </Card>
                
                <Card className="ui-table-card"
                    title={ 
                        <Space>
                            <FileOutlined />
                            {L("Files")}
                        </Space>  
                    } 
                >
                    {isOk && ticket
                        ? <FileTable 
                            key={ticket?.id} 
                            ticketId={ticket?.id}
                            uploadEnabled={canAddFiles}
                            editEnabled={canManageFiles}/>
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
                                    {"(" + (comments?.totalCount ?? 0) + ")"}
                                </Space>
                            </Col>
                            <Col flex="none">
                                {isOk && isAssignedToProject ? 
                                    <Button 
                                        icon={<CommentOutlined />} 
                                        type="primary" 
                                        onClick={this.addNewComment}
                                    > 
                                        {L('AddAComment')}
                                    </Button> : <></>
                                }
                                
                            </Col>
                        </Row> 
                    } 
                >
                    {isOk && ticket
                        ? <CommentList key={ticket?.id} ticketId={ticket?.id} canReply={isAssignedToProject} />
                        : <></>
                    }  
                </Card>

            </div>  
        ); 
    }
}
 
export default withRouter(Ticket);