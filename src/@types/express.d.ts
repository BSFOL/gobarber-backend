declare namespace Express {
  export interface Request {//anexa o que criamos junto com o que já existe
    user: {
      id: string;
    };
  }
}