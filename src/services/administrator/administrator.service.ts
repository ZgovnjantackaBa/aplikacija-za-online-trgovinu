import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/Administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'misc/api.response.class';
import * as crypto from 'crypto';

@Injectable()
export class AdministratorService {

    constructor(     
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>
        ){

    }

    getAll(): Promise<Administrator[]>{
        return this.administrator.find();
    }

    async getByUsername(username: string): Promise<Administrator | null>{
        const admin = this.administrator.findOne({
            username: username
            // naziv polja u bazi   |   argument
        });

        if(admin){
            return admin;
        }

        return null;
    }

    getById(id: number): Promise<Administrator>{
        return this.administrator.findOne(id);
    }

    add(data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
        // const crypto = require('crypto');

        const passwordhash = crypto.createHash('sha512');
        passwordhash.update(data.password);
        const passHashString = passwordhash.digest('hex').toUpperCase();

        let admin: Administrator = new Administrator();
        admin.username = data.username;
        admin.passwordHash = passHashString;

        return new Promise((resolve) =>{
            this.administrator.save(admin)
            .then(data => resolve(data)).catch(error =>{
            const response = new ApiResponse('error', -1001);
            resolve(response);
            }); 
        });

    }

    async editById(adminId: number, data: EditAdministratorDto): Promise<Administrator | ApiResponse>{
        let admin: Administrator = await this.administrator.findOne(adminId);

        if(admin === undefined){
            return new Promise((resolve) =>{
                resolve(new ApiResponse("error", -1002));
            })
        }

        // const crypto = require('crypto');
        const passHash = crypto.createHash('sha512');
        passHash.update(data.password);
        let passHashString: string = passHash.digest('hex').toUpperCase();

        admin.passwordHash = passHashString;

        return this.administrator.save(admin);
        // return this.administrator.update(id);
    }
}
