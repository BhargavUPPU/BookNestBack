import { Module } from "@nestjs/common";
import { WaitingListService } from "./waiting-list.service";
import { WaitingListController } from "./waiting-list.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [WaitingListController],
  providers: [WaitingListService, PrismaService],
  exports: [WaitingListService],
})
export class WaitingListModule {}
