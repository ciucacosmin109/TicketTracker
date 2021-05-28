import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase'; 
import { L } from '../../lib/abpUtility';
import { Button, Card, Col, Row, Space, Spin, Switch } from 'antd';
import { AppstoreOutlined, BugFilled,  BulbFilled,  
    CalendarOutlined, CloseOutlined, CommentOutlined, EditOutlined, FileTextOutlined, 
    FundOutlined, LoadingOutlined, MailOutlined, } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';  
import TicketStore from '../../stores/ticketStore';  
import TicketInfo from './components/ticketInfo';
import TicketWork from './components/ticketWork';
import WorkTable from './components/workTable';
import CommentList from './components/commentList';
import CommentStore from '../../stores/commentStore';
import subscriptionService from '../../services/subscription/subscriptionService';
import AccountStore from '../../stores/accountStore';
import { CreateSubscriptionInput } from '../../services/subscription/dto/createSubscriptionInput';
import { DeleteSubscriptionInput } from '../../services/subscription/dto/deleteSubscriptionInput';
import { CheckSubscriptionInput } from '../../services/subscription/dto/checkSubscriptionInput';

export interface ITicketParams{
    id: string | undefined; 
}
export interface ITicketProps extends RouteComponentProps<ITicketParams> { 
    accountStore?: AccountStore;
    ticketStore?: TicketStore; 
    commentStore?: CommentStore;
}
export interface ITicketState {  
    loading: boolean; 
    subscribed: boolean;
    editWork: boolean;
    workTabKey: string;
    assignedUserId: number; 
}
 
@inject(
    Stores.AccountStore, 
    Stores.TicketStore,  
    Stores.CommentStore)
@observer
class Ticket extends AppComponentBase<ITicketProps, ITicketState> {
    state = {  
        loading: true,
        subscribed: false,
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
        let subscription = {
            userId: this.props.accountStore?.account?.id,
            ticketId: this.props.ticketStore?.ticket?.id
        }
        if(val){
            await subscriptionService.create(subscription as CreateSubscriptionInput);
        }else{
            await subscriptionService.delete(subscription as DeleteSubscriptionInput);
        }
        this.setState({subscribed: val});
    }

    // Load data
    async componentDidMount() { 
        const id = this.props.match.params.id;
        if(id != null){ // i have an id
            const intId = parseInt(id); 
            await this.props.ticketStore?.get(intId);
  
            const assignedUserId = this.props.ticketStore?.ticket?.works?.find(x => x.isWorking)?.user?.id; 

            const sub = await subscriptionService.check({
                userId: this.props.accountStore?.account?.id,
                ticketId: this.props.ticketStore?.ticket?.id
            } as CheckSubscriptionInput);

            this.setState({loading: false, subscribed: sub, assignedUserId: assignedUserId ?? 0});
        } else {
            this.props.history.replace('/exception?type=404');
        }
    }

    render() {
        const ticket = this.props.ticketStore?.ticket; 
 
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
                                <Space>
                                    <Switch 
                                        size="default"
                                        checked={this.state.subscribed}
                                        onChange={this.setSubscribed}
                                        checkedChildren={<Space><MailOutlined />{L("Subscribed")}</Space>}
                                        unCheckedChildren={<Space><CloseOutlined />{L("NotSubscribed")}</Space>} 
                                    />
                                    <Button 
                                        type="primary" 
                                        onClick={this.editTicket} 
                                        icon={<EditOutlined />}>
                                            
                                        {L('Edit')}
                                    </Button>
                                </Space>
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
                                <Space>
                                    {L('Edit')}
                                    <Switch checked={this.state.editWork} onChange={this.changeEditWork} />
                                </Space>
                            </Col>
                        </Row> 
                    } 
                >
                    {ticket && this.state.workTabKey === "active"
                        ? <TicketWork key={ticket?.id} ticketId={ticket?.id} editEnabled={this.state.editWork} />
                        : <></>
                    } 
                    {ticket && this.state.workTabKey === "history"
                        ? <WorkTable key={ticket?.id} ticketId={ticket?.id} editEnabled={this.state.editWork} />
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
                                <Button onClick={this.addNewComment}>{L('AddAComment')}</Button>  
                            </Col>
                        </Row> 
                    } 
                >
                    {ticket
                        ? <CommentList key={ticket?.id} ticketId={ticket?.id} />
                        : <></>
                    }  
                </Card>
            </Spin>  
        ); 
    }
}
 
export default withRouter(Ticket);