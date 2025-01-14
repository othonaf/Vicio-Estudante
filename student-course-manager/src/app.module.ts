import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Course } from './entities/courses.entity';
import { Enrollment } from './entities/enrollments.entity';
import { StudentService } from './student/student.service';
import { CoursesService } from './courses/courses.service';
import { CoursesController } from './courses/courses.controller';
import { StudentController } from './student/student.controller';
import { StudentModule } from './student/student.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, StudentModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Student, Course, Enrollment],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Student, Course, Enrollment]),
    CoursesModule,
    EnrollmentsModule,
  ],
  controllers: [StudentController, CoursesController],
  providers: [StudentService, CoursesService],
})
export class AppModule {}
