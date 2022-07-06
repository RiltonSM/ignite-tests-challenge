import { hash } from "bcryptjs";

import { User } from "../../../users/entities/User";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: IUsersRepository;
let statementRepositoryInMemory: IStatementsRepository;
let user: User;

describe("Create a statement", () => {
  beforeAll(async() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    const password = await hash("test", 8);

    user = await usersRepositoryInMemory.create({
      email: "test@test.com.br",
      password,
      name: "Test"
    });


  })

  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  })

  it("should be able to create a new desposit statement", async () => {

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "testDescription",
      type: OperationType.DEPOSIT
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a new withdraw statement with funds", async () => {
    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "testDescription",
      type: OperationType.DEPOSIT
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "testDescription",
      type: OperationType.WITHDRAW
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new withdraw statement without funds", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 100,
        description: "testDescription",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
})
