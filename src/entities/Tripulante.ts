import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocumento } from "./TipoDocumento";
import { TipoTripulante } from "./TipoTripulante";
import { Camion } from "./Camion";

@Index("PK_Tripulante", ["id"], { unique: true })
@Entity("Tripulante", { schema: "dbo" })
export class Tripulante {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "NumeroDocumento", length: 10 })
  numeroDocumento: string;

  @Column("varchar", { name: "Nombres", length: 100 })
  nombres: string;

  @Column("varchar", { name: "Apellidos", length: 100 })
  apellidos: string;

  @Column("varchar", { name: "Celular", length: 20 })
  celular: string;

  @Column("varchar", { name: "Foto", nullable: true, length: 200 })
  foto: string | null;

  @Column("bit", { name: "Estado", default: () => "(0)" })
  estado: boolean;

  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.tripulantes)
  @JoinColumn([{ name: "IdTipoDocumento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumento;

  @ManyToOne(
    () => TipoTripulante,
    (tipoTripulante) => tipoTripulante.tripulantes
  )
  @JoinColumn([{ name: "IdTipoTripulante", referencedColumnName: "id" }])
  idTipoTripulante: TipoTripulante;

  @ManyToMany(() => Camion, (camion) => camion.tripulantes)
  @JoinTable({
    name: "TripulanteCamion",
    joinColumns: [{ name: "IdTripulante", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "IdCamion", referencedColumnName: "id" }],
    schema: "dbo",
  })
  camions: Camion[];
}
