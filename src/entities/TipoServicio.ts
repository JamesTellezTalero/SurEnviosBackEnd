import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Servicio } from "./Servicio";

@Index("TipoServicio_PK", ["id"], { unique: true })
@Index("TipoServicio_UN", ["id"], { unique: true })
@Entity("TipoServicio", { schema: "dbo" })
export class TipoServicio {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Servicio, (servicio) => servicio.idTipoServicio)
  servicios: Servicio[];
}
