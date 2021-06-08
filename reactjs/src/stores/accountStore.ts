import { action, observable } from 'mobx';

import IsTenantAvaibleOutput from '../services/account/dto/isTenantAvailableOutput';
import accountService from '../services/account/accountService';
import { RegisterInput } from '../services/account/dto/registerInput';
import { ChangePasswordInput } from '../services/account/dto/changePasswordInput';
import { GetAccountOutput } from '../services/account/dto/getAccountOutput';
import { UpdateAccountOutput } from '../services/account/dto/updateAccountOutput';
import { UpdateAccountInput } from '../services/account/dto/updateAccountInput';
import { SearchAccountOutput } from '../services/account/dto/searchAccountOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { SearchAccountsInput } from '../services/account/dto/searchAccountsInput';

class AccountStore {
  @observable tenant: IsTenantAvaibleOutput = new IsTenantAvaibleOutput();
  @observable account: GetAccountOutput = new GetAccountOutput(); 
  @observable searchResults: PagedResultDto<SearchAccountOutput> = {totalCount: 0, items: []} as PagedResultDto<SearchAccountOutput>; 

  @action
  public isTenantAvailable = async (tenancyName: string) : Promise<IsTenantAvaibleOutput> => {
    let res = await accountService.isTenantAvailable({ tenancyName: tenancyName });
    this.tenant = res;
    return res;
  };
  @action
  public getAccount = async () : Promise<GetAccountOutput> => {
    let res = await accountService.getAccount();
    this.account = res;
    return res;
  }
  @action
  public updateAccount = async (input: UpdateAccountInput) : Promise<UpdateAccountOutput> => {
    let a = await accountService.updateAccount(input);
    const userName = this.account.userName;

    this.account = {...this.account, ...a} as GetAccountOutput;
    this.account.userName = userName;
     
    return a;
  }
  @action
  public searchAccounts = async (input: SearchAccountsInput) : Promise<PagedResultDto<SearchAccountOutput>> => {
    let res = await accountService.searchAccounts(input);
    this.searchResults = res; 
    return res;
  }
 
  async register(registerInput: RegisterInput) {
    await accountService.register(registerInput);
  } 
  async changeLanguage(languageName: string) {
    await accountService.changeLanguage({ languageName: languageName });
  } 
  async changePassword(currentPassword: string, newPassword: string) {
    await accountService.changePassword({ currentPassword, newPassword } as ChangePasswordInput);
  }
 
}

export default AccountStore;
