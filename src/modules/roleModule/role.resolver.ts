import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Role } from './schema/role.schema';
import { RoleService } from './role.service';
import { CommonResponse } from 'src/shared/common.response';

@Resolver()
export class RoleResolver {
  constructor(private roleService: RoleService) {}
  //get roles
  @Query(() => [Role])
  async getRoles() {
    return this.roleService.getRoles();
  }
}