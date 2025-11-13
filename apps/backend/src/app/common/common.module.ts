import { Module } from "@nestjs/common";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  exports: [AutomapperModule],
})
export class CommonModule {}
