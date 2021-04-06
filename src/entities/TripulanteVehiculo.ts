import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { TipoTripulante } from "./TipoTripulante";
import { Persona } from "./Persona";
import { Vehiculo } from "./Vehiculo";

@Index("PK_TripulanteCamion", ["idVehiculo", "idTripulante"], { unique: true })
@Entity("TripulanteVehiculo", { schema: "dbo" })
export class TripulanteVehiculo {
  @Column("int", { primary: true, name: "IdVehiculo" })
  idVehiculo: number;

  @Column("int", { primary: true, name: "IdTripulante" })
  idTripulante: number;

  @ManyToOne(
    () => TipoTripulante,
    (tipoTripulante) => tipoTripulante.tripulanteVehiculos
  )
  @JoinColumn([{ name: "IdTipoTripulante", referencedColumnName: "id" }])
  idTipoTripulante: TipoTripulante;

  @ManyToOne(() => Persona, (persona) => persona.tripulanteVehiculos)
  @JoinColumn([{ name: "IdTripulante", referencedColumnName: "id" }])
  idTripulante2: Persona;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.tripulanteVehiculos)
  @JoinColumn([{ name: "IdVehiculo", referencedColumnName: "id" }])
  idVehiculo2: Vehiculo;
}
