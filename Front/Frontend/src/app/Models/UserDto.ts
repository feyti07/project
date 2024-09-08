export interface UserDto {
    id?: number;
    email: string;
    username: string;
    password: string;
    matricule?: string;
    active?: Boolean;
    role?: string;
  }
  