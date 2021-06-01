import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Clase } from "./Clase";
import { Usuario } from "./Usuario";

@Entity('inscripciones')
export class Inscripcion extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, default: null })
    asistio: boolean;

    @ManyToOne(() => Clase, clase => clase.inscripciones)
    clase: Clase;

    @ManyToOne(() => Usuario, usuario => usuario.inscripciones)
    usuario: Usuario;
}