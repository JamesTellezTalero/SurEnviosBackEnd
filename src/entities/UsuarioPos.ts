import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import { Usuario } from "./Usuario";

@Index("PK_CamionPos", ["idUsuario"], { unique: true })
@Entity("UsuarioPos", { schema: "dbo" })
export class UsuarioPos {
  @Column("int", { primary: true, name: "IdUsuario" })
  idUsuario: number;

  @Column("numeric", { name: "lat", precision: 18, scale: 4 })
  lat: number;

  @Column("numeric", { name: "lon", precision: 18, scale: 4 })
  lon: number;

  @Column("bit", { name: "activo", default: () => "(0)" })
  activo: boolean;

  @Column("bit", { name: "enEntrega", default: () => "(0)" })
  enEntrega: boolean;

  @OneToOne(() => Usuario, (usuario) => usuario.usuarioPos)
  @JoinColumn([{ name: "IdUsuario", referencedColumnName: "id" }])
  idUsuario2: Usuario;
}
