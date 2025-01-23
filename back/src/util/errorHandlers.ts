import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorMap } from "src/constants/ErrorMap";

type ErrorDetails = {
  message: string;
  errorCode: string;
  statusCode: number;
};
export class ErrorHandler extends HttpException {
  private static errorMap: Record<string, ErrorDetails> = ErrorMap

  constructor(code: string,customError?:ErrorDetails) {
    const errorDetails = ErrorHandler.errorMap[code];

    if (!errorDetails) {
      // code가 매핑되지 않은 경우 기본 custom 에러 처리
      super(
        {
          message: customError.message,
          errorCode: customError.errorCode,
        },
        customError.statusCode
      );
    } else {
      // code에 따라 매핑된 에러 처리
      super(
        {
          message: errorDetails.message,
          errorCode: errorDetails.errorCode,
        },
        errorDetails.statusCode
      );
    }
  }
}