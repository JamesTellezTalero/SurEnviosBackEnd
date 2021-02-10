import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tripulante } from "./Tripulante";

@Index("PK_TipoTripulante", ["id"], { unique: true })
@Entity("TipoTripulante", { schema: "dbo" })
export class TipoTripulante {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Tripulante, (tripulante) => tripulante.idTipoTripulante)
  tripulantes: Tripulante[];
}
