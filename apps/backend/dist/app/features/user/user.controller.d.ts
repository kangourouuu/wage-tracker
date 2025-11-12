import { UserService } from "./user.service";
import { Mapper } from '@automapper/core';
import { UserDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    private readonly mapper;
    constructor(userService: UserService, mapper: Mapper);
    me(userId: string): Promise<UserDto>;
}
