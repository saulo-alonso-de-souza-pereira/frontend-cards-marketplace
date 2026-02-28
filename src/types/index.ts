// Interface User
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

// Interface de Páginação de Cartas
export interface IPaginatedCards {
  list: ICard[];
  rpp: number;
  page: number;
  more: boolean;
}

// (GET /me)
export interface IMeResponse extends IUser {
  cards: ICard[];
}
