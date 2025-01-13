import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from 'src/entities/student.entity';
import { CreateStudentDto } from 'src/DTO/create-student.dto';

@Controller('student')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createUser(@Body() createUserDTO: CreateStudentDto): Promise<Student> {
    try {
      this.logger.log(
        `Tentativa de criar usuário com e-mail: ${createUserDTO.email}`,
      );
      const user = await this.studentService.createUser(createUserDTO);
      this.logger.log(`Usuário criado com sucesso: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findByID(@Param('id') id: number): Promise<Student> {
    try {
      this.logger.log(`Buscando usuário com ID: ${id}`);
      return await this.studentService.findUserByID(id);
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário: ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
