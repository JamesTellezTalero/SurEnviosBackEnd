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

@Index("PK_TipoCamion", ["id"], { unique: true })
@Entity("TipoVehiculo", { schema: "dbo" })
export class TipoVehiculo {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado" })
  estado: boolean;

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
