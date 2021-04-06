import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Servicio } from "./Servicio";
import { Persona } from "./Persona";
import { Perfil } from "./Perfil";
import { UsuarioPos } from "./UsuarioPos";
import { UsuarioRequest } from "./UsuarioRequest";
import { Vehiculo } from "./Vehiculo";

@Index("PK__Usuario__3214EC27564F70B9", ["id"], { unique: true })
@Entity("Usuario", { schema: "dbo" })
export class Usuario {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "Password", nullable: true, length: 130 })
  password: string | null;

  @Column("varchar", { name: "UserName", nullable: true, length: 100 })
  userName: string | null;

  @Column("bit", { name: "Activo", default: () => "(0)" })
  activo: boolean;

  @Column("varchar", { name: "XueUserCode", nullable: true, length: 100 })
  xueUserCode: string | null;

  @OneToMany(() => Servicio, (servicio) => servicio.idUsuario)
  servicios: Servicio[];

  @ManyToOne(() => Persona, (persona) => persona.usuarios)
  @JoinColumn([{ name: "IdPersona", referencedColumnName: "id" }])
  idPersona: Persona;

  @ManyToOne(() => Perfil, (perfil) => perfil.usuarios)
  @JoinColumn([{ name: "IdPerfil", referencedColumnName: "id" }])
  idPerfil: Perfil;

  @OneToOne(() => UsuarioPos, (usuarioPos) => usuarioPos.idUsuario2)
  usuarioPos: UsuarioPos;

  @OneToMany(
    () => UsuarioRequest,
    (usuarioRequest) => usuarioRequest.idUsuario2
  )
  usuarioRequests: UsuarioRequest[];

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.idUsuario)
  vehiculos: Vehiculo[];
}
