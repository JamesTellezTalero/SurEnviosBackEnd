import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Municipio } from "./Municipio";

@Index("PK_Regional", ["id"], { unique: true })
@Entity("Regional", { schema: "dbo" })
export class Regional {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "codigo", length: 20 })
  codigo: string;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Municipio, (municipio) => municipio.regional)
  municipios: Municipio[];
}
