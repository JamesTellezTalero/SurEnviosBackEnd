import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoVehiculo } from "./TipoVehiculo";

@Index("CategoriaCamion_PK", ["id"], { unique: true })
@Index("CategoriaCamion_UN", ["id"], { unique: true })
@Entity("CategoriaVehiculo", { schema: "dbo" })
export class CategoriaVehiculo {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @Column("varchar", { name: "Imagen", nullable: true, length: 200 })
  imagen: string | null;

  @OneToMany(() => TipoVehiculo, (tipoVehiculo) => tipoVehiculo.idCategoria)
  tipoVehiculos: TipoVehiculo[];
}
