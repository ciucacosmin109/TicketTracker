import React from 'react'; 

import AppComponentBase from '../../../components/AppComponentBase'; 
import { L } from '../../../lib/abpUtility';
import { Button, Collapse, message, Modal, Space } from 'antd';
import ProfileAvatar from '../../../components/SiderMenu/components/profileAvatar'; 
import { CommentDto } from '../../../services/comment/dto/commentDto';
import { CommentOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CreateCommentInput } from '../../../services/comment/dto/createCommentInput';
import commentService from '../../../services/comment/commentService';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 
import CommentStore from '../../../stores/commentStore';
import AccountStore from '../../../stores/accountStore';
import { EntityDto } from '../../../services/dto/entityDto';

export interface ICommentNodeProps {   
    commentStore?: CommentStore;
    accountStore?: AccountStore;
    
    comment: CommentDto;
    canReply?: boolean;
}

@inject(
    Stores.CommentStore,
    Stores.AccountStore)
@observer
class CommentNode extends AppComponentBase<ICommentNodeProps> { 
    
    newReply = async (e: any) => { 
        if(this.props.canReply !== true){
            return;
        }

        let str = prompt(L("AddAComment"));
        if (str != null && str !== "") {  
            let newCom = {
                content: str,
                parentId: this.props.comment.id
            } as CreateCommentInput;
            let res = await commentService.create(newCom);

            if(this.props.comment.children == null){
                this.props.comment.children = [];
            }
            this.props.comment.children.push(res);

            this.forceUpdate();
        }
    }
    deleteComment = async (e: any) => { 
        const myProfile = this.props.accountStore?.account; 
        const canDelete = myProfile?.id === this.props.comment.creatorUser?.id;
        if(!canDelete){
            return;
        }
        
        Modal.confirm({
            title: L("AreYouSureDeleteComment"),
            icon: <ExclamationCircleOutlined />,
            content: L('ActionCantBeUndone'),
            onOk: async () => {  
                await this.props.commentStore?.delete({id: this.props.comment.id} as EntityDto); 
                message.success(L("SuccessfullyDeleted")); 
            },
            onCancel() {},
        });  
    }

    render(){
        const comment = this.props.comment; 
        const dateTime = this.getDateTimeString(comment.creationTime); // date + " \u2022 " + time;
 
        const myProfile = this.props.accountStore?.account;
        const canDelete = myProfile?.id === comment.creatorUser?.id; 

        return (
            <div style={{width: '100%'}}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Space>
                        <ProfileAvatar
                            firstName={comment.creatorUser?.name ?? ""}
                            lastName={comment.creatorUser?.surname}
                            userId={comment.creatorUser?.id} 
                        />
                        <div>
                            <div>{this.props.comment.creatorUser?.fullName ?? ""}</div>
                            <div style={{color: "gray"}}>{dateTime}</div>
                        </div>
                    </Space>
                    
                    <span>{this.props.comment.content}</span>

                    <Space>
                        {this.props.canReply ?
                            <Button size="small" 
                                icon={<CommentOutlined style={{color: "gray"}}/>} 
                                onClick={e => this.newReply(e)}>
                                {L('Reply')}
                            </Button> : <></>
                        }
                        {canDelete ?
                            <Button size="small" 
                                danger
                                icon={<DeleteOutlined style={{color: "red"}}/>} 
                                onClick={e => this.deleteComment(e)}>
                                {L('Delete')}
                            </Button> : <></>
                        }
                    </Space>

                    {this.props.comment.children != null && this.props.comment.children.length !== 0 ? 
                        <Collapse defaultActiveKey={1} ghost style={{borderLeft: '1px solid lightgray'}}>
                            <Collapse.Panel header={this.L("ShowReplies") + " - " + this.props.comment.children.length} key={1}>
                                <Space direction="vertical" style={{width: '100%'}}>
                                    {this.props.comment.children.map(x =>
                                        <CommentNode 
                                            {...this.props} // add the stores to children
                                            key={x.id} 
                                            comment={x} 
                                            canReply={this.props.canReply}
                                        />
                                    )}
                                </Space>
                            </Collapse.Panel>
                        </Collapse> : <></> 
                    }
                </Space>
            </div>
        );
    }
}
export default CommentNode;