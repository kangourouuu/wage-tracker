
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from '../config/app.config';
import databaseConfig from '../config/database.config';
import jwtConfig from '../config/jwt.config';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { WageModule } from './features/wage/wage.module';
import { CalendarModule } from './features/calendar/calendar.module';
import { CommonModule } from './common/common.module';
import { AssistantModule } from './features/assistant/assistant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('database.url');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UserModule,
    WageModule,
    CalendarModule,
    AssistantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
