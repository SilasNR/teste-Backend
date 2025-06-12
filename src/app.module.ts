import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './produto/produto.module';
import { Produto } from './produto/entities/produto.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Torna as variáveis .env disponíveis globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexão assíncrona com o banco de dados via ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '1433', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: true,
        autoLoadEntities: true,
        entities: [Produto],
        logging: true,
        options: {
          encrypt: true,
          trustServerCertificate: false,
        },
      }),
    }),

    ProdutoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
