import { action, observable } from "mobx";  
import { EntityDto } from "../services/dto/entityDto";

import { GetFileListOutput } from "../services/file/dto/getFileListOutput";
import fileService from "../services/file/fileService";
import { GetFileListInput } from "../services/file/dto/getFileListInput";
import { PostFileInput } from "../services/file/dto/postFileInput";

export default class FileStore { 
    @observable loading: boolean = false;
    
    @observable files!: GetFileListOutput;
  
    @action
    async getFileList(ticketId : number) {
        if(Number.isNaN(ticketId)){
            return;
        }
        this.loading = true;
        this.files = await fileService.getFileList({ticketId} as GetFileListInput);  
        this.loading = false;
    }  
    
    @action
    async post(input : PostFileInput) {
        const res = await fileService.post(input);
        if(res.ticketId === this.files.ticketId){
            this.files.files = [...this.files.files, res];
        }
    }   
    @action
    async delete(input : EntityDto) { 
        await fileService.delete(input); 
        this.files.files = this.files.files.filter(x => x.id !== input.id);
    }  
}