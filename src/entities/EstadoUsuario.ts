import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("PK_EstadoUsuario", ["id"], { unique: true })
@Entity("EstadoUsuario", { schema: "dbo" })
export class EstadoUsuario {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 50 })
  nombre: string;

  @OneToMany(() => Usuario, (usuario) => usuario.idEstadoUsuario)
  usuarios: Usuario[];
}
