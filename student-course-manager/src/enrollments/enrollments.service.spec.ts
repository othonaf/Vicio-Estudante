import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from '../entities/enrollments.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Course } from '../entities/courses.entity';
import { CreateEnrollmentDto } from 'src/DTO/create-enrollment.dto';
import { ConflictException } from '@nestjs/common';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentRepository: Repository<Enrollment>;
  let userRepository: Repository<Student>;
  let courseRepository: Repository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: getRepositoryToken(Enrollment), useClass: Repository },
        { provide: getRepositoryToken(Student), useClass: Repository },
        { provide: getRepositoryToken(Course), useClass: Repository },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentRepository = module.get<Repository<Enrollment>>(
      getRepositoryToken(Enrollment),
    );
    userRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEnrollment', () => {
    it('should create a new enrollment', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        user_id: 1,
        course_id: 1,
      };

      const user = new Student();
      const course = new Course();
      const enrollment = new Enrollment();
      enrollment.id = 1;
      enrollment.user = user;
      enrollment.course = course;
      enrollment.enrolled_at = new Date();

      jest
        .spyOn(enrollmentRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(courseRepository, 'findOne').mockResolvedValueOnce(course);
      jest
        .spyOn(enrollmentRepository, 'save')
        .mockResolvedValueOnce(enrollment);

      const result = await service.createEnrollment(createEnrollmentDto);

      expect(result).toBe('Matrícula realizada com sucesso!');
      expect(enrollmentRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(courseRepository.findOne).toHaveBeenCalledTimes(1);
      expect(enrollmentRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw a conflict exception if enrollment already exists', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        user_id: 1,
        course_id: 1,
      };

      const enrollment = new Enrollment();

      jest
        .spyOn(enrollmentRepository, 'findOne')
        .mockResolvedValueOnce(enrollment);

      await expect(
        service.createEnrollment(createEnrollmentDto),
      ).rejects.toThrow(ConflictException);
      expect(enrollmentRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('listAllStudentCourses', () => {
    it('should list all enrollments for a user', async () => {
      const userId = 1;
      const enrollments: Enrollment[] = [
        {
          user: new Student(),
          course: new Course(),
          enrolled_at: new Date(),
          id: 1,
        },
      ];

      jest
        .spyOn(enrollmentRepository, 'find')
        .mockResolvedValueOnce(enrollments);

      const result = await service.listAllStudentCourses(userId);

      expect(result).toEqual(enrollments);
      expect(enrollmentRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['course'],
      });
    });

    it('should return an empty array if no enrollments found', async () => {
      const userId = 1;
      jest.spyOn(enrollmentRepository, 'find').mockResolvedValueOnce([]);

      const result = await service.listAllStudentCourses(userId);

      expect(result).toEqual([]);
      expect(enrollmentRepository.find).toHaveBeenCalledTimes(1);
      expect(enrollmentRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['course'],
      });
    });
  });
});
