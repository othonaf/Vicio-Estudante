import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from '../entities/courses.entity';
import { CreateCourseDto } from '../DTO/create-course.dto';

@Controller('courses')
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private readonly courseService: CoursesService) {}

  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    try {
      this.logger.log(
        `Tentativa de criar curso com título: ${createCourseDto.title}`,
      );
      const course = await this.courseService.createCourse(createCourseDto);

      this.logger.log(`Curso criado com sucesso: ${course.title}`);

      return course;
    } catch (error) {
      this.logger.error(`Erro ao criar curso: ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async listAllCourses(): Promise<Course[]> {
    return this.courseService.getAllCourses();
  }
}
