export const baseTimeDateMaker = (diaryDate:string):string[] => {
  const [hour, min] = new Date()
    .toLocaleTimeString("ko-KR", {
      timeZone: "Asia/Seoul",
      hour12: false,
    })
    .split(" ")
    .map((e) => e.slice(0, -1).padStart(2, "0"));

  //날씨 api는 24를 받지 않음
  if (hour === "24") {
    return ["0000", diaryDate];
  }

  //날씨 api는 정각 10분 이전까지 데이터 조회 불가
  if (Number(min) <= 10) {
    //00시 10분 이전일 경우 전일 23시의 데이터 사용
    if (Number(hour) < 1) {
      return ["2300", yesterDayMaker()];
    }

    return [`${Number(hour) - 1}00`, diaryDate];
  }

  //날씨 api는 초단기실황예보이지만 분 단위의 데이터는 주지 않음
  return [hour + "00", diaryDate];
};

export const yesterDayMaker = (): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const date = String(yesterday.getDate()).padStart(2, '0');

  return year + month + date;
};
