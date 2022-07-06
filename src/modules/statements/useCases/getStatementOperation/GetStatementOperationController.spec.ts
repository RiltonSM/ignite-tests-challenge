import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { StatementsRepository } from "../../repositories/StatementsRepository";

let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;
let connection: Connection;
let statement: Statement;
let token: string;

const baseUrl = "/api/v1";

describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
      connection = await createConnection();
      await connection.runMigrations();

      usersRepository = new UsersRepository();
      statementRepository = new StatementsRepository();

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

      statement = await statementRepository.create({
        user_id: session.body.user.id as string,
        amount: 100,
        description: "testDescription",
        type: OperationType.DEPOSIT
      })
    });

    afterAll(async () => {
      await connection.dropDatabase();
      await connection.close()
    })

    it("should be able to get statement operation", async () => {
      const response = await request(app)
        .get(`${baseUrl}/statements/${statement.id}`)
        .set({
          "Authorization": `Bearer ${token}`
        })

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
    })
})
