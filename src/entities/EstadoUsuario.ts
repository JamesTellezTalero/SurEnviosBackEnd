import { jsonMember, jsonObject } from "typedjson";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@jsonObject
@Index("PK_EstadoUsuario", ["id"], { unique: true })
@Entity("EstadoUsuario", { schema: "dbo" })
export class EstadoUsuario {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 50 })
  nombre: string;

  @OneToMany(() => Usuario, (usuario) => usuario.idEstadoUsuario)
  usuarios: Usuario[];
}
