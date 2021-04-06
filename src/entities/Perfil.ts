import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("Perfil_PK", ["id"], { unique: true })
@Index("Perfil_UN", ["id"], { unique: true })
@Entity("Perfil", { schema: "dbo" })
export class Perfil {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Usuario, (usuario) => usuario.idPerfil)
  usuarios: Usuario[];
}
