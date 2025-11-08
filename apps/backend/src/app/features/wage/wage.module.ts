
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkEntry } from './entities/work-entry.entity';
import { WageService } from './wage.service';
import { WageController } from './wage.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkEntry]), UserModule],
  providers: [WageService],
  controllers: [WageController],
  exports: [WageService],
})
export class WageModule {}
