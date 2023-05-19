import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { TicketServer } from '../libs/generators/ticket.server';

const ticketServer = new TicketServer();

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}
  async create(link: CreateLinkDto): Promise<Link> {
    const newLink = this.linkRepository.create({
      shortUrl: ticketServer.generateShortUrlHash(),
      ...link,
    });
    return await this.linkRepository.save(newLink);
  }
}
