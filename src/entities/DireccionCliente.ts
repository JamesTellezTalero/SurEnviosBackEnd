import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Municipio } from "./Municipio";

@Index("DireccionCliente_PK", ["id"], { unique: true })
@Index("DireccionCliente_UN", ["id"], { unique: true })
@Entity("DireccionCliente", { schema: "dbo" })
export class DireccionCliente {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Direccion", length: 500 })
  direccion: string;

  @Column("varchar", { name: "Complemento", length: 500 })
  complemento: string;

  @Column("float", { name: "GeoLat", nullable: true, precision: 53 })
  geoLat: number | null;

  @Column("float", { name: "GeoLon", nullable: true, precision: 53 })
  geoLon: number | null;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @Column("bit", { name: "EsDefault", default: () => "(0)" })
  esDefault: boolean;

  @ManyToOne(() => Cliente, (cliente) => cliente.direccionClientes)
  @JoinColumn([{ name: "IdCliente", referencedColumnName: "id" }])
  idCliente: Cliente;

  @ManyToOne(() => Municipio, (municipio) => municipio.direccionClientes)
  @JoinColumn([{ name: "IdCiudad", referencedColumnName: "id" }])
  idCiudad: Municipio;
}
