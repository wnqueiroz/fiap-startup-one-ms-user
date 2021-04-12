import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KAFKA_CLIENTS } from '../contants';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const ServicesKafkaClient = ClientsModule.registerAsync([
  {
    name: KAFKA_CLIENTS.SERVICES_SERVICE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService): ClientOptions => {
      const { kafka } = configService.get('app');

      return {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ms-auser',
            brokers: [`${kafka.host}:${kafka.port}`],
          },
          consumer: {
            groupId: 'ms-user-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      };
    },
  },
]);

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ServicesKafkaClient],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
