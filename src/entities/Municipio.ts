import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Departamento } from "./Departamento";
import { Regional } from "./Regional";
import { Propietario } from "./Propietario";
import { Servicio } from "./Servicio";
import { jsonMember, jsonObject } from "typedjson";

@jsonObject
@Index("PK_Municipio", ["id"], { unique: true })
@Entity("Municipio", { schema: "dbo" })
export class Municipio {
  @jsonMember
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @jsonMember
  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @jsonMember
  @Column("varchar", { name: "CodigoDane", length: 20 })
  codigoDane: string;

  @jsonMember
  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Cliente, (cliente) => cliente.idCiudad)
  clientes: Cliente[];

  @ManyToOne(() => Departamento, (departamento) => departamento.municipios)
  @JoinColumn([{ name: "IdDepartamento", referencedColumnName: "id" }])
  idDepartamento: Departamento;

  @ManyToOne(() => Regional, (regional) => regional.municipios)
  @JoinColumn([{ name: "Regional", referencedColumnName: "id" }])
  regional: Regional;

  @OneToMany(() => Propietario, (propietario) => propietario.idCiudad)
  propietarios: Propietario[];

  @OneToMany(() => Servicio, (servicio) => servicio.idCiudadOrigen)
  servicios: Servicio[];

  @OneToMany(() => Servicio, (servicio) => servicio.idCiudadDestino)
  servicios2: Servicio[];
}
