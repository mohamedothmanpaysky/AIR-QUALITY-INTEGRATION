import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AirQualityController } from './controllers/air-quality.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AirQualityController],
  providers: [AppService],
})
export class AppModule {}
