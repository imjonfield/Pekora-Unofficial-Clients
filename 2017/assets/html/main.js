$('a').on('tap', function(e){
	e.preventDefault();
});

$( function() {
	// Make sure this runs first, otherwise we can't see the page outside the app
	$("#moreContainer").fadeIn(500);
	//$("#eventsContainer").fadeIn(500);

	//interface.LogMessage("inside the more page");
	var raw = interface.getInitSettings();
	var settings = JSON.parse(raw);
	//console.log("raw settings: " + settings);

	// load  string resources
	var rawStringResources = interface.getStringResources();
    var stringResources = JSON.parse(rawStringResources);


	$(".lang-label").each(function(){
		var key = $(this).data("lang-key");
		$(this).html(stringResources[key]);
	});


	interface.fireScreenLoaded()

	if (settings.isMobile)
	{
		$("#lnkCatalog").on('click', function(){
			interface.navigateToFeature("Catalog");
		});
	}

	// Updates the action bar as we move between pages
	$("#btnProfile").on('click', function(){
		interface.navigateToFeature("Profile");
	});
	if (!settings.isMobile)
	{
		$("#btnCharacter").on('click', function(){
			interface.navigateToFeature("Character");
		});	
	}

	$("#btnInventory").on('click', function(){
		interface.navigateToFeature("Inventory");
	});
	if (!settings.isMobile)
	{
		$("#btnTrade").on('click', function(){
			interface.navigateToFeature("Trade");
		});
	}

	$("#btnGroups").on('click', function(){
		interface.navigateToFeature("Groups");
	});
	if (!settings.isMobile)
	{
		$("#btnForum").on('click', function(){
			interface.navigateToFeature("Forum");
		});
	}

	$("#btnBlog").on('click', function(){
		interface.navigateToFeature("Blog");
	});

	$("#btnHelp").on('click', function(){
		interface.navigateToFeature("Help");
	});
	$("#btnSettings").on('click', function(){
		interface.navigateToFeature("Settings");
	});

	$("#btnBuilderClub").on('click', function(){
		interface.openBuilderClubDialog();
	});

	$("#btnMessages").on('click', function(){
		interface.navigateToFeature("Messages");
	});

	$("#btnVRMode").on('click', function(){
		interface.openVRModeDialog();
	});

    $("#btnFriends").on('click', function(){
		interface.navigateToFeature("Friends");
	});

	if(settings.isMobile && settings.vrFeatureEnabled) {
	    // Hide Builders Club to make space for the VR button
	    $("#btnBuilderClub").hide();
	} else {
        $("#lnkVRMode").hide();
	}

    if (settings.isEmailNotificationEnabled)
        $("#btnSettingsImg").attr("src", "img/icon_settings_notification.png");

	// Set up the events page
	// We aren't guaranteed to have /any/ events, so we wait to fade in the events div
	// until we know for sure
	if ("eventsData" in settings)
	{
		var events = JSON.parse(settings.eventsData);
		//console.log("Num events: " + events.length);
		//console.log("settings.eventsData = " + events[0]);
		//console.log("LogoImageURL? = " + events[0].LogoImageURL);
		//console.log("eventsData is present: " + settings.eventsData);

		if(events.length > 0 ){
		    parseEvents(settings.baseUrl, events, settings.isMobile, settings.useCompatibility);
		}else{
		    $("#eventsContainer").hide();
            		console.log("no eventsData :(");
		}
	}

});

function parseEvents(baseUrl, events, isMobile, useCompatibility) {
	if (isMobile && events.length > 2)
	{
		var specClass = "";
		if (useCompatibility)
			specClass = " compatibility";

		var cnt = 0;
		var appendOpening = "<div class=\"longRow\">";
		var appendClosing = "</div>";
		var inner = "";
		var logStr = "";
		for (var i = 0; i < events.length; i++)
		{
			inner += "<a href=\"" + baseUrl + events[i].PageUrl + "\"><div class=\"halfBtn\"><img class=\"" + specClass + "\" src=\"" + events[i].LogoImageURL + "\" /></div></a>";
			cnt++;
			if (cnt == 2)
			{
				logStr = appendOpening + inner + appendClosing;
				//console.log("cnt: " + cnt + " | i: " + i + " | logStr: " + logStr);
				$("#eventsContainer").append(logStr);
				inner = "";
				cnt = 0;
			}
		}
		if (cnt == 1)
			$("#eventsContainer").append(appendOpening + inner + appendClosing);

		//console.log("FINAL: " + logStr);
		//console.log("innerHTML: " + $("#eventsContainer").innerHTML());
	}
	else { // on tablets, we only have 1 button per row
		var specClass = "";
		if (useCompatibility)
			specClass = "halfBtnCompat fullBtnCompat";
		else
			specClass = "halfBtn fullBtn";

		for (var i = 0; i < events.length; i++)
		{
			var row = "<div class=\"longRow\"><a href=\"" + baseUrl + events[i].PageUrl + "\"><div class=\"" + specClass + "\"><img src=\"" + events[i].LogoImageURL + "\" /></div></div></a>";
			$("#eventsContainer").append(row);	
		}
	}

	// Fade in the events after everything is loaded
	$("#eventsContainer").fadeIn(500);
}

function testFunction(obj) {
	console.log("inside testFunction, param: " + obj);
}