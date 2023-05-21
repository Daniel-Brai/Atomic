import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/users.entity';
import { TicketServer } from '../../libs/generators/ticket.server';

const ticketServer = new TicketServer();

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  public id: number;

  @Column()
  public longUrl: string;

  @Column({ nullable: false })
  public shortUrl: string;

  @Column({ type: 'int', default: 0 })
  public clicks: number;

  @Column({ type: 'int', default: 20 })
  public limit: number;

  @Column({ nullable: true })
  public userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  GenerateIdAgain() {
    this.shortUrl = ticketServer.generateShortUrlHash();
  }
}
