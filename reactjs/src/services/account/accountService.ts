import { IsTenantAvaibleInput } from './dto/isTenantAvailableInput';
import { RegisterInput } from './dto/registerInput';
import IsTenantAvaibleOutput from './dto/isTenantAvailableOutput';
import { RegisterOutput } from './dto/registerOutput';
import http from '../httpService';
import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { ChangePasswordInput } from './dto/changePasswordInput';
import { GetAccountOutput } from './dto/getAccountOutput';
import { UpdateAccountInput } from './dto/updateAccountInput';
import { UpdateAccountOutput } from './dto/updateAccountOutput';

class AccountService {
  public async isTenantAvailable(isTenantAvaibleInput: IsTenantAvaibleInput): Promise<IsTenantAvaibleOutput> {
    let result = await http.post('api/services/app/Account/IsTenantAvailable', isTenantAvaibleInput);
    return result.data.result;
  }
  
  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('api/services/app/Account/ChangeLanguage', changeLanguageInput);
    return result.data;
  } 
  public async changePassword(changePasswordInput: ChangePasswordInput) {
    let result = await http.post('api/services/app/Account/ChangePassword', changePasswordInput);
    return result.data;
  }
 
  public async register(registerInput: RegisterInput): Promise<RegisterOutput> {
    let result = await http.post('api/services/app/Account/Register', registerInput);
    return result.data.result;
  }
  public async getAccount() : Promise<GetAccountOutput> {
    let result = await http.get('api/services/app/Account/Get');
    return result.data.result;
  } 
  public async updateAccount(input: UpdateAccountInput) : Promise<UpdateAccountOutput> {
    let result = await http.put('api/services/app/Account/Update', input);
    return result.data.result;
  }
}

export default new AccountService();
