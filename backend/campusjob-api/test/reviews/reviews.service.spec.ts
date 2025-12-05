import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../../src/reviews/reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../src/reviews/entities/review.entity';
import { Member, MemberRole } from '../../src/members/entities/member.entity';
import { CreateReviewDto } from '../../src/reviews/dto/create-review.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepository: Repository<Review>;

  const mockMember: Member = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: MemberRole.USER,
  };

  const mockReview: Review = {
    id: 1,
    content: 'Great job!',
    member: mockMember,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get<Repository<Review>>(getRepositoryToken(Review));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new review', async () => {
      const createReviewDto: CreateReviewDto = { content: 'Amazing!' };
      const expectedReview = {
        ...createReviewDto,
        member: mockMember,
      };

      (reviewRepository.create as jest.Mock).mockReturnValue(expectedReview);
      (reviewRepository.save as jest.Mock).mockResolvedValue({
        id: 2,
        ...expectedReview,
      });

      const result = await service.create(mockMember, createReviewDto);

      expect(reviewRepository.create).toHaveBeenCalledWith(expectedReview);
      expect(reviewRepository.save).toHaveBeenCalledWith(expectedReview);
      expect(result).toEqual({ id: 2, ...expectedReview });
    });
  });

  describe('remove', () => {
    it('should successfully remove a review', async () => {
      (reviewRepository.findOne as jest.Mock).mockResolvedValue(mockReview);
      (reviewRepository.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(
        service.remove(mockMember.email, mockReview.id),
      ).resolves.toBeUndefined();
      expect(reviewRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockReview.id },
        relations: ['member'],
      });
      expect(reviewRepository.remove).toHaveBeenCalledWith(mockReview);
    });

    it('should throw NotFoundException if review is not found', async () => {
      (reviewRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(mockMember.email, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the owner of the review', async () => {
      const otherMemberEmail = 'other@example.com';
      (reviewRepository.findOne as jest.Mock).mockResolvedValue(mockReview);

      await expect(service.remove(otherMemberEmail, mockReview.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
