import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CategoriaVehiculo } from "./CategoriaVehiculo";
import { TipoVehiculo } from "./TipoVehiculo";

@Index("SubCategoriaCamion_PK", ["id"], { unique: true })
@Index("SubCategoriaCamion_UN", ["id"], { unique: true })
@Entity("SubCategoriaVehiculo", { schema: "dbo" })
export class SubCategoriaVehiculo {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @Column("varchar", { name: "Imagen", nullable: true, length: 200 })
  imagen: string | null;

  @ManyToOne(
    () => CategoriaVehiculo,
    (categoriaVehiculo) => categoriaVehiculo.subCategoriaVehiculos
  )
  @JoinColumn([{ name: "IdCategoria", referencedColumnName: "id" }])
  idCategoria: CategoriaVehiculo;

  @OneToMany(() => TipoVehiculo, (tipoVehiculo) => tipoVehiculo.idSubCategoria)
  tipoVehiculos: TipoVehiculo[];
}
