import { Resource, Get, Before, RouteContext, HttpStatus } from "../mod.ts";

const getNumber = (context: RouteContext) => {
	context.params.set("number", parseInt(context.params.get("number") as string, 10));
	context.test = true;
	return true;
};
const longWaitingBlockingMiddleware = async () => {
	// wait 5 seconds
	await new Promise((resolve) => setTimeout(resolve, 5000));
	return true;
};


@Resource("/")
export class Index {

	@Get("/a")
	@Before(longWaitingBlockingMiddleware)
	public async index(context: RouteContext) {
		context.headers.set("content-type", "image/png");
		context.status = HttpStatus.I_AM_A_TEAPOT;

		return await Deno.readFile("./logo.png");

	}

	@Get("/audio")
	public async audio(context: RouteContext) {
		context.headers.set("content-type", "audio/mp3");


		const track = await Deno.open("./audio.mp3");


		const stat = await Deno.stat("./audio.mp3");

		const total = stat.size;

		if (context.req.headers.get("range")) {
			console.log("Request range: ", context.req.headers.get("range"));

			const range = context.req.headers.get("range") as string;
			const parts = range.replace(/bytes=/, "").split("-");
			const partialstart = parseInt(parts[0], 10);
			const partialend = parseInt(parts[1], 10);

			const start = partialstart;
			const end = partialend ? partialend : total - 1;
			const chunksize = (end - start) + 1;

			context.status = HttpStatus.PARTIAL_CONTENT;
			context.headers.set("Content-Range", "bytes " + start + "-" + end + "/" + total);
			context.headers.set("Accept-Ranges", "bytes");
			context.headers.set("Content-Length", chunksize.toString());
			context.headers.set("Content-Type", "audio/mp3");

			const buffer = new Uint8Array(end - start);
			await Deno.read(track.rid, buffer);
			Deno.close(track.rid);

			return buffer;


		}

		context.headers.set("Content-Length", total.toString());
		context.headers.set("Accept-Ranges", "bytes");
		context.headers.set("Content-Type", "audio/mp3");

		return track;

	}

	@Get("/video")
	@Before(longWaitingBlockingMiddleware)
	public video() {
		return "video";
	}


	@Get("/a/:number")
	@Before(getNumber)
	public doSome(context: RouteContext) {

		context.headers.set("content-type", "text/html")

		context.status = HttpStatus.I_AM_A_TEAPOT;

		console.log(context.test);
		console.log(context.params.get("number"));

		return `<h1>Hello<h1>
		
		<p>Number: ${context.params.get("number")}</p>
		<p>Test: ${context.test}</p>`;
	}

}
