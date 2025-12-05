import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(
    member: Member,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      member: member,
    });
    return this.reviewRepository.save(review);
  }

  async remove(memberEmail: string, id: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['member'],
    });

    if (!review) throw new NotFoundException('Review not found');

    if (review.member.email !== memberEmail) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    await this.reviewRepository.remove(review);
  }
}
