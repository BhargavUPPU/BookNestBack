import { IsString, IsInt, Min, IsEmpty } from "class-validator";

export class CreateCollegeDto {
  @IsString()
  college_name: string;
  @IsString()
  college_location: string;

  @IsInt()
  @Min(0)
  total_students: number;
}
