import { UserDto } from "./UserDto";

export interface ChatMesssage{
    id?: number; // Optional if it’s auto-generated
  message: string;
  user: UserDto;
    
}