import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async CreateUser(AuthCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = AuthCredentialsDto;
    //hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async FindUser(
    AuthCredentialsDto: AuthCredentialsDto,
    jwtService: JwtService,
  ): Promise<{ accessToken: string }> {
    const { username, password } = AuthCredentialsDto;

    const user = await this.findOneBy({ username });

    if (user !== null && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayloadInterface = { username };

      const accessToken = await jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your credentials');
    }
  }
}
