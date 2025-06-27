// src/services/role.service.ts
import { Role } from '../infrastructure/entity/roles.entity';
import { RoleRepository } from '../repository/roles.repository';
import { CreateRoleDto, UpdateRoleDto } from '../infrastructure/dto/roles.dto';

export class RoleService {
  private readonly roleRepository: RoleRepository;

  constructor() {
    this.roleRepository = RoleRepository.getInstance();
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  /**
   * Get active roles only
   */
  async getActiveRoles(): Promise<Role[]> {
    return this.roleRepository.findActiveRoles();
  }

  /**
   * Get role by ID
   * @param id Role ID
   */
  async getRoleById(id: number): Promise<Role> {
    return this.roleRepository.findById(id);
  }

  /**
   * Get role by name
   * @param name Role name
   */
  async getRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findByName(name);
  }

  /**
   * Create a new role
   * @param roleData Role data
   */
  async createRole(roleData: CreateRoleDto): Promise<Role> {
    // Check if role with same name already exists
    const existingRole = await this.roleRepository.findByName(roleData.name);
    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    return this.roleRepository.create({
      ...roleData,
      isActive: roleData.isActive ?? true // Default to true if not provided
    });
  }

  /**
   * Update a role
   * @param id Role ID
   * @param updateData Role update data
   */
  async updateRole(id: number, updateData: UpdateRoleDto): Promise<Role> {
    // Check if role exists
    await this.roleRepository.findById(id);

    // If name is being updated, check for conflicts
    if (updateData.name) {
      const existingRole = await this.roleRepository.findByName(updateData.name);
      if (existingRole && existingRole.id !== id) {
        throw new Error('Another role with this name already exists');
      }
    }

    return this.roleRepository.update(id, updateData);
  }

  /**
   * Delete a role (hard delete)
   * @param id Role ID
   */
  async deleteRole(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  /**
   * Soft delete a role
   * @param id Role ID
   */
  async deactivateRole(id: number): Promise<void> {
    await this.roleRepository.deactivateRole(id);
  }

  /**
   * Restore a soft-deleted role
   * @param id Role ID
   */
  async activateRole(id: number): Promise<void> {
    await this.roleRepository.activateRole(id);
  }

  /**
   * Count all roles
   * @param activeOnly Count only active roles
   */
  async countRoles(activeOnly: boolean = false): Promise<number> {
    return activeOnly 
      ? this.roleRepository.count({ isActive: true })
      : this.roleRepository.count();
  }
}