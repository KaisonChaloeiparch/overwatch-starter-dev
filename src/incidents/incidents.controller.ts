import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new incident' })
    create(@Body() createIncidentDto: CreateIncidentDto) {
        return this.incidentsService.create(createIncidentDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all incidents' })
    findAll() {
        return this.incidentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an incident by ID' })
    findOne(@Param('id') id: string) {
        return this.incidentsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an incident' })
    update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
        return this.incidentsService.update(id, updateIncidentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an incident' })
    remove(@Param('id') id: string) {
        return this.incidentsService.remove(id);
    }
}
