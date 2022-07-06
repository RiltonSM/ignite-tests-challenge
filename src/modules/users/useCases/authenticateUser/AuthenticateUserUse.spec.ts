import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    await createUserUseCase.execute({
      email: "test@test.com.br",
      name: "Test",
      password: "test123"
    });
  });

  beforeEach(() => {
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate a user", async () => {
    const userAuthenticated = await authenticateUserUseCase.execute({
      email: "test@test.com.br",
      password: "test123"
    });

    expect(userAuthenticated).toHaveProperty("token");
  });

  it("should not be able to authenticate a user because the password is wrong", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@test.com.br",
        password: "WrongPassword"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user because the email is wrong", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "WrongEmail",
        password: "test123"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
