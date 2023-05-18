import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  longUrl: string;

  @Column()
  shortUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
