import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '../DTO/create-course.dto';
import { Course } from '../entities/courses.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: {
            createCourse: jest.fn(),
            getAllCourses: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course and return the course object', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        hours: 10,
      };

      const course = new Course();
      course.id = 1;
      course.title = createCourseDto.title;
      course.description = createCourseDto.description;
      course.hours = createCourseDto.hours;

      jest.spyOn(service, 'createCourse').mockResolvedValue(course);

      const result = await controller.createCourse(createCourseDto);

      expect(result).toEqual(course);
      expect(service.createCourse).toHaveBeenCalledWith(createCourseDto);
      expect(service.createCourse).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and throw an HttpException', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        hours: 10,
      };

      const error = new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(service, 'createCourse').mockRejectedValue(error);

      await expect(controller.createCourse(createCourseDto)).rejects.toThrow(
        HttpException,
      );
      expect(service.createCourse).toHaveBeenCalledWith(createCourseDto);
      expect(service.createCourse).toHaveBeenCalledTimes(1);
    });
  });

  describe('listAllCourses', () => {
    it('should return all courses', async () => {
      const courses: Course[] = [
        {
          id: 1,
          title: 'Course 1',
          description: 'Description 1',
          hours: 10,
        } as Course,
        {
          id: 2,
          title: 'Course 2',
          description: 'Description 2',
          hours: 20,
        } as Course,
      ];

      jest.spyOn(service, 'getAllCourses').mockResolvedValue(courses);

      const result = await controller.listAllCourses();

      expect(result).toEqual(courses);
      expect(service.getAllCourses).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and throw an HttpException', async () => {
      const error = new HttpException('Erro', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(service, 'getAllCourses').mockRejectedValue(error);

      await expect(controller.listAllCourses()).rejects.toThrow(HttpException);
      expect(service.getAllCourses).toHaveBeenCalledTimes(1);
    });
  });
});

export {};
