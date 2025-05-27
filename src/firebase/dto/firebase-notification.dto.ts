import { IsNotEmpty, IsString } from "class-validator";

export class SendNotificationDTO {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    body: string;
    @IsString()
    @IsNotEmpty()
    deviceId: string;
}