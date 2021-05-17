import React from 'react';
import AppComponentBase from '../../components/AppComponentBase';  
import ProjectList, {ProjectCategory} from './components/projectList';

export interface IProjectProps {
    
}
export interface IProjectState {
    
}
 
export default class Projects extends AppComponentBase<IProjectProps, IProjectState> {
    render() {
        return <div className="projects">
            <ProjectList category={ProjectCategory.PUBLIC}/>
        </div>;
    }
}