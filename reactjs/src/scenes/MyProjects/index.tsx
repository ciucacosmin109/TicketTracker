import React from 'react';
import AppComponentBase from '../../components/AppComponentBase';   
import ProjectList, {ProjectCategory} from '../Projects/components/projectList';

import '../Projects/index.less'

export interface IMyProjectProps {
    
}
export interface IMyProjectState {
    
}
 
export default class MyProjects extends AppComponentBase<IMyProjectProps, IMyProjectState> { 
    render() { 
        return <div className="projects">
            <ProjectList category={ProjectCategory.ASSIGNED} showNewProjectButton/> 
        </div>;
    }
}