import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotesDto {
    @ApiProperty({
        example: 'I need to buy groceries',
        description: 'The note that should be added to the reminders',
    })
    @IsNotEmpty()
    @IsString()
    title: string;
}