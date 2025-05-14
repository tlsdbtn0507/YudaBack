import { Test, TestingModule } from "@nestjs/testing";
import { DiaryService } from "./diary.service";
import { UserEntity } from "src/user/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DiaryEntity } from "./diary.entity";
import { HttpService } from "@nestjs/axios";
import { CoordService } from "src/coords/coords.service";

describe("DiaryService의 함수들 테스트", () => {
  let diaryService: DiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiaryService,
        {
          provide: getRepositoryToken(DiaryEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            // 여기에 필요한 mock 함수들 추가
          },
        },
        {
          provide: HttpService,
          useValue: {}, // 필요하면 mock 처리
        },
        {
          provide: CoordService,
          useValue: {}, // 필요하면 mock 처리
        },
      ],
    }).compile();
    diaryService = module.get<DiaryService>(DiaryService);
  });
  it("getdiaryByToday", async () => {
    const user = {
      id: 1,
      name: "test",
      userId: "test",
      pw: "test",
    } as UserEntity;

    const result = await diaryService.getDiaryByToday(user, "Asia/Seoul");
    expect(result).toEqual("2025-05-12");
  });
});
