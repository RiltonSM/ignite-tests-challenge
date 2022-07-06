import { v4 as uuidV4 } from "uuid";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let usersRepositoryInMemory: IUsersRepository;
let statementRepositoryInMemory: IStatementsRepository;

describe("Get balance for a user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory);
  });

  it("should be able to get balance for a user", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "test@test.com.br",
      name: "TestName",
      password: "TestPassword"
    });

    await statementRepositoryInMemory.create({
      user_id: user.id as string,
      amount: 100,
      description: "testDescription",
      type: OperationType.DEPOSIT
    });

    const { balance } = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(balance).toBe(100);
  });

  it("should not be able to get balance", () => {
    expect(async () => {
      const fakeUserId = uuidV4();

      await getBalanceUseCase.execute({
        user_id: fakeUserId
      });
    }).rejects.toBeInstanceOf(GetBalanceError)
  });
});
