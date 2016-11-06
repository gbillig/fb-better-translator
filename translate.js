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
		return;
	}

	//console.log(story.get(0));
	//console.log(story_content);

	processed_stories.push(story_elem.id);

	//using french version to force translation on many stories, for testing
	var div_translate = story_content.find("a:contains('Voir la traduction')");
	if (div_translate.length == 0) {
		return;
	}

	console.log(story_elem);	

}
