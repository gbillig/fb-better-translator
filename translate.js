console.log("Extension ran!");

var newsfeed = $("div[id^='feed_stream']").get(0);
var processed_stories = [];

// currently, the observer will find all news feed stories
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
	var mutation_dom_id = mutation.target.id;
	if (mutation_dom_id && mutation_dom_id.startsWith("hyperfeed_story")) {
		if (processed_stories.includes(mutation_dom_id) == false) {
			process_story(mutation.target);
		}
	}

	});
});

var config = { attributes: true, childList: true, characterData: true, subtree: true};
observer.observe(newsfeed, config);
//observer.disconnect();

function process_story(story_elem) {

	var story = $(story_elem);
	var story_content = story.find(".userContent");

	if (story_content.length == 0) {
		// if there is no userContent div, then the story is empty or not loaded
		return;
	}

	processed_stories.push(story_elem.id);

	//using french version to force translation on many stories, for testing
	var div_translate = story_content.find("a:contains('Voir la traduction')");

	if (div_translate.length == 0) {
		// if the translation option isn't displayed, ignore the story
		return;
	}

	var i;
	var story_text;
	var cur_story;
	console.log(story_content);
	for (i = 0; i < story_content.length; i++) {
		console.log(story_content[i]);
		cur_story = $(story_content[i]);
		story_text = "";
		cur_story.children("div").children("p").each(function(index) {
			story_text = story_text + $(this).text();
		});

		cur_story.children("div").append('<div><div><span><div id="translated_text"></div></span></div></div>');
		cur_story.children("div").append('<div><a href="#" role="button">Voir la traduction Google</a></div>');

		var translated_elem = cur_story.find("div[id='translated_text']");

		translate(story_text, translated_elem);

	}
}

// translation function

/* Written by Amit Agarwal */
/* web: ctrlq.org          */

// https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&targetLang=en&dt=t&q=Bonjour
function translate(sourceText, elem) {

	var sourceLang = 'auto'; 
	var targetLang = 'fr';

	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
		+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURIComponent(sourceText);
	
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200) {
			//var data = JSON.parse(xmlHttp.responseText);
			console.log(xmlHttp);

			var decoded_response = decodeURIComponent(xmlHttp.responseText);
			var response = decoded_response.replace(
							/\\u([0-9a-f]{4})/g, 
							function (whole, group1) {
								return String.fromCharCode(parseInt(group1, 16));
							});

			var translated_string = translate_parse(response);
			console.log(translated_string);
			elem.html(translated_string);
		}
	};

	xmlHttp.open('GET', url, true);
	xmlHttp.send();
}

function translate_parse(input) {
	var length = input.length;
	if (length < 3) {
		return;
	}

	var result = '';
	var is_segment = false;
	var a;
	var b = input[0]
	var c = input[1]
	var d = input[2];

	var i;
	for (i = 3; i < length; i++) {
		a = b;
		b = c;
		c = d;
		d = input[i];

		if (is_segment) {
			if (c == '"' && d == ',') {
				is_segment = false;
			} else {
				result = result + c;
			}
		}

		if (c == "[" && d == '"') {
			i++;
			d = input[i];
			is_segment = true;
		}
	
		if (a == ',' && b == ',' && c == ',' && d == ',') {
			break;
		}
	}

	return result;
}


