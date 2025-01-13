import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Course } from './courses.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, student => student.enrollments)
  @JoinColumn({ name: 'user_id' })
  user: Student;

  @ManyToOne(() => Course, course => course.enrollments) // Propriedade curso
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @CreateDateColumn({ type: 'timestamp' })
  enrolled_at: Date;
}
