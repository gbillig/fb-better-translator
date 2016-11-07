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

	var story_text = "";
	story_content.children("div").children("p").each(function(index) {
		story_text = story_text + $(this).text();
	});

	story_content.children("div").append('<div><div><span><div id="translated_text"></div></span></div></div>');
	story_content.children("div").append('<div><a href="#" role="button">Voir la traduction Google</a></div>');

	var translated_elem = story_content.find("div[id='translated_text']");

	translate(story_text, translated_elem);

	console.log(story_content);
}

// translation function

/* Written by Amit Agarwal */
/* web: ctrlq.org          */

// https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&targetLang=en&dt=t&q=Bonjour
function translate(sourceText, elem) {
  
	var sourceLang = 'auto'; 
	var targetLang = 'fr';

	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
		+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
	
	var xmlHttp = new XMLHttpRequest();  
   
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200) {
			//var data = JSON.parse(xmlHttp.responseText);
			console.log(xmlHttp);

			var regex = /(["'])(?:(?=(\\?))\2.)*?\1/;

			var translation = regex.exec(xmlHttp.responseText);
			var translated_string = translation[0].slice(1, -1);
			console.log(translated_string);

			elem.html(translated_string);

			/*
			rating = data.imdbRating;

			if (rating == undefined) {
				rating = "N/A";
			}
			
			element.html('<b>' + rating + '</b>\xa0' + year);
			*/
		}
	};

	xmlHttp.open('GET', url, true);
	xmlHttp.send();
}


