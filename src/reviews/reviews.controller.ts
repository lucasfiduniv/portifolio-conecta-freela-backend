import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';


@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.CLIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ): Promise<Review> {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get('freelancer/:freelancerId')
  @ApiOperation({ summary: 'Get all reviews for a freelancer' })
  @ApiResponse({ status: 200, description: 'Return all reviews for a freelancer' })
  async findAllForFreelancer(@Param('freelancerId') freelancerId: string): Promise<Review[]> {
    return this.reviewsService.findAll(freelancerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Return review by ID' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }
}