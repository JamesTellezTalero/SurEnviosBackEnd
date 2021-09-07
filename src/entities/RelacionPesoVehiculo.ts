import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoVehiculo } from "./TipoVehiculo";

@Index("RelacionPesoVehiculo_PK", ["id"], { unique: true })
@Index("RelacionPesoVehiculo_UN", ["id"], { unique: true })
@Entity("RelacionPesoVehiculo", { schema: "dbo" })
export class RelacionPesoVehiculo {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "PesoMin" })
  pesoMin: number;

  @Column("int", { name: "PesoMax" })
  pesoMax: number;

  @ManyToOne(
    () => TipoVehiculo,
    (tipoVehiculo) => tipoVehiculo.relacionPesoVehiculos
  )
  @JoinColumn([{ name: "IdTipoVehiculo", referencedColumnName: "id" }])
  idTipoVehiculo: TipoVehiculo;
}
