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
import { Municipio } from "./Municipio";
import { Servicio } from "./Servicio";
import { DireccionCliente } from "./DireccionCliente";
import { jsonMember, jsonObject } from "typedjson";

@jsonObject
@Index("PK_Cliente", ["id"], { unique: true })
@Entity("Cliente", { schema: "dbo" })
export class Cliente {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "NumeroDocumento", length: 20 })
  numeroDocumento: string;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("varchar", { name: "Apellidos", length: 100 })
  apellidos: string;

  @jsonMember
  @Column("varchar", { name: "Direccion", length: 200 })
  direccion: string;

  @jsonMember
  @Column("varchar", { name: "Celular", length: 20 })
  celular: string;

  @jsonMember
  @Column("varchar", { name: "Email", length: 100 })
  email: string;

  @jsonMember
  @Column("varchar", { name: "Password", length: 128 })
  password: string;

  @jsonMember
  @Column("varchar", { name: "PlayerId", nullable: true, length: 200 })
  playerId: string | null;

  @jsonMember
  @Column("varchar", { name: "PushToken", nullable: true, length: 200 })
  pushToken: string | null;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @jsonMember
  @Column("varchar", { name: "Foto", nullable: true })
  foto: string | null;

  @jsonMember(()=>TipoDocumento)
  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.clientes)
  @JoinColumn([{ name: "IdTipoDocumento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumento;

  @jsonMember
  @ManyToOne(() => Municipio, (municipio) => municipio.clientes)
  @JoinColumn([{ name: "IdCiudad", referencedColumnName: "id" }])
  idCiudad: Municipio;

  @OneToMany(() => Servicio, (servicio) => servicio.idCliente)
  servicios: Servicio[];

  @OneToMany(
    () => DireccionCliente,
    (direccionCliente) => direccionCliente.idCliente
  )
  direccionClientes: DireccionCliente[];
}
