import { Injectable } from '@nestjs/common';

type WeatherResultObj = {
  baseDate:string,
  baseTime:string,
  category:string,
  nx: number,
  ny: number,
  obsrValue: string
}

@Injectable()
export class CoordService {
  constructor() { }
  


  // Lambert 변환 함수
  lambertProjection(lon: number, lat: number, map: any, code: number) {
    const PI = Math.PI;
    const DEGRAD = PI / 180.0;
    const RADDEG = 180.0 / PI;
    let re, olon, olat, sn, sf, ro;
    let slat1, slat2, alon, alat, xn, yn, ra, theta;

    if (map.first === 0) {
      re = map.Re / map.grid;
      slat1 = map.slat1 * DEGRAD;
      slat2 = map.slat2 * DEGRAD;
      olon = map.olon * DEGRAD;
      olat = map.olat * DEGRAD;

      sn = Math.tan(PI * 0.25 + slat2 * 0.5) / Math.tan(PI * 0.25 + slat1 * 0.5);
      sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
      sf = Math.tan(PI * 0.25 + slat1 * 0.5);
      sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
      ro = Math.tan(PI * 0.25 + olat * 0.5);
      ro = re * sf / Math.pow(ro, sn);
      map.first = 1;
    }

    if (code === 0) {  // (lon, lat) -> (x, y)
      ra = Math.tan(PI * 0.25 + lat * DEGRAD * 0.5);
      ra = re * sf / Math.pow(ra, sn);
      theta = lon * DEGRAD - olon;
      if (theta > PI) theta -= 2.0 * PI;
      if (theta < -PI) theta += 2.0 * PI;
      theta *= sn;
      const x = ra * Math.sin(theta) + map.xo;
      const y = ro - ra * Math.cos(theta) + map.yo;
      return { x: Math.floor(x + 1.5), y: Math.floor(y + 1.5) };
    } else {  // (x, y) -> (lon, lat)
      xn = lon - map.xo;
      yn = ro - lat + map.yo;
      ra = Math.sqrt(xn * xn + yn * yn);
      alat = Math.pow((re * sf / ra), (1.0 / sn));
      alat = 2.0 * Math.atan(alat) - PI * 0.5;
      theta = Math.atan2(xn, yn);
      alon = theta / sn + olon;
      return { lon: alon * RADDEG, lat: alat * RADDEG };
    }
  }

  // 위도, 경도 -> 격자 변환 함수
  convertToGrid(lat: string, long: string) {
    const map = {
      Re: 6371.00877, // 지구 반경
      grid: 5.0,      // 격자 간격
      slat1: 30.0,    // 첫 번째 표준 위도
      slat2: 60.0,    // 두 번째 표준 위도
      olon: 126.0,    // 기준 경도
      olat: 38.0,     // 기준 위도
      xo: 43,         // 기준 X 좌표
      yo: 136,        // 기준 Y 좌표
      first: 0        // 초기화 플래그
    };

    // 위도와 경도를 숫자로 변환
    const lon = parseFloat(long).toFixed(6);
    const latitude = parseFloat(lat).toFixed(6);

    // Lambert 변환 호출
    const gridCoords = this.lambertProjection(parseFloat(lon), parseFloat(latitude), map, 0);
    return gridCoords;
  };

  filterWeather(arr:WeatherResultObj[]) {
    return arr.map(e => {
      if (e.category === 'PTY') {
        
      }
    })
  }


}
