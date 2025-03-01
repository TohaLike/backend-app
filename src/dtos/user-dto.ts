import { UserProps } from "../types";

export class UserDto {
  id: string;

  constructor(model: UserProps) {
    this.id = model.id;
  }
}