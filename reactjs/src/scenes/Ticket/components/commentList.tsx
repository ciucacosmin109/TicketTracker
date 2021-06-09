import * as React from 'react';
 
import AppComponentBase from '../../../components/AppComponentBase'; 
import CommentStore from '../../../stores/commentStore';
import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 
import CommentNode from './commentNode';

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
        const comments = this.props.commentStore?.comments?.items;

        return(<> 
            {comments?.map(x =>  
                <CommentNode key={x.id} comment={x} canReply={this.props.canReply} /> 
            )} 
        </>);
    }
}