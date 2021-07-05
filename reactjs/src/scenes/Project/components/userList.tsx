import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 

import AppComponentBase from '../../../components/AppComponentBase';  
import { Spin, Avatar } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router'; 
import ProjectUserStore from '../../../stores/projectUserStore'; 
import ProfileAvatar from '../../../components/SiderMenu/components/profileAvatar';

export interface IUserListProps extends RouteComponentProps { 
    projectUserStore?: ProjectUserStore; 

    projectId: number;
    maxCount?: number;
}
export interface IUserListState {   
}
 
@inject(Stores.ProjectUserStore)
@observer
class UserList extends AppComponentBase<IUserListProps, IUserListState> {
    // Load data
    componentDidMount() { 
        this.props.projectUserStore?.getAllByProject(this.props.projectId); 
    }
    render(){
        const loading = this.props.projectUserStore?.loadingUsers;
        const users = this.props.projectUserStore?.projectUsers;

        // Component content
        return ( 
            <Spin spinning={loading} size='large' indicator={<LoadingOutlined />}> 
                <Avatar.Group maxCount={this.props.maxCount ?? 5} maxStyle={{cursor: 'pointer'}}>  
                    {users?.map((x, i) => 
                        <ProfileAvatar 
                            key={i}
                            showToolTip 
                            firstName={x.user.name} 
                            lastName={x.user.surname} 
                            userId={x.user.id}
                        />
                    )}
                </Avatar.Group>
            </Spin>  
        ); 
    }
}
 
export default withRouter(UserList);