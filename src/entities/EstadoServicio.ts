import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroServicio } from "./RegistroServicio";
import { Servicio } from "./Servicio";

@Index("PK_EstadoServicio", ["id"], { unique: true })
@Entity("EstadoServicio", { schema: "dbo" })
export class EstadoServicio {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 50 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(
    () => RegistroServicio,
    (registroServicio) => registroServicio.idEstadoServicio
  )
  registroServicios: RegistroServicio[];

  @OneToMany(() => Servicio, (servicio) => servicio.estadoServicio)
  servicios: Servicio[];
}
