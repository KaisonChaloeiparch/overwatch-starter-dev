import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident } from './entities/incident.entity';
import { EventsGateway } from '../events/events.gateway';
import axios from 'axios';

@Injectable()
export class IncidentsService {
    constructor(
        @InjectRepository(Incident)
        private incidentsRepository: Repository<Incident>,
        private eventsGateway: EventsGateway,
    ) { }

    async create(createIncidentDto: CreateIncidentDto) {
        const analysis = this.analyzeThreat(createIncidentDto.text);

        // Priority: Use provided coordinates, else generate random ones around Bangkok
        const latitude = createIncidentDto.latitude ?? (13.7563 + (Math.random() - 0.5) * 0.1);
        const longitude = createIncidentDto.longitude ?? (100.5018 + (Math.random() - 0.5) * 0.1);

        const incident = this.incidentsRepository.create({
            text: createIncidentDto.text,
            type: analysis.type,
            priority: analysis.priority,
            latitude,
            longitude,
        });
        const saved = await this.incidentsRepository.save(incident);
        this.eventsGateway.emitNewIncident(saved);

        // Mission 9: The Transmitter - Webhook Pattern
        // Fire and Forget for HIGH priority incidents
        if (saved.priority === 'HIGH') {
            const payload = {
                ...saved,
                timestamp: new Date(),
                source: 'OVERWATCH-CORE'
            };

            console.log(`[Transmitter] 🚀 High priority incident detected! Notifying Agent Hub...`);

            // Fire and Forget: Do NOT await this call
            axios.post('http://localhost:4000/dispatch', payload)
                .catch(err => {
                    console.error(`[Transmitter] ❌ Webhook failed: ${err.message}`);
                });
        }

        return saved;
    }

    analyzeThreat(text: string): { type: string; priority: string } {
        if (!text) {
            return { type: 'UNCLEAR', priority: 'LOW' };
        }
        const highRisk = ['ไฟ', 'ระเบิด', 'ชน', 'ตาย'];
        const lowRisk = ['รถติด', 'น้ำท่วม'];

        if (highRisk.some((word) => text.includes(word))) {
            return { type: 'ACCIDENT', priority: 'HIGH' };
        }

        if (lowRisk.some((word) => text.includes(word))) {
            return { type: 'GENERAL', priority: 'LOW' };
        }

        return { type: 'UNCLEAR', priority: 'LOW' };
    }

    findAll() {
        return this.incidentsRepository.find();
    }

    findOne(id: string) {
        return this.incidentsRepository.findOneBy({ id });
    }

    async update(id: string, updateIncidentDto: UpdateIncidentDto) {
        await this.incidentsRepository.update(id, updateIncidentDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.incidentsRepository.delete(id);
        return { deleted: true };
    }
}
