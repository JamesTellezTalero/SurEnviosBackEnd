import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ElementoRegistro } from "./ElementoRegistro";

@Index("PK_TipoElementoRegistro", ["id"], { unique: true })
@Entity("TipoElementoRegistro", { schema: "dbo" })
export class TipoElementoRegistro {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "estado", default: () => "(0)" })
  estado: boolean;

  @OneToMany(
    () => ElementoRegistro,
    (elementoRegistro) => elementoRegistro.idTipoElemento
  )
  elementoRegistros: ElementoRegistro[];
}
