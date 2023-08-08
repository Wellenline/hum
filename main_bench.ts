
Deno.bench(async function getRequestNode() {
	// do 500 requests

	const requests = Array.from({ length: 500 }, () => fetch("http://localhost:3000/"));

	// run all requests in parallel
	await Promise.all(requests);


	// await fetch("http://localhost:3000/");
});

Deno.bench(async function getRequestDeno() {
	const requests = Array.from({ length: 500 }, () => fetch("http://localhost:3001/"));

	await Promise.all(requests);
});

