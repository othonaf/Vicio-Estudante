import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/courses.entity';
import { CreateCourseDto } from '../DTO/create-course.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // Método para criar um novo curso:
  async createCourse(createCourse: CreateCourseDto): Promise<Course> {
    try {
      const existingCourse = await this.courseRepository.findOne({
        where: { title: createCourse.title },
      });

      if (existingCourse) {
        this.logger.warn(
          `Tentativa de criar curso com título duplicado: ${createCourse.title}`,
        );
        throw new ConflictException('Curso já criado');
      }

      const newCourse = this.courseRepository.create({
        ...createCourse,
      });

      const savedCourse = await this.courseRepository.save(newCourse);

      return savedCourse;
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`);
      throw error;
    }
  }

  //Método para listar todos os cursos.
  async getAllCourses(): Promise<Course[]> {
    return await this.courseRepository.find();
  }
}
