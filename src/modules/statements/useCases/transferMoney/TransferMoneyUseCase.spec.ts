import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferMoneyUseCase } from "./TransferMoneyUseCase"

let transferMoneyUseCase: TransferMoneyUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository

describe("Tranfer Money between users", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    transferMoneyUseCase = new TransferMoneyUseCase(statementRepository, usersRepository);
  })

  it("should be able to transfer money to another user", async () => {
    const senderUser = await usersRepository.create({
      email: "fujrevi@ivrothus.re",
      name: "Russell Farmer",
      password: "pxwebjh4"
    });

    const receiveUser = await usersRepository.create({
      email: "qwertty@ivrothus.re",
      name: "Russell Industrial",
      password: "pxwebjh5"
    })

    await statementRepository.create({
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: senderUser.id as string
    });

    const transferStatements = await transferMoneyUseCase.execute({
      amount: 90,
      description: "transfer test",
      sender_id: senderUser.id as string,
      user_id: receiveUser.id as string
    });

    const senderBalance = await statementRepository.getUserBalance({
      user_id: senderUser.id as string
    })

    const receiverBalance = await statementRepository.getUserBalance({
      user_id: receiveUser.id as string
    });

    expect(receiverBalance.balance).toBe(90);
    expect(senderBalance.balance).toBe(10);
  })
})
