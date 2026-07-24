import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class CodeService {
    async create() {
        const plainCode = this.generate()

        return {
            plainCode,
            codeHash: await bcrypt.hash(plainCode, 10),
        }
    }

    async verify(plainCode: string, codeHash: string) {
        return bcrypt.compare(plainCode, codeHash)
    }

    private generate() {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
}
