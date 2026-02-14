import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIncidentDto {
    @ApiProperty({ example: 'มีเหตุระเบิดที่หน้าประตูเมือง' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: 13.7563, required: false })
    latitude?: number;

    @ApiProperty({ example: 100.5018, required: false })
    longitude?: number;
}
