import { ApiProperty } from '@nestjs/swagger';

export class Status {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  type: string;
}
