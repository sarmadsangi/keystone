var demand = require('must');
var LocationType = require('../LocationType');

exports.initList = function (List) {
	List.add({
		location: {
			basic: LocationType,
			customRequired: { type: LocationType, required: ['state', 'country'] },
		},
	});
};

exports.testFieldType = function (List) {
	var testItem = new List.model();

	var emptyLocationValues = {
		number: '',
		name: '',
		street1: '',
		street2: '',
		city: '',
		state: '',
		postcode: '',
		country: '',
		geo: [],
	};

	var resetLocationValues = function () {
		testItem.set('location.basic', emptyLocationValues);
		testItem.set('location.required', emptyLocationValues);
		testItem.set('location.customRequired', emptyLocationValues);
	};

	describe('addFilterToQuery', function () {
		it('should allow to filter by street', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				street: 'Broadway',
			});
			demand(result['location.basic.street1']).eql(/Broadway/i);
		});

		it('should allow to filter by city', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				city: 'NYC',
			});
			demand(result['location.basic.city']).eql(/NYC/i);
		});

		it('should allow to filter by state', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				state: 'New York',
			});
			demand(result['location.basic.state']).eql(/New York/i);
		});

		it('should allow to filter by code', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				code: 10023,
			});
			demand(result['location.basic.postcode']).eql(/10023/i);
		});

		it('should allow to filter by country', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				country: 'USA',
			});
			demand(result['location.basic.country']).eql(/USA/i);
		});

		it('should support inverted mode', function () {
			var result = List.fields['location.basic'].addFilterToQuery({
				country: 'USA',
				inverted: true,
			});
			demand(result['location.basic.country']).eql({
				$not: /USA/i,
			});
		});
	});

	it('should update its value from flat paths', function (done) {
		resetLocationValues();
		List.fields['location.basic'].updateItem(testItem, {
			'location.basic.number': 'number',
			'location.basic.name': 'name',
			'location.basic.street1': 'street 1',
			'location.basic.street2': 'street 2',
			'location.basic.city': 'city',
			'location.basic.state': 'state',
			'location.basic.postcode': 'postcode',
			'location.basic.country': 'country',
			'location.basic.geo_lat': '-33.865143',
			'location.basic.geo_lng': '151.2099',
		}, function () {
			demand(testItem.location.basic.number).be('number');
			demand(testItem.location.basic.name).be('name');
			demand(testItem.location.basic.street1).be('street 1');
			demand(testItem.location.basic.street2).be('street 2');
			demand(testItem.location.basic.city).be('city');
			demand(testItem.location.basic.state).be('state');
			demand(testItem.location.basic.postcode).be('postcode');
			demand(testItem.location.basic.country).be('country');
			demand(Array.isArray(testItem.location.basic.geo)).be.true();
			demand(testItem.location.basic.geo[0]).be(151.2099);
			demand(testItem.location.basic.geo[1]).be(-33.865143);
			done();
		});
	});

	it('should update its value from nested paths', function (done) {
		resetLocationValues();
		List.fields['location.basic'].updateItem(testItem, {
			location: {
				basic: {
					number: 'number',
					name: 'name',
					street1: 'street 1',
					street2: 'street 2',
					city: 'city',
					state: 'state',
					postcode: 'postcode',
					country: 'country',
					geo: ['151.2099', '-33.865143'],
				},
			},
		}, function () {
			demand(testItem.location.basic.number).be('number');
			demand(testItem.location.basic.name).be('name');
			demand(testItem.location.basic.street1).be('street 1');
			demand(testItem.location.basic.street2).be('street 2');
			demand(testItem.location.basic.city).be('city');
			demand(testItem.location.basic.state).be('state');
			demand(testItem.location.basic.postcode).be('postcode');
			demand(testItem.location.basic.country).be('country');
			demand(Array.isArray(testItem.location.basic.geo)).be.true();
			demand(testItem.location.basic.geo[0]).be(151.2099);
			demand(testItem.location.basic.geo[1]).be(-33.865143);
			done();
		});
	});

	it('should remove the location.geo path without valid values', function (done) {
		resetLocationValues();
		List.fields['location.basic'].updateItem(testItem, {
			'location.basic.geo': ['151.2099', '-33.865143'],
		}, function () {
			demand(testItem.location.basic.geo[0]).be(151.2099);
			demand(testItem.location.basic.geo[1]).be(-33.865143);

			List.fields['location.basic'].updateItem(testItem, {
				'location.basic.geo_lat': '',
				'location.basic.geo_lng': '',
			}, function () {
				demand(testItem.location.basic.geo).be.undefined();
				done();
			});
		});
	});

	it('should validate required fields', function () {
		List.fields['location.basic'].inputIsValid({}, true, testItem).must.be.false();
		List.fields['location.basic'].inputIsValid({
			'location.basic.street1': 'street1',
			'location.basic.city': '',
		}, true, testItem).must.be.false();
		List.fields['location.basic'].inputIsValid({
			'location.basic.street1': 'street1',
			'location.basic.city': 'city',
		}, true, testItem).must.be.true();
		List.fields['location.basic'].inputIsValid({
			location: { basic: {
				street1: 'street1',
				city: 'city',
			} },
		}, true, testItem).must.be.true();
		List.fields['location.customRequired'].inputIsValid({
			'location.customRequired.street1': 'street1',
			'location.customRequired.city': 'city',
		}, true, testItem).must.be.false();
		List.fields['location.customRequired'].inputIsValid({
			'location.customRequired.state': 'state',
			'location.customRequired.country': 'country',
		}, true, testItem).must.be.true();
	});
};
