import React from 'react'; 

import AppComponentBase from '../../../components/AppComponentBase'; 
import { L } from '../../../lib/abpUtility';
import { Button, Card } from 'antd';
import ProfileAvatar from '../../../components/SiderMenu/components/profileAvatar'; 
import { CommentDto } from '../../../services/comment/dto/commentDto';
import { CommentOutlined } from '@ant-design/icons';
import { CreateCommentInput } from '../../../services/comment/dto/createCommentInput';
import commentService from '../../../services/comment/commentService';

export interface ICommentNodeProps {   
    comment: CommentDto;
    canReply?: boolean;
}

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

    render(){   
        const comment = this.props.comment; 
        const dateTime = this.getDateTimeString(comment.creationTime); // date + " \u2022 " + time;

        return (
            <Card size="small" style={{width: '100%'}}>  
                <ProfileAvatar 
                    size='small'
                    firstName={comment.creatorUser?.name ?? ""}
                    lastName={comment.creatorUser?.surname}
                    userId={comment.creatorUser?.id} /> 
                <div style={{display: "inline", color: "black"}}>
                    {"  " + (this.props.comment.creatorUser?.fullName ?? "")}
                </div> 
                <div style={{color: "gray"}}>{dateTime}</div>

                <div style={{marginTop:"5px",marginBottom:"5px"}}>{this.props.comment.content}</div>

                {this.props.canReply ?
                    <Button size="small"
                        style={{marginBottom:"5px", textTransform:'none'}}
                        icon={<CommentOutlined style={{color: "gray"}}/>} 
                        onClick={e => this.newReply(e)}>
                        {L('Reply')}
                    </Button> : <></>
                }

                {this.props.comment.children != null ? this.props.comment.children.map(x =>
                    <CommentNode key={x.id} comment={x} canReply={this.props.canReply} />
                ) : <></>}
            </Card>
        );
    }
}
export default CommentNode;