import { Resource, Get, RouteContext, } from "../mod.ts";


@Resource("/query")
export class Query {

	@Get("/")
	public async index(context: RouteContext) {
		return {
			queryParams: context.query,
		}
	}
}
