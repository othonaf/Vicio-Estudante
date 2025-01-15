import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from 'src/DTO/create-enrollment.dto';
import { Enrollment } from '../entities/enrollments.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        {
          provide: EnrollmentsService,
          useValue: {
            createEnrollment: jest.fn(),
            listAllStudentCourses: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEnrollment', () => {
    it('should create a new enrollment and return a success message', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        user_id: 1,
        course_id: 1,
      };
      jest
        .spyOn(service, 'createEnrollment')
        .mockResolvedValue('Matrícula realizada com sucesso!');

      const result = await controller.createEnrollment(createEnrollmentDto);

      expect(result).toEqual({ message: 'Matrícula realizada com sucesso!' });
      expect(service.createEnrollment).toHaveBeenCalledWith(
        createEnrollmentDto,
      );
      expect(service.createEnrollment).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and throw an HttpException', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        user_id: 1,
        course_id: 1,
      };
      const error = new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(service, 'createEnrollment').mockRejectedValue(error);

      await expect(
        controller.createEnrollment(createEnrollmentDto),
      ).rejects.toThrow(HttpException);
      expect(service.createEnrollment).toHaveBeenCalledWith(
        createEnrollmentDto,
      );
      expect(service.createEnrollment).toHaveBeenCalledTimes(1);
    });
  });

  describe('listAllEnrollments', () => {
    it('should list all enrollments for a user', async () => {
      const userId = 1;
      const enrollments: Enrollment[] = [
        {
          user: { id: 1 },
          course: {
            id: 1,
            title: 'Course 1',
            description: 'Description',
            hours: 10,
            created_at: new Date(),
          },
          enrolled_at: new Date(),
          id: 1,
        } as Enrollment,
      ];

      jest
        .spyOn(service, 'listAllStudentCourses')
        .mockResolvedValue(enrollments);

      const result = await controller.listAllEnrollments(userId);

      expect(result).toEqual(enrollments);
      expect(service.listAllStudentCourses).toHaveBeenCalledWith(userId);
      expect(service.listAllStudentCourses).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and throw an HttpException', async () => {
      const userId = 1;
      const error = new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(service, 'listAllStudentCourses').mockRejectedValue(error);

      await expect(controller.listAllEnrollments(userId)).rejects.toThrow(
        HttpException,
      );
      expect(service.listAllStudentCourses).toHaveBeenCalledWith(userId);
      expect(service.listAllStudentCourses).toHaveBeenCalledTimes(1);
    });
  });
});
