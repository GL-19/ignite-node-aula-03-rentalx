import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('cars-image')
class CarImage {
  @PrimaryColumn()
  id: string;

  @Column()
  car_id: string;

  @Column()
  image_name: string;

  @CreateDateColumn()
  created_at: Date;
}

export { CarImage };
