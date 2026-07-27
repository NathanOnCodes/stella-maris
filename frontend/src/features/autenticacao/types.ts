export interface Perfil {
  id: number;
  username: string;
  email: string;
  tipo: "master" | "admin" | "colunista";
  eh_administrador: boolean;
  eh_master: boolean;
}
