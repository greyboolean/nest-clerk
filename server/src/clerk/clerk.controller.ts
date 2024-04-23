import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { UpdateClerkDto } from './dto/update-clerk.dto';

@Controller('clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

  @Post()
  create(@Body() createClerkDto: CreateClerkDto) {
    return this.clerkService.create(createClerkDto);
  }

  @Get()
  findAll() {
    return this.clerkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clerkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClerkDto: UpdateClerkDto) {
    return this.clerkService.update(+id, updateClerkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clerkService.remove(+id);
  }
}
