import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoElementoRegistro } from "./TipoElementoRegistro";
import { RegistroServicio } from "./RegistroServicio";

@Index("PK_ElementoRegistro", ["id"], { unique: true })
@Entity("ElementoRegistro", { schema: "dbo" })
export class ElementoRegistro {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "elemento" })
  elemento: string;

  @Column("bit", { name: "estado", default: () => "(1)" })
  estado: boolean;

  @ManyToOne(
    () => TipoElementoRegistro,
    (tipoElementoRegistro) => tipoElementoRegistro.elementoRegistros
  )
  @JoinColumn([{ name: "idTipoElemento", referencedColumnName: "id" }])
  idTipoElemento: TipoElementoRegistro;

  @ManyToOne(
    () => RegistroServicio,
    (registroServicio) => registroServicio.elementoRegistros
  )
  @JoinColumn([{ name: "idRegistroServicio", referencedColumnName: "id" }])
  idRegistroServicio: RegistroServicio;
}
