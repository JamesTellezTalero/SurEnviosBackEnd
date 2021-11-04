import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocUsuario } from "./TipoDocUsuario";
import { Usuario } from "./Usuario";

@Index("PK_FotoDocumento", ["id"], { unique: true })
@Entity("FotoDocumento", { schema: "dbo" })
export class FotoDocumento {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Filename", length: 100 })
  filename: string;

  @ManyToOne(
    () => TipoDocUsuario,
    (tipoDocUsuario) => tipoDocUsuario.fotoDocumentos
  )
  @JoinColumn([{ name: "IdTipo", referencedColumnName: "id" }])
  idTipo: TipoDocUsuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.fotoDocumentos)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario: Usuario;
}
