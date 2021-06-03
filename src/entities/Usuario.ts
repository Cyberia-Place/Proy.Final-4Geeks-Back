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

    @Column()
    apellido: string;

    @Column({ default: 0 })
    creditos: number;

    @Column({ default: "" })
    imagen: string;

    @Column({ default: "" })
    descripcion: string;

    @Column({ default: "" })
    pais: string;

    @Column({ default: "" })
    idioma: string;

    @Column({ default: "" })
    ocupacion: string;

    @Column({ default: 0 })
    edad: number;

    @OneToMany(() => Clase, clase => clase.profesor)
    clases: Clase[];

    @OneToMany(() => Valoracion, valoracion => valoracion.valorado)
    valoraciones: Valoracion[];

    @OneToMany(() => Valoracion, valoracion => valoracion.valorador)
    historial_valoraciones: Valoracion[];

    @OneToMany(() => Inscripcion, inscripcion => inscripcion.usuario)
    inscripciones: Inscripcion[];
}