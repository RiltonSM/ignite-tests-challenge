import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileCaseUse: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileCaseUse = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to return the profile user", async () => {
    const userCreated = await usersRepositoryInMemory.create({
      email: "test@test.com.br",
      name: "Test",
      password: "test123"
    });

    const userProfile = await showUserProfileCaseUse.execute(userCreated.id as string);


    expect(userProfile.email).toBe(userCreated.email);
    expect(userProfile.name).toBe(userCreated.name);
  });
});
