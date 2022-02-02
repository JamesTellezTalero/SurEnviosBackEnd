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
import { jsonMember, jsonObject } from "typedjson";

@jsonObject
@Index("PK_Camion", ["id"], { unique: true })
@Entity("Vehiculo", { schema: "dbo" })
export class Vehiculo {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Placa", length: 10 })
  placa: string;

  @jsonMember
  @Column("varchar", { name: "Descripcion", length: 500 })
  descripcion: string;

  @jsonMember
  @Column("float", { name: "Capacidad", precision: 53 })
  capacidad: number;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(0)" })
  estado: boolean;

  @jsonMember
  @Column("varchar", { name: "Marca", nullable: true, length: 100 })
  marca: string | null;

  @jsonMember
  @Column("varchar", { name: "Modelo", nullable: true, length: 10 })
  modelo: string | null;

  @jsonMember
  @Column("ntext", { name: "Foto", nullable: true })
  foto: string | null;

  @OneToMany(
    () => TripulanteVehiculo,
    (tripulanteVehiculo) => tripulanteVehiculo.idVehiculo2
  )
  tripulanteVehiculos: TripulanteVehiculo[];

  @jsonMember
  @Column("int", { name: "Propietario", nullable: true })
  propietario: number | null;

  @jsonMember(()=>TipoVehiculo)
  @ManyToOne(() => TipoVehiculo, (tipoVehiculo) => tipoVehiculo.vehiculos)
  @JoinColumn([{ name: "IdTipoVehiculo", referencedColumnName: "id" }])
  idTipoVehiculo: TipoVehiculo;

  @jsonMember(()=>TipoVinculacion)
  @ManyToOne(
    () => TipoVinculacion,
    (tipoVinculacion) => tipoVinculacion.vehiculos
  )
  @JoinColumn([{ name: "IdTipoVinculacion", referencedColumnName: "id" }])
  idTipoVinculacion: TipoVinculacion;

  @jsonMember(()=>Usuario)
  @ManyToOne(() => Usuario, (usuario) => usuario.vehiculos)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario: Usuario;
}
