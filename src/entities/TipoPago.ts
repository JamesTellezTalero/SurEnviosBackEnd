import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pago } from "./Pago";

@Index("PK_TipoPago", ["id"], { unique: true })
@Entity("TipoPago", { schema: "dbo" })
export class TipoPago {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Pago, (pago) => pago.idMedioPago)
  pagos: Pago[];
}
