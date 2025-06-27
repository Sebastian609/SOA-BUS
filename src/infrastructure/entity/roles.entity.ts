import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm';
import { User } from './users.entity';

@Entity('tbl_roles')
export class Role {
  @PrimaryGeneratedColumn({name: 'rol_id'})
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'deleted', default: false })
  deleted!: boolean;

   @OneToMany(() => User, user => user.rol)
  users: User[];
}