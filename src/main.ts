import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export class CustomException extends Error {
  constructor() {
    super('CUSTOM EXCEPTION');
  }
}

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  public catch(): any {
    console.log('CustomExceptionFilter - catch - 1');

    // throwing an error here return in an "UnhandledPromiseRejectionWarning" in the console, and response is never sent.
    // throw new Error('test');

    // throwing an HttpException here return in an "UnhandledPromiseRejectionWarning" in the console, and response is never sent.
    throw new HttpException('test', 400);

    // returning a custom error object results in the response never getting terminated
    // return new Error('custom error');
  }
}

// This fails as well.
//
// @Catch(CustomException)
// export class CustomExceptionFilter extends BaseExceptionFilter {
//   public catch(exception, host): any {
//     console.log('CustomExceptionFilter - catch - 2');
//
//     // Extending the BaseExceptionFilter and just calling super results in "UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'reply' of undefined"
//     super.catch(exception, host);
//   }
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(3000);
}
bootstrap();
