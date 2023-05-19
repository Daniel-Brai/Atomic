import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
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

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  GenerateIdAgain() {
    this.shortUrl = ticketServer.generateShortUrlHash();
  }
}
