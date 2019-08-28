// Why is this a .js file instead of a .ts file? Because it uses dom apis like "sessionStorage" and "alert" which are not present in a NodeJS app.
//      But since we're installing this interceptor into SwaggerUI... we need to use these apis. So it's easier to leave the whole thing untyped

exports.requestInterceptor = function(request) {
    // Make sure we're hitting the right backend service by replacing the outbound url's baseUrl
	// We need this workaround until https://github.com/swagger-api/swagger-js/issues/1045
	const whereTheServiceLivesForThisEnv = `${window.location.origin}/`;
	// tslint:disable-next-line: no-console
	console.log(
		`About to replace the base url of ${request.url} with ${whereTheServiceLivesForThisEnv} so we can hit the correct backend service.
        This is so we can override the host value of swagger.yaml`,
    );
	// tslint:disable-next-line: no-unsafe-any
	request.url = request.url.replace(/^(http:\/\/|https:\/\/)[^/]*\//i, whereTheServiceLivesForThisEnv);

    // Allow developers to set a bearer token since there are many open issues with SwaggerUI https://github.com/swagger-api/swagger-ui/issues/5461
    const bearerToken = sessionStorage.getItem('bearerToken');
	if (!bearerToken) {
		alert(`From the console, please run sessionStorage.setItem('bearerToken', 'insert a real bearer token id here')`);
		return request;
	} else {
		request.headers.Authorization = `Bearer ${bearerToken}`;
		return request;
	}
};
