var request = require('request');
var cheerio = require('cheerio');

var notifyMe = function (p_title, p_body, p_url, is_message){
	var request_options = {
		url:'https://api.pushbullet.com/v2/pushes',
		form: {
			channel_tag:"censored",
			type: "note",
			title: p_title,
			body: p_body
		},
		headers: {
			"Access-Token":"censored"
		}
	};
	if(!is_message){
		request_options.form.type='link';
		request_options.form.url=p_url;
	}
	request.post(request_options, function (error, response, body) {
		console.log('notifyMe result', error, body);
	});
};

var global_offers = [];

var scraper_function = function(not_interval_called){
	console.log('Scraper function started with param:', not_interval_called, 'at time:', (new Date()).toLocaleString());
	request({
		url: 'censored',
		headers: {
			'User-Agent': 'censored'
		}
	}, function (error, response, html) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var result_offers = [];
			$('.offer', '#offers_table').each(function(i, offer){
				if ( $('strong', '.price', offer )[0] ){
					var one_offer = {
						url: $('a.link.linkWithHash', offer )[0].attribs.href.toString().split('#')[0],
						price: $('strong', '.price', offer )[0].children[0].data.toString().trim(),
						title: $('strong', 'a.link.linkWithHash', offer )[0].children[0].data.toString().trim(),
						place: $('span', 'small.breadcrumb.x-normal', offer )[0].children[0].data.toString().trim(),
						time: $('p.color-9.lheight16.marginbott5.x-normal', offer )[0].children[0].data.toString().trim()
					}
					if( global_offers.indexOf(one_offer.url) === -1 ){
						global_offers.push(one_offer.url);
						if( one_offer.place.toString().indexOf('oliborz') > -1 || one_offer.place.toString().indexOf('Bielany') > -1 ){
							if(!not_interval_called){
								console.log('notifying about new offer', one_offer);
								var title = one_offer.price + ' ' + one_offer.place;
								var body =  one_offer.time + ' ' + one_offer.title;
								notifyMe(title, body, one_offer.url);
							}else{
								console.log('loading on start:', one_offer);
							}
						}else{
							console.log('blacklisted place offer:', one_offer);
						}
					}
				}
			});
		}else{

			console.error(error);
			console.log('Exiting process because of error', error, 'responseCode', response.statusCode);
			notifyMe('Error bad response statusCode or error', 'scrap_and_pushbullet', null, true);
			process.exit(1);
		}
	});
}
scraper_function(true);
var interval = setInterval(scraper_function, 1234*666);
