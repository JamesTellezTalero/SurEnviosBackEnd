import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoCamion } from "./TipoCamion";
import { TipoVinculacion } from "./TipoVinculacion";
import { Propietario } from "./Propietario";
import { CamionPos } from "./CamionPos";
import { Tripulante } from "./Tripulante";

@Index("PK_Camion", ["id"], { unique: true })
@Entity("Camion", { schema: "dbo" })
export class Camion {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Placa", length: 10 })
  placa: string;

  @Column("varchar", { name: "Descripcion", length: 500 })
  descripcion: string;

  @Column("float", { name: "Capacidad", precision: 53 })
  capacidad: number;

  @Column("bit", { name: "Estado", default: () => "(0)" })
  estado: boolean;

  @ManyToOne(() => TipoCamion, (tipoCamion) => tipoCamion.camions)
  @JoinColumn([{ name: "IdTipoCamion", referencedColumnName: "id" }])
  idTipoCamion: TipoCamion;

  @ManyToOne(
    () => TipoVinculacion,
    (tipoVinculacion) => tipoVinculacion.camions
  )
  @JoinColumn([{ name: "IdTipoVinculacion", referencedColumnName: "id" }])
  idTipoVinculacion: TipoVinculacion;

  @ManyToOne(() => Propietario, (propietario) => propietario.camions)
  @JoinColumn([{ name: "Propietario", referencedColumnName: "id" }])
  propietario: Propietario;

  @OneToOne(() => CamionPos, (camionPos) => camionPos.idCamion2)
  camionPos: CamionPos;

  @ManyToMany(() => Tripulante, (tripulante) => tripulante.camions)
  tripulantes: Tripulante[];
}
