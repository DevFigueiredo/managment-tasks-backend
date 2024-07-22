import { StatusEnum } from 'shared/utils/enums/status.enum';

export class Task {
  id: string;
  status: StatusEnum;
  text: string;
  title: string;
  startDate: string;
  endDate: string;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}
