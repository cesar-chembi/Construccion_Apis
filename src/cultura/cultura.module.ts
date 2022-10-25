import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CulturaEntity } from './cultura.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CulturaEntity])
    ],
    controllers: [],
    providers: [
        CulturaService,],
})
export class CulturaModule { }
