import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './air-quality/app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AirQualityController } from './air-quality/air-quality.controller';
import { AirQualityService } from './air-quality/air-quality.service';
import { AirQuality } from './air-quality/air-quality.entity';


@Module({
  imports: [ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [AirQuality],
        synchronize: true,
    }),
    TypeOrmModule.forFeature([AirQuality]),
    ScheduleModule.forRoot()],
  controllers: [AppController, AirQualityController],
  providers: [AppService , AirQualityService],
})
export class AppModule {}
