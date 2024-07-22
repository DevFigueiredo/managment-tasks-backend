import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from 'shared/utils/enums/status.enum';

export class Task {
  @ApiProperty()
  id: string;
  @ApiProperty({ enum: ['pending', 'inprogress', 'closed'] })
  status: StatusEnum | string;
  @ApiProperty()
  text: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
