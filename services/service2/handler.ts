import { INestApplication, Logger, Module } from '@nestjs/common';
import { NestFactory } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import * as proxy from 'aws-lambda-fastify';
import { fastify } from 'fastify';

let app: INestApplication;

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			useFactory: () => ({
				cors: {
					origin: true,
					credentials: true,
				},
				playground: true,
				useGlobalPrefix: true,
				engine: false,
			}),
		}),
	],
})
export class Service2Module {}

export const handler: Handler = async (
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> => {
	if (!app) {
		app = await NestFactory.create(Service2Module, new FastifyAdapter(fastify()), { cors: true });
		app.setGlobalPrefix('2');
		await app.init();
	}

	return proxy(app.getHttpAdapter())(event, context);
};
