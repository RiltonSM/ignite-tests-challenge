import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferMoneyError {
  export class ReceiverUserNotFound extends AppError {
    constructor() {
      super('Receiver user not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
