import { GetFileListInput } from './dto/getFileListInput';
import { GetFileListOutput } from './dto/getFileListOutput'; 
import http from '../httpService';
import { PostFileInput } from './dto/postFileInput';
import { FileDto } from './dto/fileDto';
import { EntityDto } from '../dto/entityDto';
import { DownloadFileInput } from './dto/downloadFileInput';
import { getEncriptedAuthToken } from '../../lib/abpUtility';

class FileService {
    public async getFileList(input: GetFileListInput): Promise<GetFileListOutput> {
      let result = await http.get('api/services/app/Files/GetFileList',{ params: input } );
      return result.data.result;
    }
    public async post(input: PostFileInput): Promise<FileDto> {
        let result = await http.post('api/services/app/Files/Post', input);
        return result.data.result;
    } 
    public async delete(input: EntityDto) {
        await http.delete('api/services/app/Files/Delete', { params: input });
    }

    public getDownloadLink(input: DownloadFileInput) : string {
        let baseUrl = process.env.REACT_APP_REMOTE_SERVICE_BASE_URL ?? "";
        baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, baseUrl.length-1) : baseUrl;

        let link = baseUrl + "/api/services/app/Files/Download?TicketId="+input.ticketId;
        if(input.fileId)
            link+="&FileId=" + input.fileId;

        const token = encodeURIComponent(getEncriptedAuthToken()); 
        link += "&enc_auth_token=" + token;

        return link;
    }
    public async download(input: DownloadFileInput) { 
        window.location.href = this.getDownloadLink(input);
    }
}
 
export default new FileService();