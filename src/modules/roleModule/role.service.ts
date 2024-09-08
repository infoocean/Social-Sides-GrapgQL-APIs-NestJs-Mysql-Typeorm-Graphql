import {
    Injectable,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Role } from './schema/role.schema';
import { CommonResponse } from 'src/shared/common.response';

  
  @Injectable()
  export class RoleService {
    constructor(
      @InjectRepository(Role) private roleRepository: Repository<Role>,
    ) {}
  
    //get all roles
    async getRoles() {
      return await this.roleRepository.find();
    }
  }