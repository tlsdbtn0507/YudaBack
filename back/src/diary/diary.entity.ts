import { Days, Weathers } from "src/configs/weathers.model";
import { UserEntity } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DiaryEntity extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diaryTitle: string;

  @Column()
  diaryContent: string;

  @Column()
  diaryDate: string;

  @Column()
  diaryDay: Days

  @Column()
  temp: number
  
  @Column()
  rain: number
  
  @Column()
  main: string

  @ManyToOne(type => UserEntity, user => user.diary, { eager: false })
  user:UserEntity

};
