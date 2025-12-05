import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from '../../src/reviews/reviews.controller';
import { ReviewsService } from '../../src/reviews/reviews.service';
import { CreateReviewDto } from '../../src/reviews/dto/create-review.dto';
import { Member, MemberRole } from '../../src/members/entities/member.entity';
import { Review } from '../../src/reviews/entities/review.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

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
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review and return it', async () => {
      const createReviewDto: CreateReviewDto = { content: 'Excellent!' };
      const req = { user: mockMember };
      const expectedReview = {
        id: 2,
        ...createReviewDto,
        member: mockMember,
      };

      (service.create as jest.Mock).mockResolvedValue(expectedReview);

      const result = await controller.create(req as any, createReviewDto);
      expect(service.create).toHaveBeenCalledWith(mockMember, createReviewDto);
      expect(result).toEqual(expectedReview);
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const req = { user: mockMember };
      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(controller.remove(req as any, '1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(mockMember.email, 1);
    });

    it('should throw NotFoundException if review to remove is not found', async () => {
      const req = { user: mockMember };
      (service.remove as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.remove(req as any, '999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const req = { user: mockMember };
      (service.remove as jest.Mock).mockRejectedValue(new ForbiddenException());

      await expect(controller.remove(req as any, '2')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
