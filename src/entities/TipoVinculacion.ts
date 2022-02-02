import { jsonMember, jsonObject } from "typedjson";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vehiculo } from "./Vehiculo";

@jsonObject
@Index("PK_TipoVinulacion", ["id"], { unique: true })
@Entity("TipoVinculacion", { schema: "dbo" })
export class TipoVinculacion {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.idTipoVinculacion)
  vehiculos: Vehiculo[];
}
