import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferMoneyUseCase } from "./TransferMoneyUseCase";

class TransferMoneyController {
  async handle(request: Request, response: Response): Promise<Response>{
    const { amount, description } = request.body;
    const { user_id } = request.params;
    const { id: sender_id } = request.user;

    const transferMoneyUseCase = container.resolve(TransferMoneyUseCase)

    console.log(user_id, sender_id)

    await transferMoneyUseCase.execute({
      amount,
      description,
      user_id,
      sender_id
    });

    return response.status(201).send();
  }
}

export { TransferMoneyController }
