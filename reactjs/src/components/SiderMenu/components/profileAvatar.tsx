import * as React from 'react';

import { Avatar } from 'antd'; 
 
//import profilePicture from '../../../images/user.png'; 
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Tooltip } from 'antd';

export interface IProfileAvatarProps extends RouteComponentProps {
    firstName: string;
    lastName?: string;
    userId?: number;
    showToolTip?: boolean;

    className?: string;
} 

class ProfileAvatar extends React.Component<IProfileAvatarProps> { 
    getColor = () => {
        const { firstName, lastName } = this.props; 

        const hue = (firstName.length + (lastName?.length ?? 0)) * 30 % 360;
        return `hsl(${hue}, 90%, 61%)`;
    }  
  
    render() {  
        const { firstName, lastName/*, userId*/ } = this.props; 

        return ( 
            <Tooltip 
                title={`${firstName} ${lastName ?? ""}`} 
                mouseEnterDelay={this.props.showToolTip ? 0 : 9000}>
                
                <Avatar 
                    className={this.props.className} 
                    style={{ 
                        backgroundColor: this.getColor(), 
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                    }}
                    gap={1}>

                    {firstName.toUpperCase().slice(0, 1)
                    + (lastName?.toUpperCase().slice(0, 1) ?? "")}
                </Avatar>
            </Tooltip>
        );
    }
}

export default withRouter(ProfileAvatar);
