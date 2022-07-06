import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
        email: "test@test.com.br",
        name: "Test",
        password: "test123"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user if it already exist", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "test@test.com.br",
        name: "Test",
        password: "test123"
      });

      await createUserUseCase.execute({
        email: "test@test.com.br",
        name: "Test",
        password: "test123"
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
