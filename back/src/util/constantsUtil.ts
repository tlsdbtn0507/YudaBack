export const makeWeatherURL = (weatherURLMaterials: string[]) => {
  
  const [base_date, base_time, x, y] = weatherURLMaterials;

  return (
    process.env.WEATHER_URL +
    process.env.WEATHER_KEY +
    `&base_date=${base_date}` +
    `&base_time=${base_time}` +
    `&nx=${x}&ny=${y}`
  );
}