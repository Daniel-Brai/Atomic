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
    const updatedUrl = await this.linkRepository.preload({
      id: foundUrl.id,
      ...foundUrl,
    });
    await this.linkRepository.update(
      { id: updatedUrl.id },
      { clicks: updatedUrl.clicks + 1 },
    );
    await this.linkRepository.save(updatedUrl);
    return updatedUrl;
  }
}
