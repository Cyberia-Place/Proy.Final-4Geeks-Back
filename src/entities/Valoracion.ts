import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./Usuario";

@Entity('valoraciones')
export class Valoracion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    valoracion: number;

    @Column({nullable: true})
    comentario: string;

    @ManyToOne(() => Usuario, usuario => usuario.historial_valoraciones)
    valorador: Usuario;

    @ManyToOne(() => Usuario, usuario => usuario.valoraciones)
    valorado: Usuario;

}