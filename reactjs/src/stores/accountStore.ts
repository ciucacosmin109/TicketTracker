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
  @observable loading: boolean = false;
  @observable saving: boolean = false;
  @observable searching: boolean = false;

  @observable tenant: IsTenantAvaibleOutput = new IsTenantAvaibleOutput();
  @observable account: GetAccountOutput = new GetAccountOutput(); 

  @observable searchResults: PagedResultDto<SearchAccountOutput> = {totalCount: 0, items: []} as PagedResultDto<SearchAccountOutput>; 

  @action
  public isTenantAvailable = async (tenancyName: string) : Promise<IsTenantAvaibleOutput> => {
    this.loading = true;

    let res = await accountService.isTenantAvailable({ tenancyName: tenancyName });
    this.tenant = res;

    this.loading = false;
    return res;
  };
  @action
  public getAccount = async () : Promise<GetAccountOutput> => {
    this.loading = true;

    let res = await accountService.getAccount();
    this.account = res;

    this.loading = false;
    return res;
  }
  @action
  public updateAccount = async (input: UpdateAccountInput) : Promise<UpdateAccountOutput> => {
    this.saving = true;

    let a = await accountService.updateAccount(input);
    const userName = this.account.userName;

    this.account = {...this.account, ...a} as GetAccountOutput;
    this.account.userName = userName;
     
    this.saving = false;
    return a;
  }
  @action
  public searchAccounts = async (input: SearchAccountsInput) : Promise<PagedResultDto<SearchAccountOutput>> => {
    this.searching = true;

    let res = await accountService.searchAccounts(input);
    this.searchResults = res; 

    this.searching = false;
    return res;
  }
 
  async register(registerInput: RegisterInput) {
    this.saving = true;
    await accountService.register(registerInput); 
    this.saving = false;
  } 
  async changeLanguage(languageName: string) {
    this.saving = true;
    await accountService.changeLanguage({ languageName: languageName });
    this.saving = false;
  } 
  async changePassword(currentPassword: string, newPassword: string) {
    this.saving = true;
    await accountService.changePassword({ currentPassword, newPassword } as ChangePasswordInput);
    this.saving = false;
  }
 
}

export default AccountStore;
