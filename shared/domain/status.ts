import { ApiProperty } from '@nestjs/swagger';
import { StatusTypeEnum } from '@shared/utils/enums/status.enum';

export class Status {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty({
    enum: [
      StatusTypeEnum.pending,
      StatusTypeEnum.closed,
      StatusTypeEnum.inprogress,
    ],
  })
  type: StatusTypeEnum | string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  default: boolean;
  @ApiProperty()
  projectId?: string;
}
