import React from 'react'; 

import AppComponentBase from '../../../components/AppComponentBase'; 
import { L } from '../../../lib/abpUtility';
import { Row, Space } from 'antd';
import { AlignLeftOutlined, BgColorsOutlined,  BranchesOutlined,  BugFilled,  BulbFilled,  
    CarryOutFilled, DownCircleOutlined, DropboxCircleFilled, 
    FileAddOutlined, FileTextOutlined, LockFilled, MinusCircleFilled, 
    QuestionCircleOutlined, SnippetsFilled, UpCircleFilled, ZoomInOutlined } from '@ant-design/icons'; 
    
import { TicketType } from '../../../services/ticket/dto/ticketType';
import { TicketPriority } from '../../../services/ticket/dto/ticketPriority'; 
import {TicketDto} from '../../../services/ticket/dto/ticketDto'; 

export interface ITicketInfoProps { 
    ticketDto: TicketDto; 
}

class TicketInfo extends AppComponentBase<ITicketInfoProps> { 

    static getPriorityIcon = (priority: TicketPriority) => {
        switch(priority){ 
            case TicketPriority.VERY_LOW:
                return <DownCircleOutlined />;
            case TicketPriority.LOW:
                return <DownCircleOutlined style={{color: 'green'}} />;
            case TicketPriority.MEDIUM:
                return <MinusCircleFilled style={{color: 'green'}} />;
            case TicketPriority.HIGH:
                return <UpCircleFilled style={{color: 'orange'}} />;
            case TicketPriority.VERY_HIGH:
                return <UpCircleFilled style={{color: 'red'}} />;
            default:
                return <QuestionCircleOutlined />;
        }
    }
    static getActivityIcon = (activity: { name: string|undefined } | undefined) => {
        switch(activity?.name){ 
            case "Design":
                return <BgColorsOutlined style={{color: 'orange'}} />;
            case "Development":
                return <AlignLeftOutlined style={{color: 'red'}} />;
            case "Testing":
                return <ZoomInOutlined style={{color: 'orange'}} />;
            case "Documentation":
                return <SnippetsFilled style={{color: 'blue'}} />;
            case "Deployment":
                return <DropboxCircleFilled style={{color: 'green'}} />;
            default:
                return <QuestionCircleOutlined />;
        }
    }
    static getStatusIcon = (status: { name: string|undefined } | undefined) => {
        switch(status?.name){ 
            case "New":
                return <FileAddOutlined />;
            case "In development":
                return <BranchesOutlined style={{color: 'orange'}} />;
            case "In development (reopened)":
                return <BranchesOutlined style={{color: 'orange'}} />;
            case "Solved":
                return <CarryOutFilled style={{color: 'green'}} />;
            case "Closed":
                return <LockFilled style={{color: 'red'}} />;
            default:
                return <QuestionCircleOutlined />;
        }
    }
    static getTypeIcon = (type: TicketType) => {
        switch(type){ 
            case TicketType.BUG:
                return <BugFilled style={{color: 'red'}} />;
            case TicketType.FEATURE:
                return <BulbFilled style={{color: 'green'}} />;
            default:
                return <FileTextOutlined />;
        }
    }
    
    render() {
        const ticket = this.props.ticketDto;

        return (<>
            <Row> 
                <Space>
                    {`${L("Type")}:`}
                    {TicketInfo.getTypeIcon(ticket?.type)} 
                    {L(TicketType[ticket?.type ?? 0])} 
                </Space>
            </Row>
            <Row style={{marginBottom: '15px'}}> 
                {ticket?.activity != null ?
                    <Space>
                        {`${L("Activity")}:`}
                        {TicketInfo.getActivityIcon(ticket?.activity)}
                        {L(ticket?.activity?.name ?? "")} 
                    </Space> : <></>
                }
            </Row> 
            <Row> 
                <Space>
                    {`${L("Priority")}:`}
                    {TicketInfo.getPriorityIcon(ticket?.priority ?? 0)} 
                    {L(TicketPriority[ticket?.priority ?? 0])} 
                </Space>
            </Row> 
            <Row> 
                <Space>
                    {`${L("Status")}:`}
                    {TicketInfo.getStatusIcon(ticket?.status)} 
                    {L(ticket?.status?.name ?? "")}  
                </Space>
            </Row> 
        </>); 
    }
}
 
export default TicketInfo;