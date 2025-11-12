import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");

  // Enable CORS with specific origin
  app.enableCors({
    origin: '*', // Temporarily set to '*' for diagnosis
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
