import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PK__Noticias__3214EC070182F6B6", ["id"], { unique: true })
@Entity("Noticias", { schema: "dbo" })
export class Noticias {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Titulo", length: 255 })
  titulo: string;

  @Column("varchar", { name: "Detalle" })
  detalle: string;

  @Column("datetime", { name: "FechaVencimiento" })
  fechaVencimiento: Date;

  @Column("varchar", { name: "Imagen", nullable: true })
  imagen: string | null;
}
