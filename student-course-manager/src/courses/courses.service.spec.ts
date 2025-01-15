import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../entities/courses.entity';
import { CreateCourseDto } from '../DTO/create-course.dto';
import { ConflictException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: Repository<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useClass: Repository },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'New Course',
        description: 'Course Description',
        hours: 10,
      };

      const course = new Course();
      course.id = 1;
      course.title = createCourseDto.title;
      course.description = createCourseDto.description;
      course.hours = createCourseDto.hours;

      jest.spyOn(courseRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(courseRepository, 'create').mockReturnValue(course);
      jest.spyOn(courseRepository, 'save').mockResolvedValueOnce(course);

      const result = await service.createCourse(createCourseDto);

      expect(result).toEqual(course);
      expect(courseRepository.findOne).toHaveBeenCalledWith({
        where: { title: createCourseDto.title },
      });
      expect(courseRepository.create).toHaveBeenCalledWith({
        ...createCourseDto,
      });
      expect(courseRepository.save).toHaveBeenCalledWith(course);
    });

    it('should throw a conflict exception if course already exists', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Existing Course',
        description: 'Course Description',
        hours: 10,
      };

      const existingCourse = new Course();

      jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValueOnce(existingCourse);

      await expect(service.createCourse(createCourseDto)).rejects.toThrow(
        ConflictException,
      );
      expect(courseRepository.findOne).toHaveBeenCalledWith({
        where: { title: createCourseDto.title },
      });
    });
  });

  describe('getAllCourses', () => {
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

      jest.spyOn(courseRepository, 'find').mockResolvedValueOnce(courses);

      const result = await service.getAllCourses();

      expect(result).toEqual(courses);
      expect(courseRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});

export {};
