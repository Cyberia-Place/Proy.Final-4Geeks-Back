import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Usuario } from "./Usuario";
import { Categoria } from "./Categoria";
import { Inscripcion } from "./Inscripcion";

@Entity('clases')
export class Clase extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    fecha: Date;

    @Column()
    duracion: number;

    @ManyToOne(() => Usuario, usuario => usuario.clases)
    profesor: Usuario;

    @ManyToMany(() => Categoria)
    @JoinTable()
    categorias: Categoria[];

    @OneToMany(() => Inscripcion, inscripcion => inscripcion.clase)
    inscripciones: Inscripcion[];

}