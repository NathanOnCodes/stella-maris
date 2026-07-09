export interface Perfil {
  id: number;
  username: string;
  email: string;
  tipo: "admin" | "colunista";
  eh_administrador: boolean;
}
