// Why is this a .js file instead of a .ts file? Because it uses dom apis like "sessionStorage" and "alert" which are not present in a NodeJS app.
//      But since we're installing this interceptor into SwaggerUI... we need to use these apis. So it's easier to leave the whole thing untyped

exports.requestInterceptor = function(request) {
	const bearerToken = sessionStorage.getItem('bearerToken');
	if (!bearerToken) {
		alert(`From the console, please run sessionStorage.setItem('bearerToken', 'insert a real bearer token id here')`);
		return request;
	} else {
		request.headers.Authorization = `Bearer ${bearerToken}`;
		return request;
	}
};
