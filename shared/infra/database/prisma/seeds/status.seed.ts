import { StatusTypeEnum } from '../../../../utils/enums/status.enum';
import { prisma } from '../index';
import { Logger } from '@nestjs/common';

async function main() {
  const statuList = [
    { description: 'Pendente', type: StatusTypeEnum.pending, color: '#FF0000' }, // Vermelho
    {
      description: 'Em Progresso',
      type: StatusTypeEnum.inprogress,
      color: '#FFFF00',
    }, // Amarelo
    {
      description: 'Finalizada',
      type: StatusTypeEnum.closed,
      color: '#00FF00',
    }, // Verde
  ];

  for (const status of statuList) {
    await prisma.status.upsert({
      where: { description: status.description },
      update: {}, // Não atualiza nada se o status já existir
      create: {
        description: status.description,
        type: status.type,
        color: status.color,
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
