import { ApiProperty } from '@nestjs/swagger';
import { Status } from './status';

export class Task {
  @ApiProperty()
  id: string;
  @ApiProperty()
  text: string;
  @ApiProperty()
  title: string;
  @ApiProperty({ type: Date })
  startDate: Date | string;
  @ApiProperty({ type: Date })
  endDate: Date | string;

  @ApiProperty()
  statusId: string;

  @ApiProperty({ type: Status })
  Status: Status;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
