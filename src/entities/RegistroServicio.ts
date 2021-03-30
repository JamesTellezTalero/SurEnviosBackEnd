import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ElementoRegistro } from "./ElementoRegistro";
import { Servicio } from "./Servicio";
import { EstadoServicio } from "./EstadoServicio";

@Index("PK_RegistroServicio", ["id"], { unique: true })
@Entity("RegistroServicio", { schema: "dbo" })
export class RegistroServicio {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("datetime", { name: "FechaRegistro", default: () => "getdate()" })
  fechaRegistro: Date;

  @Column("varchar", { name: "Observacion", nullable: true })
  observacion: string | null;

  @OneToMany(
    () => ElementoRegistro,
    (elementoRegistro) => elementoRegistro.idRegistroServicio
  )
  elementoRegistros: ElementoRegistro[];

  @ManyToOne(() => Servicio, (servicio) => servicio.registroServicios)
  @JoinColumn([{ name: "IdServicio", referencedColumnName: "id" }])
  idServicio: Servicio;

  @ManyToOne(
    () => EstadoServicio,
    (estadoServicio) => estadoServicio.registroServicios
  )
  @JoinColumn([{ name: "IdEstadoServicio", referencedColumnName: "id" }])
  idEstadoServicio: EstadoServicio;
}
