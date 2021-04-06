import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("PushNotificationData_PK", ["id"], { unique: true })
@Index("PushNotificationData_UN", ["id"], { unique: true })
@Entity("PushNotificationData", { schema: "dbo" })
export class PushNotificationData {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("int", { name: "IdUser" })
  idUser: number;

  @Column("varchar", { name: "PushToken", length: 255 })
  pushToken: string;

  @Column("varchar", { name: "PushId", length: 255 })
  pushId: string;

  @Column("tinyint", { name: "TypeUser" })
  typeUser: number;
}
