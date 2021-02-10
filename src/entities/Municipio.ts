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
import { Regional } from "./Regional";
import { Departamento } from "./Departamento";
import { Propietario } from "./Propietario";
import { Servicio } from "./Servicio";

@Index("PK_Municipio", ["id"], { unique: true })
@Entity("Municipio", { schema: "dbo" })
export class Municipio {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Nombre", length: 100 })
  nombre: string;

  @Column("varchar", { name: "CodigoDane", length: 20 })
  codigoDane: string;

  @Column("bit", { name: "Estado", default: () => "(1)" })
  estado: boolean;

  @OneToMany(() => Cliente, (cliente) => cliente.idCiudad)
  clientes: Cliente[];

  @ManyToOne(() => Regional, (regional) => regional.municipios)
  @JoinColumn([{ name: "Regional", referencedColumnName: "id" }])
  regional: Regional;

  @ManyToOne(() => Departamento, (departamento) => departamento.municipios)
  @JoinColumn([{ name: "IdDepartamento", referencedColumnName: "id" }])
  idDepartamento: Departamento;

  @OneToMany(() => Propietario, (propietario) => propietario.idCiudad)
  propietarios: Propietario[];

  @OneToMany(() => Servicio, (servicio) => servicio.idCiudadOrigen)
  servicios: Servicio[];

  @OneToMany(() => Servicio, (servicio) => servicio.idCiudadDestino)
  servicios2: Servicio[];
}
