/*
Copyright (c) 2013 Technicat, LLC. All Rights Reserved. MIT License.
http://github.com/technicat/LearnUnity
*/

// UnityGUI-based pause menu

#pragma strict

var skin:GUISkin;
var startPaused:boolean = true;
var menutop:int=25;
var goal:String = "Do you want to play a game?";
var hudColor:Color = Color.white;

// fill in the help text that is initially presented
var help:String[] = ["ESC - pause game"];

// fill in the credit info for your game
var credits:String[]=[
	"A Fugu Games Production",
	"Copyright (c) 2012 Technicat, LLC. All Rights Reserved.",
	"More information at http://fugugames.com/"] ;

enum Page {
	None,Main,Options,Credits,Help
}

private var startTime = 0.1;
private var savedTimeScale:float;

private var currentPage:Page;


function Start() {
	if (startPaused) {
		PauseGame();
	}
}

function Update() {
	if (Input.GetKeyDown(KeyCode.Escape))
	{
		switch (currentPage) {
		case Page.None: PauseGame(); break; // if the pause menu is not displayed, then pause
		case Page.Main: UnPauseGame(); break; // if the main pause menu is displaying, then unpause
		default: currentPage = Page.Main; // any subpage goes back to main page
		}
	}
}

function OnGUI () {
	if (IsGamePaused()) {
		if (skin != null) {
			GUI.skin = skin;
		} else {
			GUI.color = hudColor;
		}
		switch (currentPage) {
			case Page.Main: ShowPauseMenu(); break;
			case Page.Options: ShowOptions(); break;
			case Page.Credits: ShowCredits(); break;
		}
	}	
}
// credits

function ShowCredits() {
	BeginPage(300,300);
	for (var credit in credits) {
		GUILayout.Label(credit);
	}
	EndPage();
}

// options

private var toolbarInt:int=0;
private var toolbarStrings: String[]= ["Audio","Graphics","System"];

function ShowOptions() {
	BeginPage(318,300);
	toolbarInt = GUILayout.Toolbar (toolbarInt, toolbarStrings);
	switch (toolbarInt) {
		case 0: ShowAudio(); break;
		case 1: ShowGraphics();  break;
		case 2: ShowSystem(); break;
	}
	EndPage();
}

function Available(isAvailable) {
	return isAvailable ? "Available" : "Not Available";
}

function ShowSystem() {
//	GUILayout.Label ("Unity player version "+Application.unityVersion);
	GUILayout.Label("Graphics: "+SystemInfo.graphicsDeviceName+" "+
	SystemInfo.graphicsMemorySize+"MB\n"+
	SystemInfo.graphicsDeviceVersion+"\n"+
	SystemInfo.graphicsDeviceVendor);
	GUILayout.Label("Shadows: "+ Available(SystemInfo.supportsShadows));
	GUILayout.Label("Image Effects: "+Available(SystemInfo.supportsImageEffects));
	GUILayout.Label("Render Textures: "+Available(SystemInfo.supportsRenderTextures));
}

function ShowGraphics() {
	GUILayout.Label(QualitySettings.names[QualitySettings.GetQualityLevel()]);
	GUILayout.Label("Pixel Light Count: "+QualitySettings.pixelLightCount);
	GUILayout.Label("Shadow Cascades: "+QualitySettings.shadowCascades);
	GUILayout.Label("Shadow Distance: "+QualitySettings.shadowDistance);
	GUILayout.Label("Soft Vegetation: "+QualitySettings.softVegetation);
	GUILayout.BeginHorizontal();
	if (GUILayout.Button("Decrease")) {
		QualitySettings.DecreaseLevel();
	}
	if (GUILayout.Button("Increase")) {
		QualitySettings.IncreaseLevel();
	}
	GUILayout.EndHorizontal();
}

function ShowAudio() {
	GUILayout.Label("Volume");
	AudioListener.volume = GUILayout.HorizontalSlider(AudioListener.volume,0.0,1.0);
}

function BeginPage(width:int,height:int) {
	GUILayout.BeginArea(Rect((Screen.width-width)/2,menutop,width,height));
}

function EndPage() {
	// show Back button if not Main page
	if (currentPage != Page.Main && GUILayout.Button("Back")) {
		currentPage = Page.Main;
	}
	GUILayout.EndArea();
}

function ShowBackButton() {
	if (GUI.Button(Rect(20,Screen.height-50,50,20),"Back")) {
		currentPage = Page.Main;
	}
}


function IsBeginning() {
	return Time.time < startTime;
}

function ShowPauseMenu() {
	BeginPage(150,300);
	if (GUILayout.Button (IsBeginning() ? "Play" : "Continue")) {
		UnPauseGame();
	}
	if (GUILayout.Button ("Options")) {
		currentPage = Page.Options;
	}
	if (GUILayout.Button ("Credits")) {
		currentPage = Page.Credits;
	}
	if (GUILayout.Button ("Quit")) {
		Application.Quit();
	}
	if (IsBeginning()) {
		GUILayout.Label(goal);
		GUILayout.Label("Hit ESC key to pause");
	}
	EndPage();
}

function PauseGame() {
	savedTimeScale = Time.timeScale;
	Time.timeScale = 0;
	AudioListener.pause = true;
	currentPage = Page.Main;
}

function UnPauseGame() {
	Time.timeScale = savedTimeScale;
	AudioListener.pause = false;
	currentPage = Page.None;
}

static function IsGamePaused() {
	return Time.timeScale==0;
}



