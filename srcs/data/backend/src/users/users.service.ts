import { Injectable } from '@nestjs/common';
import { UserCategory } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { isURL } from 'class-validator';
import isImageURL from 'image-url-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserCategory)
    private usersRepository: Repository<UserCategory>,
  ) {}

  async create(user: UserDto) {
    const adjs: string[] = [
      'Elastic',
      'Valuable',
      'Ultra',
      'Massive',
      'Nebulous',
      'Ambitious',
      'Courageous',
      'Great',
    ];
    const animals: string[] = [
      'Dog',
      'Cat',
      'Duck',
      'Horse',
      'Cow',
      'Sheep',
      'Eagle',
      'Cheetah',
      'Leopardus',
      'Platypus',
    ];
    let found: boolean = false;
    let users: UserDto[];
    await this.findAll().then((res) => {
      users = res as UserDto[];
      while (!found) {
        const adj = adjs[Math.floor(Math.random() * adjs.length)];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const number = Math.floor(Math.random() * 999);
        const username: string = adj + animal + number;
        user.username = username;
        found = true;
        for (let i = 0; i < users.length; ++i) {
          if (users[i].username == username) {
            found = false;
          }
        }
      }
      user.avatar =
        'https://img.freepik.com/vecteurs-premium/profil-avatar-homme-icone-ronde_24640-14044.jpg?w=2000';
    });
    return this.usersRepository.insert(user);
  }

  findAll(): Promise<UserCategory[]> {
    return this.usersRepository.find();
  }

  findOneByUsername(username: string): Promise<UserCategory | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneByEmail(email: string): Promise<UserCategory | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneById(user_id: number): Promise<UserCategory | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('id = :id', { id: user_id })
      .getOne();
  }

  update(user: UserDto) {
    return this.usersRepository.save(user);
  }

  async toggleDoubleAuth(user_id: number) {
    let user: UserCategory;
    await this.findOneById(user_id).then((res) => {
      user = res as UserCategory;
    });
    if (!user) return;
    user.doubleAuth = !user.doubleAuth;
    this.update(user);
  }

  async removeByUsername(username: string): Promise<void> {
    await this.usersRepository.delete(username);
  }

  async removeById(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateStatus(user_id: number, status: number) {
    let user: UserDto;
    await this.findOneById(user_id).then(function (res) {
      user = res as UserDto;
    });
    if (!user) return;
    user.status = status;
    this.update(user);
  }

  async updateProfileByForm(user_id: number, new_user: UserDto) {
    let user: UserDto;
    let have_to_throw: boolean = false;
    let regex_image: RegExp = new RegExp(/(https?:\/\/.*\.(?:png|jpg|gif))/i);
    await this.findOneById(user_id).then((res) => {
      user = res as UserDto;
    });
    if (!user) return 'no user';
    const users: UserDto[] = await this.findAll();
    users.forEach(function (user) {
      if (
        new_user.username.length > 22 ||
        (user.username == new_user.username && user.id !== new_user.id)
      ) {
        return 'username error';
      }
    });
    if (!isURL(new_user.avatar)) {
      return 'not an url';
    }
    isImageURL(new_user.avatar).then((is_image) => {
      if (!is_image) {
        have_to_throw = true;
      }
    });
    if (have_to_throw || !regex_image.test(new_user.avatar)) {
      return 'not an image';
    }
    this.update(new_user);
  }

  async getUser(user_id: number) {
    let user: UserDto;
    if (typeof user_id === 'undefined') {
      return null;
    }
    await this.findOneById(user_id).then(function (res) {
      user = res as UserDto;
    });
    if (!user) return null;
    return user;
  }
}
