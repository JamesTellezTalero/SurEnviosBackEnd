import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Camion } from "./Camion";

@Index("PK_CamionPos", ["idCamion"], { unique: true })
@Entity("CamionPos", { schema: "dbo" })
export class CamionPos {
  @Column("int", { primary: true, name: "idCamion" })
  idCamion: number;

  @Column("numeric", { name: "lat", precision: 18, scale: 4 })
  lat: number;

  @Column("numeric", { name: "lon", precision: 18, scale: 4 })
  lon: number;

  @Column("bit", { name: "activo", default: () => "(0)" })
  activo: boolean;

  @Column("bit", { name: "enEntrega", default: () => "(0)" })
  enEntrega: boolean;

  @OneToOne(() => Camion, (camion) => camion.camionPos)
  @JoinColumn([{ name: "idCamion", referencedColumnName: "id" }])
  idCamion2: Camion;
}
