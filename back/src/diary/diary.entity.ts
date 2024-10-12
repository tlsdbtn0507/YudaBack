import { Days, Weathers } from "src/configs/weathers.model";
import { UserEntity } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('diary')
export class DiaryEntity extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;
  @Column('jsonb') // feeling을 JSON 형식으로 저장
  feeling: {
    ment: string;
    level: number;
  };

  @Column('jsonb') // weather를 JSON 형식으로 저장
  weather: {
    weatherCond: string;
    weatherLevel: {
      ment: string;
      level: number;
    };
  };

  @Column({ type: 'varchar', length: 300 }) // 내용은 최대 300자로 제한
  feelingReason: string;

  @Column({ type: 'date' }) // 날짜 형식은 date 타입
  diaryDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) // 위도 소수점 4자리까지
  lat: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true }) // 경도 소수점 4자리까지
  long: string;

  @ManyToOne(type => UserEntity, user => user.diary, { eager: false })
  user:UserEntity

};
