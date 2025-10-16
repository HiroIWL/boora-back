import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BaseDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        name: 'id',
        description: 'ID do usuário',
        required: false,
    })
    id?: string;

    constructor(data?: Partial<BaseDto>) {
        if (data) {
            this.id = data.id;
        }
    }
}