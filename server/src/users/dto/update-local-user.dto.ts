import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalUserDto } from './create-local-user.dto';

export class UpdateLocalUserDto extends PartialType(CreateLocalUserDto) {}
