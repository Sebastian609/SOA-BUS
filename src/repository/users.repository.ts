// src/repositories/UserRepository.ts
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { User } from "../infrastructure/entity/users.entity";
import { IBaseRepository } from "./base-repository.interface";

export class UserRepository implements IBaseRepository<User> {
  public constructor(private repository: Repository<User>) {
    this.repository = repository;
  }

  async getPaginated(limit: number, offset: number): Promise<any> {
    if (limit < 1 || offset < 0) {
      throw new Error("Invalid pagination parameters");
    }

    const [data] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      relations: {
        rol: true,
      },
      order: {
        createdAt: "DESC",
      },
      where: {
        deleted: false,
      },
    });
    const count = await this.repository.count({
      where: {
        deleted: false,
      },
    });

    const response = {
      users: data,
      count: count,
    };

    return response;
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<User> {
    const User = this.repository.findOneBy({ id });
    if (!User) {
      throw new Error(`User with ID ${id} not found`);
    }
    return User;
  }

  async findByCriteria(criteria: User): Promise<User[]> {
    return this.repository.find({ where: criteria });
  }
  async create(entity: User): Promise<User> {
    const user = this.repository.create(entity);
    return this.repository.save(user);
  }

  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    const response = await this.repository.update(userId, {
      password: newPassword,
    });

    if (response.affected == 0) {
      throw new Error("Cant update password");
    }

    return true;
  }

  async update(id: number, entity: Partial<User>): Promise<User> {
    await this.repository.update(id, entity);
    const updatedUser = await this.repository.findOne({
      where: {
        id: id,
      },
      relations: {
        rol: true,
      },
    });
    return updatedUser;
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    return this.repository.update(id, {
      deleted: true,
    });
  }

  async restore(id: number): Promise<UpdateResult> {
    return this.repository.restore(id);
  }

  async count(criteria?: Partial<User>): Promise<number> {
    return this.repository.count({ where: criteria });
  }

  // Métodos específicos para User
  async findByName(name: string): Promise<User | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email: email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async deactivateUser(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async activateUser(id: number): Promise<void> {
    await this.repository.update(id, { isActive: true });
  }
}
