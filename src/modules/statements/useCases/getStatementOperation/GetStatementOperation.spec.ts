import { v4 as uuidV4 } from "uuid";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: IUsersRepository;
let statementRepositoryInMemory: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Get statement operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  })

  it("should be able to get a statement operation", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "test@test.com.br",
      name: "TestName",
      password: "testPassword"
    });

    const statement = await statementRepositoryInMemory.create({
      user_id: user.id as string,
      amount: 100,
      description: "testDescription",
      type: OperationType.DEPOSIT
    })

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: String(statement.id)
    });

    expect(operation).toHaveProperty("id");
    expect(operation.amount).toBe(statement.amount);
    expect(operation.type).toBe(statement.type);
  });

  it("should not be able to return opeartion because user don't exist", () => {
    expect(async () => {
      const fakeUserId = uuidV4();

      const statement = await statementRepositoryInMemory.create({
        user_id: fakeUserId,
        amount: 100,
        description: "testDescription",
        type: OperationType.DEPOSIT
      })

      await getStatementOperationUseCase.execute({
        user_id: fakeUserId as string,
        statement_id: String(statement.id)
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it("should not be able to return opeartion because the statement don't exist", () => {
    expect(async () => {
      const fakeStatementId = uuidV4();

      const user = await usersRepositoryInMemory.create({
        email: "test@test.com.br",
        name: "TestName",
        password: "testPassword"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: fakeStatementId
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
