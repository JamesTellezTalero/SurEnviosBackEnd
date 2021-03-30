import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pago } from "./Pago";
import { RegistroServicio } from "./RegistroServicio";
import { Camion } from "./Camion";
import { EstadoServicio } from "./EstadoServicio";
import { TipoCamion } from "./TipoCamion";
import { Cliente } from "./Cliente";
import { Municipio } from "./Municipio";

@Index("PK_Servicio", ["id"], { unique: true })
@Entity("Servicio", { schema: "dbo" })
export class Servicio {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "DireccionOrigen", length: 500 })
  direccionOrigen: string;

  @Column("varchar", { name: "DireccionDestino", length: 500 })
  direccionDestino: string;

  @Column("varchar", { name: "DescripcionCarga" })
  descripcionCarga: string;

  @Column("datetime", { name: "FechaSolicitud", default: () => "getdate()" })
  fechaSolicitud: Date;

  @Column("float", { name: "Valor", precision: 53 })
  valor: number;

  @Column("float", { name: "latOrigen", nullable: true, precision: 53 })
  latOrigen: number | null;

  @Column("float", { name: "lonOrigen", nullable: true, precision: 53 })
  lonOrigen: number | null;

  @Column("float", { name: "latDest", nullable: true, precision: 53 })
  latDest: number | null;

  @Column("float", { name: "lonDest", nullable: true, precision: 53 })
  lonDest: number | null;

  @OneToMany(() => Pago, (pago) => pago.idServicio)
  pagos: Pago[];

  @OneToMany(
    () => RegistroServicio,
    (registroServicio) => registroServicio.idServicio
  )
  registroServicios: RegistroServicio[];

  @ManyToOne(() => Camion, (camion) => camion.servicios)
  @JoinColumn([{ name: "IdCamion", referencedColumnName: "id" }])
  idCamion: Camion;

  @ManyToOne(() => EstadoServicio, (estadoServicio) => estadoServicio.servicios)
  @JoinColumn([{ name: "EstadoServicio", referencedColumnName: "id" }])
  estadoServicio: EstadoServicio;

  @ManyToOne(() => TipoCamion, (tipoCamion) => tipoCamion.servicios)
  @JoinColumn([{ name: "IdTipoCamion", referencedColumnName: "id" }])
  idTipoCamion: TipoCamion;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicios)
  @JoinColumn([{ name: "IdCliente", referencedColumnName: "id" }])
  idCliente: Cliente;

  @ManyToOne(() => Municipio, (municipio) => municipio.servicios)
  @JoinColumn([{ name: "IdCiudadOrigen", referencedColumnName: "id" }])
  idCiudadOrigen: Municipio;

  @ManyToOne(() => Municipio, (municipio) => municipio.servicios2)
  @JoinColumn([{ name: "IdCiudadDestino", referencedColumnName: "id" }])
  idCiudadDestino: Municipio;
}
