import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  private readonly log = new Logger(AppService.name);
  private app: INestApplication;

  constructor(private readonly config: ConfigService) {}

  public setApp(app: INestApplication) {
    this.app = app;
  }

  public getApp(): INestApplication {
    return this.app;
  }

  public hashPassword(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const salt = this.config.get('host.secret');
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          this.log.error('Erroor in hashPaswod', err);
          reject(err);
        } else {
          resolve(derivedKey.toString('hex'));
        }
      });
    });
  }

  public generateId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  public generateRandomString(length: number): string {
    const chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const randomArray = Array.from(
      { length: length },
      (v, k) => chars[Math.floor(Math.random() * chars.length)],
    );

    const randomString = randomArray.join('');
    return randomString;
  }

  public createHash(algorithm: string, options?: any): any {
    return crypto.createHash(algorithm, options);
  }

  public computeHash(algorithm: string, value: any, options?: any): string {
    return crypto.createHash(algorithm, options).update(value).digest('hex');
  }

  public createHMACSecret(length?: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.generateKey('hmac', { length: length ?? 512 }, (err, key) => {
        if (err) {
          this.log.error('Error in createHMACSecret', err);
          reject(err);
        } else {
          resolve(key.export().toString('hex'));
        }
      });
    });
  }

  public createHMAC(
    payload: any,
    algorithm: string,
    secret: string,
    encoding: crypto.BinaryToTextEncoding,
  ): string {
    const hash = crypto
      .createHmac(algorithm, secret)
      .update(JSON.stringify(payload))
      .digest(encoding);
    return hash;
  }
}
