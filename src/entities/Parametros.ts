import { Column, Entity, Index } from "typeorm";

@Index("Parametros_PK", ["parametro"], { unique: true })
@Index("Parametros_UN", ["parametro"], { unique: true })
@Entity("Parametros", { schema: "dbo" })
export class Parametros {
  @Column("varchar", { primary: true, name: "parametro", length: 255 })
  parametro: string;

  @Column("varchar", { name: "value", length: 500 })
  value: string;

  @Column("bit", { name: "EsMovil", default: () => "(0)" })
  esMovil: boolean;
}
