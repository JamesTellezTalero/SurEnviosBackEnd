import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Persona } from "./Persona";
import { Propietario } from "./Propietario";

@Index("PK_TipoDocumento", ["id"], { unique: true })
@Entity("TipoDocumento", { schema: "dbo" })
export class TipoDocumento {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Cliente, (cliente) => cliente.idTipoDocumento)
  clientes: Cliente[];

  @OneToMany(() => Persona, (persona) => persona.idTipoDocumento)
  personas: Persona[];

  @OneToMany(() => Propietario, (propietario) => propietario.idTipoDocumento)
  propietarios: Propietario[];
}
