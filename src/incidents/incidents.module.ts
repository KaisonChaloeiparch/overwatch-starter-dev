import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { Incident } from './entities/incident.entity';
import { EventsModule } from '../events/events.module';
import { SmartDispatcherService } from './smart-dispatcher.service';

@Module({
    imports: [TypeOrmModule.forFeature([Incident]), EventsModule],
    controllers: [IncidentsController],
    providers: [IncidentsService, SmartDispatcherService],
    exports: [IncidentsService, SmartDispatcherService],
})
export class IncidentsModule { }
