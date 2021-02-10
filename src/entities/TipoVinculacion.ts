import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Camion } from "./Camion";

@Index("PK_TipoVinulacion", ["id"], { unique: true })
@Entity("TipoVinculacion", { schema: "dbo" })
export class TipoVinculacion {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Camion, (camion) => camion.idTipoVinculacion)
  camions: Camion[];
}
