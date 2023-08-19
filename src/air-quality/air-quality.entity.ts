import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AirQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  pollution: Record<string, any>;

  @Column({ type: 'datetime' })
  dateTime: string;
}
