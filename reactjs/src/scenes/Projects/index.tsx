import React from 'react';
import AppComponentBase from '../../components/AppComponentBase';  
import InfoCard from '../../components/InfoCard';
import ProjectList, {ProjectCategory} from './components/projectList';

export interface IProjectProps {
    
}
export interface IProjectState {
    
}
 
export default class Projects extends AppComponentBase<IProjectProps, IProjectState> {
    render() {
        console.log(this.L("InfoPublicProjects"))
        return <div className="projects">
            <InfoCard text={this.L("InfoPublicProjects")} />
            <ProjectList category={ProjectCategory.PUBLIC}/>
        </div>;
    }
}