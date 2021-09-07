import 'reflect-metadata';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Persona } from "./Persona";
import { Propietario } from "./Propietario";
import { jsonMember, jsonObject } from "typedjson";

@jsonObject
@Index("PK_TipoDocumento", ["id"], { unique: true })
@Entity("TipoDocumento", { schema: "dbo" })
export class TipoDocumento {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Cliente, (cliente) => cliente.idTipoDocumento)
  clientes: Cliente[];

  @OneToMany(() => Persona, (persona) => persona.idTipoDocumento)
  personas: Persona[];

  @OneToMany(() => Propietario, (propietario) => propietario.idTipoDocumento)
  propietarios: Propietario[];
}
