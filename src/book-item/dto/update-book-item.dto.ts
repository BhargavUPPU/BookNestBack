import { PartialType } from '@nestjs/mapped-types';
import { CreateBookItemDto } from './create-book-item.dto';

export class UpdateBookItemDto extends PartialType(CreateBookItemDto) {} 