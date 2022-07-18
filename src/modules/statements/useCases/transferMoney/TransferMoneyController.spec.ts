import request from "supertest";
import { Connection, createConnection } from "typeorm";

import {app} from "../../../../app";

let connection: Connection;
let token: string;

const baseUrl = "/api/v1";

describe("Transfer Money Controller", () => {
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

      await request(app)
        .post(`${baseUrl}/statements/deposit`)
        .set({
          "Authorization": `Bearer ${token}`
        })
        .send({
          amount: 100,
          description: "testDescription",
        });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close()
  })

  it("should be able to transfer money to another user", async () => {
    await request(app)
      .post(`${baseUrl}/users`)
      .send({
        email: "user2@test.com.br",
        name: "User2",
        password: "testPassword"
      });

    const receiverUser = await request(app)
      .post(`${baseUrl}/sessions`)
      .send({
        email: "user2@test.com.br",
        password: "testPassword"
      });

    const transfer = await request(app)
      .post(`${baseUrl}/statements/transfers/${receiverUser.body.user.id}`)
      .set({
        "Authorization": `Bearer ${token}`
      })
      .send({
        amount: 90,
        description: "testDescription",
      })
      .expect(201);

    console.log(transfer.body)

    const balanceSenderUser = await request(app)
      .get(`${baseUrl}/statements/balance`)
      .set({
        "Authorization": `Bearer ${token}`
      });

    const balanceReceiverUser = await request(app)
      .get(`${baseUrl}/statements/balance`)
      .set({
        "Authorization": `Bearer ${receiverUser.body.token}`
      });

      console.log(balanceReceiverUser.body, balanceSenderUser.body)

    expect(balanceReceiverUser.body.balance).toBe(90);
    expect(balanceSenderUser.body.balance).toBe(10);

  })
})
