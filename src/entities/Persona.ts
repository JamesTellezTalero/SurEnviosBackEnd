import { jsonMember, jsonObject } from "typedjson";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoDocumento } from "./TipoDocumento";
import { TripulanteVehiculo } from "./TripulanteVehiculo";
import { Usuario } from "./Usuario";

@jsonObject
@Index("PK_Tripulante", ["id"], { unique: true })
@Entity("Persona", { schema: "dbo" })
export class Persona {

  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "NumeroDocumento", length: 10 })
  numeroDocumento: string;

  @jsonMember
  @Column("varchar", { name: "Nombres", length: 100 })
  nombres: string;

  @jsonMember
  @Column("varchar", { name: "Apellidos", length: 100 })
  apellidos: string;

  @jsonMember
  @Column("varchar", { name: "Celular", length: 20 })
  celular: string;

  @jsonMember
  @Column("varchar", { name: "Foto", nullable: true, length: 200 })
  foto: string | null;
  
  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(0)" })
  estado: boolean;

  @jsonMember
  @Column("varchar", { name: "Email", length: 100 })
  email: string;

  @jsonMember
  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.personas)
  @JoinColumn([{ name: "IdTipoDocumento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumento;

  @OneToMany(
    () => TripulanteVehiculo,
    (tripulanteVehiculo) => tripulanteVehiculo.idTripulante2
  )
  tripulanteVehiculos: TripulanteVehiculo[];

  @OneToMany(() => Usuario, (usuario) => usuario.idPersona)
  usuarios: Usuario[];
}
