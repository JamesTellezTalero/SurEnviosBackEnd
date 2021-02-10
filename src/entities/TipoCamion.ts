import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Camion } from "./Camion";
import { Servicio } from "./Servicio";
import { CategoriaCamion } from "./CategoriaCamion";

@Index("PK_TipoCamion", ["id"], { unique: true })
@Entity("TipoCamion", { schema: "dbo" })
export class TipoCamion {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("bit", { name: "Estado" })
  estado: boolean;

  @Column("varchar", { name: "Imagen", nullable: true, length: 200 })
  imagen: string | null;

  @OneToMany(() => Camion, (camion) => camion.idTipoCamion)
  camions: Camion[];

  @OneToMany(() => Servicio, (servicio) => servicio.idTipoCamion)
  servicios: Servicio[];

  @ManyToOne(
    () => CategoriaCamion,
    (categoriaCamion) => categoriaCamion.tipoCamions
  )
  @JoinColumn([{ name: "IdCategoria", referencedColumnName: "id" }])
  idCategoria: CategoriaCamion;
}
