import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Municipio } from "./Municipio";

@Index("PK_Departamento", ["id"], { unique: true })
@Entity("Departamento", { schema: "dbo" })
export class Departamento {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("varchar", { name: "CodigoDane", length: 20 })
  codigoDane: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Municipio, (municipio) => municipio.idDepartamento)
  municipios: Municipio[];
}
