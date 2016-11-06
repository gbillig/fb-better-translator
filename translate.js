console.log("Extension ran!");


var newsfeed = $("div[id^='feed_stream']").get(0);

console.log(newsfeed);

// currently, the observer will find all news feed stories
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
	var mutation_dom_id = mutation.target.id;
	if (mutation_dom_id && mutation_dom_id.startsWith("hyperfeed_story")) {
    	console.log(mutation);
	}
  });    
});

var config = { attributes: true, childList: true, characterData: true, subtree: true};
observer.observe(newsfeed, config);
//observer.disconnect();

