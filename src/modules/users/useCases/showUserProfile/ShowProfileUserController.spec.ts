import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let token: string;

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

      const session = await request(app)
      .post(`${baseUrl}/sessions`)
      .send({
        email: "test@test.com.br",
        password: "testPassword"
      });

    token = session.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it("should be able to show a user profile", async () => {
    const response = await request(app)
      .get(`${baseUrl}/profile`)
      .set({
        "Authorization": `Bearer ${token}`,
      })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
