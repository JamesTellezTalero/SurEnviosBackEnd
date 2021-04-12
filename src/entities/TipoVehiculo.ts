import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Servicio } from "./Servicio";
import { CategoriaVehiculo } from "./CategoriaVehiculo";
import { Vehiculo } from "./Vehiculo";
import { jsonMember, jsonObject } from "typedjson";

@jsonObject 
@Index("PK_TipoCamion", ["id"], { unique: true })
@Entity("TipoVehiculo", { schema: "dbo" })
export class TipoVehiculo {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("bit", { name: "Estado" })
  estado: boolean;

  @jsonMember
  @Column("varchar", { name: "Imagen", nullable: true, length: 200 })
  imagen: string | null;

  @OneToMany(() => Servicio, (servicio) => servicio.idTipoVehiculo)
  servicios: Servicio[];

  @ManyToOne(
    () => CategoriaVehiculo,
    (categoriaVehiculo) => categoriaVehiculo.tipoVehiculos
  )
  @JoinColumn([{ name: "IdCategoria", referencedColumnName: "id" }])
  idCategoria: CategoriaVehiculo;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.idTipoVehiculo)
  vehiculos: Vehiculo[];
}
