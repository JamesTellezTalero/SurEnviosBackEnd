import { jsonArrayMember, jsonMember, jsonObject } from "typedjson";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RelacionPesoVehiculo } from "./RelacionPesoVehiculo";
import { Servicio } from "./Servicio";
import { SubCategoriaVehiculo } from "./SubCategoriaVehiculo";
import { Vehiculo } from "./Vehiculo";

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

  @jsonArrayMember(RelacionPesoVehiculo)
  @OneToMany(
    () => RelacionPesoVehiculo,
    (relacionPesoVehiculo) => relacionPesoVehiculo.idTipoVehiculo
  )
  relacionPesoVehiculos: RelacionPesoVehiculo[];

  @OneToMany(() => Servicio, (servicio) => servicio.idTipoVehiculo)
  servicios: Servicio[];

  @ManyToOne(
    () => SubCategoriaVehiculo,
    (subCategoriaVehiculo) => subCategoriaVehiculo.tipoVehiculos
  )
  @JoinColumn([{ name: "IdSubCategoria", referencedColumnName: "id" }])
  idSubCategoria: SubCategoriaVehiculo;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.idTipoVehiculo)
  vehiculos: Vehiculo[];
}
