import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOneByShortUrl(shortUrl: string): Promise<Link> {
    const foundUrl = await this.linkRepository.findOne({
      where: { shortUrl: shortUrl },
    });
    if (!foundUrl) {
      throw new NotFoundException(
        "Oops! Seems like the atomic url either doesn't exist",
      );
    }
    if (foundUrl.clicks === foundUrl.limit) {
      await this.linkRepository.delete({ id: foundUrl.id });
      throw new NotFoundException(
        'Oops! Seems like the atomic url has expired. Register to set higher limits for your clicks.',
      );
    }
    foundUrl.clicks += 1;
    return await this.linkRepository.save(foundUrl);
  }

  async findByUserId(id: string): Promise<Link[] | null> {
    if (!id) {
      return null;
    }
    const links = await this.linkRepository.find({
      where: { userId: id },
    });
    if (!links) {
      return null;
    }
    return links;
  }

  async remove(id: string) {
    const foundUrl = await this.linkRepository.findOne({
      where: { id: id },
    });
    if (!foundUrl) {
      throw new NotFoundException(
        "Oops! Seems like the atomic url either doesn't exist",
      );
    }
    return await this.linkRepository.delete({ id: foundUrl.id });
  }
}
