import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vehiculo } from "./Vehiculo";

@Index("PK_TipoVinulacion", ["id"], { unique: true })
@Entity("TipoVinculacion", { schema: "dbo" })
export class TipoVinculacion {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.idTipoVinculacion)
  vehiculos: Vehiculo[];
}
