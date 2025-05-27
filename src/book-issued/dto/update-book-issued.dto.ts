import { PartialType } from '@nestjs/mapped-types';
import { CreateBookIssuedDto } from './create-book-issued.dto';

export class UpdateBookIssuedDto extends PartialType(CreateBookIssuedDto) {} 