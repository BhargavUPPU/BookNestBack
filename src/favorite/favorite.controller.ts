import { Controller,Post,Body ,Get,Param,Delete} from "@nestjs/common";
import { FavoriteService } from "./favorite.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
@Controller("favorites")
export class FavoriteController {
  constructor(private favoriteService:FavoriteService) {}
 
  //create a favorite
  @Post()
  async create(@Body() createFavoriteDto:CreateFavoriteDto){
    return this.favoriteService.create(createFavoriteDto);
  }
  
  //get all favorites by userId
  @Get("user/:userId")
   async getByUserId(@Param("userId") userId:string){
     return this.favoriteService.getByUserId(userId);
   }
   
   //delete a favorite
   @Delete(":favoriteId")
   async remove(@Param("favoriteId") favoriteId:string){
    return this.favoriteService.remove(favoriteId);
   }

}