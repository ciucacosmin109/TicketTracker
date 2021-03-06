import { CreateRoleInput } from './dto/createRoleInput';
import { CreateRoleOutput } from './dto/createRoleOutput';
import { EntityDto } from '../dto/entityDto';
import { GetAllRoleOutput } from './dto/getAllRoleOutput';
import { GetRolesByPermissionInput } from './dto/getRolesByPermissionInput';
import GetRolesByPermissionOutput from './dto/getRolesByPermissionOutput';
import { GetRoleForEditOutput } from './dto/getRoleForEditOutput';
import { PagedResult } from '../dto/pagedResult';
import { PagedRoleResultRequestDto } from './dto/PagedRoleResultRequestDto';
import { UpdateRoleInput } from './dto/updateRoleInput';
import { UpdateRoleOutput } from './dto/updateRoleOutput';
import http from '../httpService';

class RoleService {
  public async create(createRoleInput: CreateRoleInput): Promise<PagedResult<CreateRoleOutput>> {
    let result = await http.post('api/services/app/Role/Create', createRoleInput);
    return result.data.result;
  }

  public async getRolesByPermission(getRoleAsyncInput: GetRolesByPermissionInput): Promise<GetRolesByPermissionOutput> {
    let result = await http.get('api/services/app/Role/GetRolesByPermission', { params: getRoleAsyncInput });
    return result.data.result;
  }

  public async update(updateRoleInput: UpdateRoleInput): Promise<UpdateRoleOutput> {
    let result = await http.put('api/services/app/Role/Update', updateRoleInput);
    return result.data.result as UpdateRoleOutput;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Role/Delete', { params: entityDto });
    return result.data;
  }

  public async getAllPermissions() {
    let result = await http.get('api/services/app/Role/GetAllPermissions');
    return result.data.result.items;
  }

  public async getRoleForEdit(entityDto: EntityDto): Promise<GetRoleForEditOutput> {
    let result = await http.get('api/services/app/Role/GetRoleForEdit', { params: entityDto });
    return result.data.result;
  }

  public async get(entityDto: EntityDto) {
    let result = await http.get('api/services/app/Role/Get', { params: entityDto });
    return result.data;
  }

  public async getAll(pagedAndSortedRequest: PagedRoleResultRequestDto): Promise<PagedResult<GetAllRoleOutput>> {
    let result = await http.get('api/services/app/Role/GetAll', { params: pagedAndSortedRequest });
    return result.data.result;
  }
}

export default new RoleService();
