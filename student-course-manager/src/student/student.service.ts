import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../DTO/create-student.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(Student)
    private readonly employeeRepository: Repository<Student>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Método de criar novo usuário:
  async createUser(createUser: CreateStudentDto): Promise<Student> {
    try {
      const existingUser = await this.employeeRepository.findOne({
        where: { email: createUser.email },
      });
      if (existingUser) {
        this.logger.warn(
          `Tentativa de criar usuário com e-mail duplicado: ${createUser.email}`,
        );
        throw new ConflictException('Usuário já cadastrado');
      }
      const hashedPassword = await this.hashPassword(createUser.password);
      const newUser = this.employeeRepository.create({
        ...createUser,
        password: hashedPassword,
      });
      const savedUser = await this.employeeRepository.save(newUser);
      this.logger.log(`Novo usuário criado com ID: ${savedUser.id}`);

      return savedUser;
    } catch (error) {
      this.logger.error(`Erro ao criar usuário: ${error.message}`);
      throw error;
    }
  }

  // Método de pesquisar usuário por ID:
  async findUserByID(id: number): Promise<any> {
    try {
      const user = await this.employeeRepository.findOne({
        where: { id },
      });

      if (!user) {
        this.logger.warn(`Usuário com ID ${id} não encontrado`);
        throw new NotFoundException('Usuário não encontrado');
      }

      const userFound = {
        name: user.name,
        id: user.id,
        email: user.email,
      };

      this.logger.debug(`Usuário encontrado: ${id}`);
      return userFound;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário: ${error.message}`);
      throw error;
    }
  }
}
