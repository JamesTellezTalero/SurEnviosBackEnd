import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Municipio } from "./Municipio";
import { TipoDocumento } from "./TipoDocumento";
import { Servicio } from "./Servicio";

@Index("PK_Cliente", ["id"], { unique: true })
@Entity("Cliente", { schema: "dbo" })
export class Cliente {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "NumeroDocumento", length: 20 })
  numeroDocumento: string;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("varchar", { name: "Apellidos", length: 100 })
  apellidos: string;

  @Column("varchar", { name: "Direccion", length: 200 })
  direccion: string;

  @Column("varchar", { name: "Celular", length: 20 })
  celular: string;

  @Column("varchar", { name: "Email", length: 100 })
  email: string;

  @Column("varchar", { name: "Password", length: 128 })
  password: string;

  @Column("varchar", { name: "PlayerId", nullable: true, length: 200 })
  playerId: string | null;

  @Column("varchar", { name: "PushToken", nullable: true, length: 200 })
  pushToken: string | null;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @ManyToOne(() => Municipio, (municipio) => municipio.clientes)
  @JoinColumn([{ name: "IdCiudad", referencedColumnName: "id" }])
  idCiudad: Municipio;

  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.clientes)
  @JoinColumn([{ name: "IdTipoDocumento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumento;

  @OneToMany(() => Servicio, (servicio) => servicio.idCliente)
  servicios: Servicio[];
}
