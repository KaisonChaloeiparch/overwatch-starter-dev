import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @Column({ nullable: true })
    type: string; // e.g., FIRE, FLOOD

    @Column({ nullable: true })
    priority: string; // e.g., HIGH, LOW

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'float', nullable: true })
    latitude: number;

    @Column({ type: 'float', nullable: true })
    longitude: number;

    @Column({ default: 'OPEN' })
    status: string; // OPEN, IN_PROGRESS, RESOLVED
}
