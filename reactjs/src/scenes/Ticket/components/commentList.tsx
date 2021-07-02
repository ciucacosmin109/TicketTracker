import * as React from 'react';
 
import AppComponentBase from '../../../components/AppComponentBase'; 
import CommentStore from '../../../stores/commentStore';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 
import CommentNode from './commentNode';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface ICommentListProps{
    commentStore?: CommentStore;

    ticketId: number;
    canReply?: boolean;
}

export interface ICommentListState{ 
}

@inject(Stores.CommentStore)
@observer
export default class CommentList extends AppComponentBase<ICommentListProps> { 
    async componentDidMount(){ 
        this.props.commentStore?.getAll(this.props.ticketId);
    }

    render(){ 
        const loading = this.props.commentStore?.loading;
        const comments = this.props.commentStore?.comments?.items;

        return(
            <Spin spinning={loading} size='large' indicator={<LoadingOutlined />}>
                <Space direction="vertical" style={{width: '100%'}}> 
                    {comments?.map(x =>  
                        <CommentNode key={x.id} comment={x} canReply={this.props.canReply} /> 
                    )} 
                </Space>
            </Spin>
        );
    }
}