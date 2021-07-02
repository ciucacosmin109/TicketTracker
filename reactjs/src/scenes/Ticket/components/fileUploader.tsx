import * as React from 'react';
import AppComponentBase from '../../../components/AppComponentBase'; 
import './fileUploader.less';

import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons';

export interface IFileUploaderProps {
    onNewFiles: (files: FileList) => void;
}  

export default class FileUploader extends AppComponentBase<IFileUploaderProps> {
    dragDropRef : React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    fileBrowserRef : HTMLInputElement | null = null;

    dragCounter : number = 0;
    state = {
        dragging: false,
        loading: false,
    }

    handleDrag = (e: any) => {
        e.preventDefault();
        e.stopPropagation(); 
    }
    handleDragIn = (e: any) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        this.dragCounter++;

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) 
            this.setState({dragging: true}); 
    }
    handleDragOut = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        this.dragCounter--;
        if (this.dragCounter > 0) 
            return;

        this.setState({dragging: false}); 
    }
    handleDrop = (e: any) => {    
        e.preventDefault();
        e.stopPropagation();

        this.setState({dragging: false});

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { 
 
            if(!this.state.loading){
                this.props.onNewFiles(e.dataTransfer.files);  
            } 
            e.dataTransfer.clearData();
            this.dragCounter = 0; 
        }
    }
    handleChosenFiles = (e: any) => { 
        e.stopPropagation();
        e.preventDefault();

        if(e.target.files && e.target.files.length > 0) { 

            if(!this.state.loading){ 
                this.props.onNewFiles(e.target.files); 
            }
            e.target.files = null; 
        }
    }

    startLoading(){
        this.setState({loading: true});
    }
    stopLoading(){ 
        this.setState({loading: false});
    }

    componentDidMount() {
        this.dragCounter = 0;

        let div = this.dragDropRef.current;
        if(div == null)
            return;

        div.addEventListener('dragenter', this.handleDragIn);
        div.addEventListener('dragleave', this.handleDragOut);
        div.addEventListener('dragover', this.handleDrag);
        div.addEventListener('drop', this.handleDrop);
    }
    componentWillUnmount() {
        let div = this.dragDropRef.current;
        if(div == null)
            return;

        div.removeEventListener('dragenter', this.handleDragIn);
        div.removeEventListener('dragleave', this.handleDragOut);
        div.removeEventListener('dragover', this.handleDrag);
        div.removeEventListener('drop', this.handleDrop);
    }

    render(){
        
        return (
            // relative
            <div className="drag-drop" ref={this.dragDropRef} onClick={()=> this.fileBrowserRef ? this.fileBrowserRef.click() : null}> 
                <div style={{
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%',  
                    transform: 'translate(-50%, -50%)'
                }}>
                    <CloudUploadOutlined style={{ 
                        fontSize:'2em',
                        position: 'relative',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'gray' }} 
                    /> 

                    <p style={{
                        textAlign: 'center'
                    }}>Drag and drop here or click to browse</p> 
                </div>
                
                {this.state.dragging && !this.state.loading &&
                    <div style={{
                        border: 'dashed grey 4px',
                        backgroundColor: 'rgba(255,255,255,.95)',
                        position: 'absolute', 
                        top: 0,
                        bottom: 0,
                        left: 0, 
                        right: 0,
                        zIndex: 900
                    }}> 
                        <CloudUploadOutlined style={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',  
                            color: 'grey',
                            fontSize: 50
                        }} /> 
                    </div>
                }

                {this.state.loading &&
                    <div style={{
                        border: 'dashed grey 3px',
                        backgroundColor: 'rgba(255,255,255,.95)',
                        position: 'absolute', 
                        top: 0,
                        bottom: 0,
                        left: 0, 
                        right: 0,
                        zIndex: 900
                    }}> 
                        <div style={{
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%',  
                            transform: 'translate(-50%, -50%)'
                        }}> 
                            <LoadingOutlined />  
                        </div>
                    </div>
                }

                <input type="file" 
                    ref={x => this.fileBrowserRef = x} 
                    style={{display: 'none'}} 
                    onChange={this.handleChosenFiles}/>

                {this.props.children} 
            </div>
        );
    }
}