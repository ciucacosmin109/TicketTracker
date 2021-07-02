import React from 'react';
import AppComponentBase from '../../components/AppComponentBase';   
import InfoCard from '../../components/InfoCard';
import ProjectList, {ProjectCategory} from '../Projects/components/projectList';

export interface IMyProjectProps {
    
}
export interface IMyProjectState {
    
}
 
export default class MyProjects extends AppComponentBase<IMyProjectProps, IMyProjectState> { 
    render() { 
        return <div className="projects"> 
            <InfoCard text={this.L("InfoAssignedProjects")} />
            <ProjectList category={ProjectCategory.ASSIGNED} showNewProjectButton/> 
        </div>;
    }
}