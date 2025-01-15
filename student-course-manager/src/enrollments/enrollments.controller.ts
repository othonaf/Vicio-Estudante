import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from '../entities/enrollments.entity';
import { CreateEnrollmentDto } from '../DTO/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  private readonly logger = new Logger(EnrollmentsController.name);

  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async createEnrollment(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<{ message: string }> {
    try {
      this.logger.log(
        `Tentativa de criar matrícula para usuário ID: ${createEnrollmentDto.user_id} no curso ID: ${createEnrollmentDto.course_id}`,
      );
      const enrollment =
        await this.enrollmentsService.createEnrollment(createEnrollmentDto);
      this.logger.log(`Matrícula realizada com sucesso: ID ${enrollment}`);
      return { message: 'Matrícula realizada com sucesso!' };
    } catch (error) {
      this.logger.error(`Erro ao criar matrícula: ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id') async listAllEnrollments(
    @Param('id') id: number,
  ): Promise<Enrollment[]> {
    return this.enrollmentsService.listAllStudentCourses(id);
  }
}
