import { Resource, Get, Hum } from "../mod.ts";

@Resource()
export class Benchmark {
	@Get("/")
	public index() {
		console.log("new request")
		return {
			hello: "world",
		};
	}
}

Hum({
	port: 3001,
});

