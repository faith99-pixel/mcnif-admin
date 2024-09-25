interface IApplicationError {
  Text: string;
  Code: string;
}

/**
 * The ApplicationError class
 */
export class ApplicationError {
  //#region User Errors

  /**
   * The error message for ~ User with specified User ID not found
   */
  static UserWithIdNotFound: IApplicationError = {
    Text: "User with specified User ID not found",
    Code: "USER_1000",
  };
  

  //#endregion
}
