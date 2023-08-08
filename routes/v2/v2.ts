import { Resource, Get } from "../../mod.ts";

@Resource("/", { version: "v2" })
export class V2 {
	@Get("")
	public async index() {
		return "api version 2";
	}
}
