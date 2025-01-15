import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CreateStudentDto } from '../DTO/create-student.dto';
import { Student } from '../entities/student.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: {
            createUser: jest.fn(),
            findUserByID: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return the user object', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      const student = new Student();
      student.id = 1;
      student.name = createStudentDto.name;
      student.email = createStudentDto.email;
      student.password = 'hashedPassword';

      jest.spyOn(service, 'createUser').mockResolvedValue(student);

      const result = await controller.createUser(createStudentDto);

      expect(result).toEqual(student);
      expect(service.createUser).toHaveBeenCalledWith(createStudentDto);
      expect(service.createUser).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and throw an HttpException', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      const error = new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(service, 'createUser').mockRejectedValue(error);

      await expect(controller.createUser(createStudentDto)).rejects.toThrow(
        HttpException,
      );
      expect(service.createUser).toHaveBeenCalledWith(createStudentDto);
      expect(service.createUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByID', () => {
    it('should find a user by ID and return the user object', async () => {
      const userId = 1;
      const student = new Student();
      student.id = userId;
      student.name = 'Test User';
      student.email = 'test@example.com';

      jest.spyOn(service, 'findUserByID').mockResolvedValue(student);

      const result = await controller.findByID(userId);

      expect(result).toEqual(student);
      expect(service.findUserByID).toHaveBeenCalledWith(userId);
      expect(service.findUserByID).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and throw an HttpException', async () => {
      const userId = 1;
      const error = new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(service, 'findUserByID').mockRejectedValue(error);

      await expect(controller.findByID(userId)).rejects.toThrow(HttpException);
      expect(service.findUserByID).toHaveBeenCalledWith(userId);
      expect(service.findUserByID).toHaveBeenCalledTimes(1);
    });
  });
});

export {};
