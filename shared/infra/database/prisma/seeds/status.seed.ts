import { StatusTypeEnum } from '../../../../utils/enums/status.enum';
import { prisma } from '../index';
import { Logger } from '@nestjs/common';

async function main() {
  const statuses = [
    { description: 'Pending', type: StatusTypeEnum.pending },
    { description: 'In Progress', type: StatusTypeEnum.inprogress },
    { description: 'Completed', type: StatusTypeEnum.closed },
  ];

  for (const status of statuses) {
    await prisma.status.upsert({
      where: { description: status.description },
      update: {}, // Não atualiza nada se o status já existir
      create: {
        description: status.description,
        type: status.type,
      },
    });
  }

  Logger.log('Seeding status complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
