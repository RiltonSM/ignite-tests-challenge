import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferMoneyDTO } from "./ITransferMoneyDTO";
import { TransferMoneyError } from "./TransferMoneyError";

@injectable()
class TransferMoneyUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementRepository: IStatementsRepository,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}
  async execute({
    amount,
    description,
    sender_id,
    user_id
  }: ITransferMoneyDTO){
    const receiverUser = this.usersRepository.findById(user_id);

    if(!receiverUser){
      throw new TransferMoneyError.ReceiverUserNotFound()
    }

    const senderUserBalance = await this.statementRepository.getUserBalance({
      user_id: sender_id
    });

    if(senderUserBalance.balance < amount){
      throw new TransferMoneyError.InsufficientFunds();
    }

    await this.statementRepository.createTransfer({
      amount,
      description,
      sender_id,
      user_id
    });
  }
}

export { TransferMoneyUseCase }
