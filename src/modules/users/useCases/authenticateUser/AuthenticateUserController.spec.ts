import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

const baseUrl = "/api/v1";

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
      .post(`${baseUrl}/users`)
      .send({
        email: "test@test.com.br",
        name: "TestName",
        password: "testPassword"
      });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it("should be able to authenticate a user", async () => {
    const response = await request(app)
      .post(`${baseUrl}/sessions`)
      .send({
        email: "test@test.com.br",
        password: "testPassword"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate a user", async () => {
    const response = await request(app)
      .post(`${baseUrl}/sessions`)
      .send({
        email: "test@test.com.br",
        password: "fakePassword"
      });

    expect(response.status).toBe(401);
  });
});
