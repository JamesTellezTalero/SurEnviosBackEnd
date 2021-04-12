import { jsonMember, jsonObject } from "typedjson";
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
@jsonObject
export class EstadoServicio {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 50 })
  nombre: string;

  @jsonMember
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
