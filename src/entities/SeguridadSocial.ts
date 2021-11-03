import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario";

@Index("PK_SeguridadSocial", ["id"], { unique: true })
@Entity("SeguridadSocial", { schema: "dbo" })
export class SeguridadSocial {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Pension", nullable: true })
  pension: string | null;

  @Column("varchar", { name: "Salud", nullable: true })
  salud: string | null;

  @Column("varchar", { name: "Arl", nullable: true })
  arl: string | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.seguridadSocials)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario: Usuario;
}
