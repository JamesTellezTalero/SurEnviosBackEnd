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
import { FotoDocumento } from "./FotoDocumento";
import { SeguridadSocial } from "./SeguridadSocial";
import { Servicio } from "./Servicio";
import { Persona } from "./Persona";
import { EstadoUsuario } from "./EstadoUsuario";
import { Perfil } from "./Perfil";
import { UsuarioPos } from "./UsuarioPos";
import { UsuarioRequest } from "./UsuarioRequest";
import { Vehiculo } from "./Vehiculo";
import { jsonMember, jsonObject } from "typedjson";

@jsonObject
@Index("PK__Usuario__3214EC27564F70B9", ["id"], { unique: true })
@Entity("Usuario", { schema: "dbo" })
export class Usuario {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Password", nullable: true, length: 130 })
  password: string | null;

  @jsonMember
  @Column("varchar", { name: "UserName", nullable: true, length: 100 })
  userName: string | null;

  //@jsonMember
  //@Column("bit", { name: "Activo", default: () => "(0)" })
  //activo: boolean;

  @jsonMember
  @Column("varchar", { name: "XueUserCode", nullable: true, length: 100 })
  xueUserCode: string | null;

  @jsonMember
  @Column("varchar", { name: "Cod_Regional", nullable: true, length: 100 })
  codRegional: string | null;

  @OneToMany(() => FotoDocumento, (fotoDocumento) => fotoDocumento.idUsuario)
  fotoDocumentos: FotoDocumento[];

  @OneToMany(
    () => SeguridadSocial,
    (seguridadSocial) => seguridadSocial.idUsuario
  )
  seguridadSocials: SeguridadSocial[];

  @OneToMany(() => Servicio, (servicio) => servicio.idUsuario)
  servicios: Servicio[];

  @jsonMember(()=> Persona)
  @ManyToOne(() => Persona, (persona) => persona.usuarios)
  @JoinColumn([{ name: "IdPersona", referencedColumnName: "id" }])
  idPersona: Persona;

  @jsonMember(()=> EstadoUsuario)
  @ManyToOne(() => EstadoUsuario, (estadoUsuario) => estadoUsuario.usuarios)
  @JoinColumn([{ name: "IdEstadoUsuario", referencedColumnName: "id" }])
  idEstadoUsuario: EstadoUsuario;

  @jsonMember(()=> Perfil)
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
