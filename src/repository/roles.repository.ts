// src/repositories/RoleRepository.ts
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Role } from '../infrastructure/entity/roles.entity';
import { IBaseRepository } from './base-repository.interface';
import { AppDataSource } from '../infrastructure/database/database';

export class RoleRepository implements IBaseRepository<Role> {
  private static instance: RoleRepository;
  private repository: Repository<Role>;

  private constructor() {
    this.repository = AppDataSource.getRepository(Role);
  }

  public static getInstance(): RoleRepository {
    if (!RoleRepository.instance) {
      RoleRepository.instance = new RoleRepository();
    }
    return RoleRepository.instance;
  }

  async findAll(): Promise<Role[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Role> {
    const role = await this.repository.findOneBy({ id });
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByCriteria(criteria: Partial<Role>): Promise<Role[]> {
    return this.repository.find({ where: criteria });
  }

  async create(entity: Partial<Role>): Promise<Role> {
    const newRole = this.repository.create(entity);
    return this.repository.save(newRole);
  }

  async update(id: number, entity: Partial<Role>): Promise<Role> {
    await this.repository.update(id, entity);
    const updatedRole = await this.findById(id);
    return updatedRole;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async count(criteria?: Partial<Role>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

  // Métodos específicos para Role
  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findActiveRoles(): Promise<Role[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async deactivateRole(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async activateRole(id: number): Promise<void> {
    await this.repository.update(id, { isActive: true });
  }
}