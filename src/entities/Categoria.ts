import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('categorias')
export class Categoria extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column()
    descripcion: string;
    
}