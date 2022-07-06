import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";

let statementRepository: IStatementsRepository;
let connection: Connection;
let token: string;
let session: any;

const baseUrl = "/api/v1";

describe("Get Balance Controller", () => {
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

    session = await request(app)
      .post(`${baseUrl}/sessions`)
      .send({
        email: "test@test.com.br",
        password: "testPassword"
      });

    token = session.body.token;
  });

  beforeEach(async () => {
    statementRepository = new StatementsRepository();

    await statementRepository.create({
      user_id: session.body.user.id as string,
      amount: 100,
      description: "testDescription",
      type: OperationType.DEPOSIT
    })
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it("should be able to get the balance", async () => {
    const response = await request(app)
      .get(`${baseUrl}/statements/balance`)
      .set({
        "Authorization": `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(100);
  })
});
