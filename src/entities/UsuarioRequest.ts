import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Servicio } from "./Servicio";
import { Usuario } from "./Usuario";

@Index("UsuarioRequest_PK", ["idUsuario", "idServicio"], { unique: true })
@Index("UsuarioRequest_UN", ["idUsuario", "idServicio"], { unique: true })
@Entity("UsuarioRequest", { schema: "dbo" })
export class UsuarioRequest {
  @Column("int", { primary: true, name: "IdUsuario", unique: true })
  idUsuario: number;

  @Column("int", { primary: true, name: "IdServicio", unique: true })
  idServicio: number;

  @Column("int", { name: "Respuesta" })
  respuesta: number;

  @ManyToOne(() => Servicio, (servicio) => servicio.usuarioRequests)
  @JoinColumn([{ name: "IdServicio", referencedColumnName: "id" }])
  idServicio2: Servicio;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRequests)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario2: Usuario;
}
