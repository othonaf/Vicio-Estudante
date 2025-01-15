import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../DTO/create-student.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: getRepositoryToken(Student), useClass: Repository },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(
      getRepositoryToken(Student),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
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

      jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));
      jest.spyOn(studentRepository, 'create').mockReturnValue(student);
      jest.spyOn(studentRepository, 'save').mockResolvedValueOnce(student);

      const result = await service.createUser(createStudentDto);

      expect(result).toEqual(student);
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { email: createStudentDto.email },
      });
      expect(studentRepository.create).toHaveBeenCalledWith({
        ...createStudentDto,
        password: 'hashedPassword',
      });
      expect(studentRepository.save).toHaveBeenCalledWith(student);
    });

    it('should throw a conflict exception if user already exists', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      const existingUser = new Student();

      jest
        .spyOn(studentRepository, 'findOne')
        .mockResolvedValueOnce(existingUser);

      await expect(service.createUser(createStudentDto)).rejects.toThrow(
        ConflictException,
      );
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { email: createStudentDto.email },
      });
    });
  });

  describe('findUserByID', () => {
    it('should find a user by ID', async () => {
      const userId = 1;
      const student = new Student();
      student.id = userId;
      student.name = 'Test User';
      student.email = 'test@example.com';
      student.password = 'hashedPassword';

      jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(student);

      const result = await service.findUserByID(userId);

      expect(result).toEqual({
        name: student.name,
        id: student.id,
        email: student.email,
      });
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw a not found exception if user not found', async () => {
      const userId = 1;

      jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findUserByID(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(studentRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
