import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollments.entity';
import { CreateEnrollmentDto } from 'src/DTO/create-enrollment.dto';
import { Course } from '../entities/courses.entity';
import { Student } from '../entities/student.entity';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // Método para criar um novo Enrollment (Matrícula de usuário em um curso)
  async createEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<string> {
    try {
      const existingEnrollment = await this.enrollmentRepository.findOne({
        where: {
          user: { id: createEnrollmentDto.user_id },
          course: { id: createEnrollmentDto.course_id },
        },
      });
      if (existingEnrollment) {
        this.logger.warn(
          `Tentativa de matricular usuário já matriculado no curso: User ID - ${createEnrollmentDto.user_id}, Course ID - ${createEnrollmentDto.course_id}`,
        );
        throw new ConflictException('Usuário já está matriculado neste curso');
      }
      const user = await this.studentRepository.findOne({
        where: { id: createEnrollmentDto.user_id },
      });
      if (!user) {
        throw new ConflictException('Usuário não encontrado');
      }
      const course = await this.courseRepository.findOne({
        where: { id: createEnrollmentDto.course_id },
      });
      if (!course) {
        throw new ConflictException('Curso não encontrado');
      }
      const newEnrollment = new Enrollment();
      newEnrollment.user = user;
      newEnrollment.course = course;
      newEnrollment.enrolled_at = new Date();
      await this.enrollmentRepository.save(newEnrollment);
      this.logger.log(`Nova matrícula criada com ID: ${newEnrollment.id}`);
      return 'Matrícula realizada com sucesso!';
    } catch (error) {
      this.logger.error(`Erro ao criar matrícula: ${error.message}`);
      throw error;
    }
  }

  // Método para listar todos os cursos de um usuário:
  async listAllStudentCourses(id: number): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentRepository.find({
        where: { user: { id } },
        relations: ['course'],
      });
      if (!enrollments.length) {
        this.logger.warn(
          `Nenhuma matrícula encontrada para o usuário com ID: ${id}`,
        );
      } else {
        this.logger.log(`Matrículas encontradas para o usuário com ID: ${id}`);
      }
      return enrollments;
    } catch (error) {
      this.logger.error(
        `Erro ao listar matrículas do usuário com ID: ${id} - ${error.message}`,
      );
      throw error;
    }
  }
}
