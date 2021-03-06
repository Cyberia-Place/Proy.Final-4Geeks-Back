import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Clase } from "./Clase";
import { Valoracion } from "./Valoracion";
import { Inscripcion } from "./Inscripcion";

@Entity('usuarios')
export class Usuario extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    contrasenia: string;

    @Column()
    nombre: string;

    @Column({ default: 0 })
    creditos: number;

    @Column({ nullable: true })
    imagen: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ nullable: true })
    pais: string;

    @Column({ nullable: true })
    idioma: string;

    @Column({ nullable: true })
    ocupacion: string;

    @Column({ nullable: true })
    edad: number;

    @OneToMany(() => Clase, clase => clase.profesor)
    clases: Clase[];

    @OneToMany(() => Valoracion, valoracion => valoracion.valorado)
    valoraciones: Valoracion[];

    @OneToMany(() => Valoracion, valoracion => valoracion.valorador)
    historial_valoraciones: Valoracion[];

    @OneToMany(() => Inscripcion, inscripcion => inscripcion.usuario)
    inscripciones: Inscripcion[];

    @Column({ nullable: true })
    url: string;
}