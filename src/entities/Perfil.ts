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
@Index("Perfil_PK", ["id"], { unique: true })
@Index("Perfil_UN", ["id"], { unique: true })
@Entity("Perfil", { schema: "dbo" })
export class Perfil {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Usuario, (usuario) => usuario.idPerfil)
  usuarios: Usuario[];
}
