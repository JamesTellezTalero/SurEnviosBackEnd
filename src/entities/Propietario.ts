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
import { TipoDocumento } from "./TipoDocumento";
import { Municipio } from "./Municipio";

@Index("PK_Propietario", ["id"], { unique: true })
@Entity("Propietario", { schema: "dbo" })
export class Propietario {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 200 })
  nombre: string;

  @Column("varchar", { name: "NumeroDocumeto", length: 20 })
  numeroDocumeto: string;

  @Column("varchar", { name: "NombreContacto", length: 200 })
  nombreContacto: string;

  @Column("varchar", { name: "TelefonoContacto", length: 200 })
  telefonoContacto: string;

  @Column("varchar", { name: "DireccionContacto", length: 200 })
  direccionContacto: string;

  @Column("bit", { name: "Estado", default: () => "(0)" })
  estado: boolean;

  @OneToMany(() => Camion, (camion) => camion.propietario)
  camions: Camion[];

  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.propietarios)
  @JoinColumn([{ name: "IdTipoDocumento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumento;

  @ManyToOne(() => Municipio, (municipio) => municipio.propietarios)
  @JoinColumn([{ name: "IdCiudad", referencedColumnName: "id" }])
  idCiudad: Municipio;
}
