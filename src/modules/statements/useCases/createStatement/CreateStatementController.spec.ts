import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
let token: string;

const baseUrl = "/api/v1";

describe("Create Statement Controller", () => {
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

  it("should be able to create a new deposit", async () => {
    const response = await request(app)
      .post(`${baseUrl}/statements/deposit`)
      .set({
        "Authorization": `Bearer ${token}`
      })
      .send({
        amount: 100,
        description: "testDescription",
      });

    expect(response.status).toBe(201);
  });

  it("should be able to create a new withdraw", async () => {
    await request(app)
      .post(`${baseUrl}/statements/deposit`)
      .set({
        "Authorization": `Bearer ${token}`
      })
      .send({
        amount: 100,
        description: "testDescription",
      });

    const response = await request(app)
      .post(`${baseUrl}/statements/withdraw`)
      .set({
        "Authorization": `Bearer ${token}`
      })
      .send({
        amount: 100,
        description: "testDescription",
      });

    expect(response.status).toBe(201);
  })
})
