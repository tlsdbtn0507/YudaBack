import { HttpStatus } from "@nestjs/common";

export const ErrorMap = {
  WEATHER_API_ERROR: {
    message: "Failed to fetch weather data from external API",
    errorCode: "WEATHER_API_ERROR",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  FETCH_DATA: {
    message:"Failed to get data from DB",
    errorCode:"FETCH_DATA",
    statusCode:HttpStatus.INTERNAL_SERVER_ERROR
  },
  SAVE_DATA: {
    message:"Failed to save data in DB",
    errorCode:"SAVE_DATA",
    statusCode:HttpStatus.INTERNAL_SERVER_ERROR
  },
  BAD_REQUEST_DATA: {
    message: "Invalid request data",
    errorCode: "BAD_REQUEST_DATA",
    statusCode: HttpStatus.BAD_REQUEST,
  },
  NOT_FOUND: {
    message: "Resource not found",
    errorCode: "NOT_FOUND",
    statusCode: HttpStatus.NOT_FOUND,
  },
  UNAUTHORIZED: {
    message: "Unauthorized access",
    errorCode: "UNAUTHORIZED",
    statusCode: HttpStatus.UNAUTHORIZED,
  },
};