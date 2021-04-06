import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TripulanteVehiculo } from "./TripulanteVehiculo";
import { Propietario } from "./Propietario";
import { TipoVehiculo } from "./TipoVehiculo";
import { TipoVinculacion } from "./TipoVinculacion";
import { Usuario } from "./Usuario";

@Index("PK_Camion", ["id"], { unique: true })
@Entity("Vehiculo", { schema: "dbo" })
export class Vehiculo {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Placa", length: 10 })
  placa: string;

  @Column("varchar", { name: "Descripcion", length: 500 })
  descripcion: string;

  @Column("float", { name: "Capacidad", precision: 53 })
  capacidad: number;

  @Column("bit", { name: "Estado", default: () => "(0)" })
  estado: boolean;

  @Column("varchar", { name: "Marca", nullable: true, length: 100 })
  marca: string | null;

  @Column("varchar", { name: "Modelo", nullable: true, length: 10 })
  modelo: string | null;

  @OneToMany(
    () => TripulanteVehiculo,
    (tripulanteVehiculo) => tripulanteVehiculo.idVehiculo2
  )
  tripulanteVehiculos: TripulanteVehiculo[];

  @ManyToOne(() => Propietario, (propietario) => propietario.vehiculos)
  @JoinColumn([{ name: "Propietario", referencedColumnName: "id" }])
  propietario: Propietario;

  @ManyToOne(() => TipoVehiculo, (tipoVehiculo) => tipoVehiculo.vehiculos)
  @JoinColumn([{ name: "IdTipoVehiculo", referencedColumnName: "id" }])
  idTipoVehiculo: TipoVehiculo;

  @ManyToOne(
    () => TipoVinculacion,
    (tipoVinculacion) => tipoVinculacion.vehiculos
  )
  @JoinColumn([{ name: "IdTipoVinculacion", referencedColumnName: "id" }])
  idTipoVinculacion: TipoVinculacion;

  @ManyToOne(() => Usuario, (usuario) => usuario.vehiculos)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario: Usuario;
}
