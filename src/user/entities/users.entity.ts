import {
  BeforeInsert,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Column,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  CreateDateColumn,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Entity,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  JoinColumn,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  OneToMany,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  PrimaryGeneratedColumn,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Link } from '../../link/entities/link.entity';
import { hashPassword } from '../../utils/argon2';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  public username: string;

  @Column({ nullable: false })
  @Exclude()
  public password: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => Link, (link) => link.userId)
  @JoinColumn()
  public links: Link[];

  @BeforeInsert()
  async Hash() {
    this.password = await hashPassword(this.password);
  }
}
