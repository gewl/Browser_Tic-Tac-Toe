'use strict'

export default function(app) {
	app.setValue = app.set.bind(app)
	app.getValue = path => app.get(path)

	require('./static-middleware.js').default(app)
}
