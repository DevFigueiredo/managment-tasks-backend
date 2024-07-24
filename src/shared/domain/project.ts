import { ApiProperty } from '@nestjs/swagger';

export class Project {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: Date })
  startDate: Date | string;
  @ApiProperty({ type: Date })
  endDate: Date | string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
