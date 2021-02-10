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
import { EstadoServicio } from "./EstadoServicio";
import { Cliente } from "./Cliente";
import { Municipio } from "./Municipio";
import { TipoCamion } from "./TipoCamion";

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

  @OneToMany(() => Pago, (pago) => pago.idServicio)
  pagos: Pago[];

  @OneToMany(
    () => RegistroServicio,
    (registroServicio) => registroServicio.idServicio
  )
  registroServicios: RegistroServicio[];

  @ManyToOne(() => EstadoServicio, (estadoServicio) => estadoServicio.servicios)
  @JoinColumn([{ name: "EstadoServicio", referencedColumnName: "id" }])
  estadoServicio: EstadoServicio;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicios)
  @JoinColumn([{ name: "IdCliente", referencedColumnName: "id" }])
  idCliente: Cliente;

  @ManyToOne(() => Municipio, (municipio) => municipio.servicios)
  @JoinColumn([{ name: "IdCiudadOrigen", referencedColumnName: "id" }])
  idCiudadOrigen: Municipio;

  @ManyToOne(() => Municipio, (municipio) => municipio.servicios2)
  @JoinColumn([{ name: "IdCiudadDestino", referencedColumnName: "id" }])
  idCiudadDestino: Municipio;

  @ManyToOne(() => TipoCamion, (tipoCamion) => tipoCamion.servicios)
  @JoinColumn([{ name: "IdTipoCamion", referencedColumnName: "id" }])
  idTipoCamion: TipoCamion;
}
