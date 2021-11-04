import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FotoDocumento } from "./FotoDocumento";

@Index("PK_TipoDocUsuario", ["id"], { unique: true })
@Entity("TipoDocUsuario", { schema: "dbo" })
export class TipoDocUsuario {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @OneToMany(() => FotoDocumento, (fotoDocumento) => fotoDocumento.idTipo)
  fotoDocumentos: FotoDocumento[];
}
