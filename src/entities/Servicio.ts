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
import { Municipio } from "./Municipio";
import { TipoServicio } from "./TipoServicio";
import { Cliente } from "./Cliente";
import { Usuario } from "./Usuario";
import { TipoVehiculo } from "./TipoVehiculo";
import { UsuarioRequest } from "./UsuarioRequest";

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

  @Column("int", { name: "Peso" })
  peso: number;

  @Column("int", { name: "Cantidad", nullable: true })
  cantidad: number | null;

  @Column("bit", { name: "Programado", default: () => "(0)" })
  programado: boolean;

  @Column("datetime", { name: "FechaProgramacion", nullable: true })
  fechaProgramacion: Date | null;

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

  @ManyToOne(() => Municipio, (municipio) => municipio.servicios)
  @JoinColumn([{ name: "IdCiudadOrigen", referencedColumnName: "id" }])
  idCiudadOrigen: Municipio;

  @ManyToOne(() => Municipio, (municipio) => municipio.servicios2)
  @JoinColumn([{ name: "IdCiudadDestino", referencedColumnName: "id" }])
  idCiudadDestino: Municipio;

  @ManyToOne(() => TipoServicio, (tipoServicio) => tipoServicio.servicios)
  @JoinColumn([{ name: "IdTipoServicio", referencedColumnName: "id" }])
  idTipoServicio: TipoServicio;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicios)
  @JoinColumn([{ name: "IdCliente", referencedColumnName: "id" }])
  idCliente: Cliente;

  @ManyToOne(() => Usuario, (usuario) => usuario.servicios)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario: Usuario;

  @ManyToOne(() => TipoVehiculo, (tipoVehiculo) => tipoVehiculo.servicios)
  @JoinColumn([{ name: "IdTipoVehiculo", referencedColumnName: "id" }])
  idTipoVehiculo: TipoVehiculo;

  @OneToMany(
    () => UsuarioRequest,
    (usuarioRequest) => usuarioRequest.idServicio2
  )
  usuarioRequests: UsuarioRequest[];
}
