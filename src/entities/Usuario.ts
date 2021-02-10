import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__Usuario__3214EC27564F70B9", ["id"], { unique: true })
@Entity("Usuario", { schema: "dbo" })
export class Usuario {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "Nombres", length: 100 })
  nombres: string;

  @Column("varchar", { name: "Apellidos", length: 100 })
  apellidos: string;

  @Column("varchar", { name: "Password", nullable: true, length: 130 })
  password: string | null;

  @Column("varchar", { name: "Email", nullable: true, length: 100 })
  email: string | null;

  @Column("varchar", { name: "Telefono", nullable: true, length: 15 })
  telefono: string | null;

  @Column("bit", { name: "Activo", default: () => "(0)" })
  activo: boolean;
}
