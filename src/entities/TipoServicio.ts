import { jsonMember, jsonObject } from "typedjson";
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Servicio } from "./Servicio";

@jsonObject
@Index("TipoServicio_PK", ["id"], { unique: true })
@Index("TipoServicio_UN", ["id"], { unique: true })
@Entity("TipoServicio", { schema: "dbo" })
export class TipoServicio {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Servicio, (servicio) => servicio.idTipoServicio)
  servicios: Servicio[];
}
