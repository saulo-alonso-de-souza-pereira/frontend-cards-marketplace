// Interface para o usuário
export interface IUser {
  id: string;
  name: string;
  email: string;
}

// (POST /register)
export interface IRegisterResponse {
  userId: string;
}

// (POST /login)
export interface ILoginResponse {
  token: string;
  user: IUser;
}

// Interface de Carta
export interface ICard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

// (GET /me)
export interface IMeResponse extends IUser {
  cards: ICard[];
}
